<script>
	import { onMount } from 'svelte'

	import { newTrack } from '../../lib/TableObjects/Track'
	import { newScene, newTrackListItem } from '../../lib/TableObjects/Scene'
	import { newCharacter } from '../../lib/TableObjects/Character'

	import Table from './table.svelte'
	import Character from './character.svelte'
	import Toolbar from './toolbar.svelte'

	/**
	 * 	@type {import('./$types').PageData} */
	export let data

	/**
	 * @type {string}
	 * the character's name */
	let characterInHand = null
	/**
	 * @type {DropZoneInfo[]} */
	let selectedDropZones = []

	let canEdit = true

	// form input defaults / placeholders
	let trackCount = 4
	let trackPrefix = 'track'

	/** Add tracks to the global table object */
	function submitTracks(event) {
		if (event.key !== 'Enter') return

		let trackPrefixVal = document.querySelector("input[name='track-prefix']").value
		let trackCountVal = document.querySelector("input[name='track-count']").value

		// TODO: sanitize inputs
		// must have 2 valid track inputs to proceed
		if (!trackPrefixVal || !trackCountVal) return

		trackPrefix = trackPrefixVal
		trackCount = trackCountVal

		// CREATE THE DATA STRUCTURES
		// push new tracks to table.tracks
		for (let i = 0; i < trackCount; i++) {
			const track = newTrack(`${trackPrefix}_${i + 1}`)
			data.table.tracks = data.table.tracks.concat(track)
		}

		// clear input fields
		trackPrefix = null
		trackCount = null
	}

	/** Add a scene to the global table object */
	function submitScene(event) {
		if (event.key !== 'Enter') return

		const inputField = event.target
		const name = inputField.value.replace(' ', '_')

		// TODO: sanitize input
		if (!name) return

		// create a scene, push it to scenes[]
		data.table.scenes = data.table.scenes.concat(newScene(name))

		// clear the input field
		inputField.value = null
	}

	/** Add a character to the global table object */
	function submitCharacter(event) {
		if (event.key !== 'Enter') return

		let inputField = event.target
		const name = inputField.value.replace(' ', '_')

		// TODO: sanitize input
		if (!name) return

		// create a character, push it to characters[]
		data.table.characters = data.table.characters.concat(newCharacter(name))

		inputField.value = null
	}

	function commitDropZones(event) {
		// committing is executed only by Enter key (+focus) or button click
		if (event.type !== 'pointerup' && event.key !== 'Enter') {
			return
		}

		addCharacterToSelectedScenes()

		resetUiSelectionFlags()
	}

	/** Helper for commitDropZones() \
	 * Forget what's currently selected */
	function resetUiSelectionFlags() {
		characterInHand = null
		selectedDropZones = []
	}

	/** Helper for commitDropZones() \
	 * put the CHARACTER on this TRACK, in this SCENE */
	function addCharacterToSelectedScenes() {
		if (!characterInHand) {
			throw new Error('No idea how we got here (populateDropZone())...')
		}

		for (let i = 0; i < selectedDropZones.length; i++) {
			const { sceneName, trackName } = selectedDropZones[i]

			const scene = data.table.scenes.find((_) => _.name === sceneName)

			// TODO: handle error - scene undefined

			scene.trackList = scene.trackList.concat(newTrackListItem(trackName, characterInHand))
		}
	}

	// DEBUG
	onMount(DEV_populate_table)

	function DEV_populate_table() {
		// add X tracks
		const NUM_TRACKS = 4
		for (let i = 0; i < NUM_TRACKS; i++) {
			data.table.tracks[i] = newTrack('Track_' + (i + 1))
		}

		// add 2 scenes
		data.table.scenes[0] = newScene('33A')
		data.table.scenes[1] = newScene('66B')

		// add characters
		data.table.characters[0] = newCharacter('Alex')
		data.table.characters[1] = newCharacter('Zina')
		data.table.characters[2] = newCharacter('Yuki')
		data.table.characters[3] = newCharacter('Igor')
	}
</script>

<div class="container">
	<article>
		<Toolbar
			bind:canEdit
			bind:scenes={data.table.scenes}
		/>
		<!-- a poor-man's OR op? -->
		{#if data.table.tracks.length + data.table.scenes.length > 0}
			<div
				class="table"
				class:glow={canEdit}
			>
				<Table
					{data}
					{canEdit}
					bind:selectedDropZones
					bind:characterInHand
				/>
			</div>
		{/if}
	</article>

	<div class="character-pool">
		{#each data.table.characters as character}
			<!-- bind:characterInHand allows Character to update the var and re-render this element -- 2-way binding, as opposed to normal passing from parent into child -->
			<Character
				characterName={character.name}
				bind:characterInHand
			/>
		{/each}
		<button
			class:hidden={!characterInHand}
			on:pointerup={commitDropZones}
			on:keypress={commitDropZones}
		>
			&#x2713
		</button>
	</div>

	<form class="inputs">
		<div class="track-input">
			<input
				autofocus
				name="track-prefix"
				type="text"
				class=""
				value={trackPrefix}
				on:keypress={submitTracks}
			/>
			<span> X </span>
			<input
				name="track-count"
				type="text"
				class=""
				value={trackCount}
				on:keypress={submitTracks}
			/>
		</div>

		<div class="scene-input">
			<input
				name="scene-name"
				type="text"
				class=""
				placeholder="add a scene"
				on:keypress={submitScene}
			/>
		</div>

		<div class="actor-input">
			<input
				name="actor-name"
				type="text"
				class=""
				placeholder="add a character"
				on:keypress={submitCharacter}
			/>
		</div>
	</form>
</div>

<style>
	/* should be end selector ($=, not *=), but would not work */
	.track-input {
		display: grid;
		grid-template-columns: 2fr 0.2fr 2fr;
		align-items: center;
	}

	.track-input span {
		text-align: center;
	}

	.h-scroll {
		overflow-x: auto;
	}

	.v-scroll {
		/* counter-intuitively, overflow must be unchanged to allow sticky thead */
		/* overflow-y: auto; */
	}

	article {
		overflow-y: auto;
		margin-top: 0;
		padding-top: 0;
	}

	.table {
		max-height: 80%;
		overflow: auto;
	}

	button {
		margin: 1rem;
		padding: 0.5rem;
	}

	.character-pool {
		position: relative;
		display: flex;
		align-items: center;
		margin: 1.5rem;
		border: 1px solid rgb(0, 157, 255);
		border-radius: 1.5rem;
		min-height: 3rem;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 1rem;
		font-size: 2.4rem;
		text-shadow: 0 0.2rem 0 black;
		width: 3ch;
		background-color: rgba(0, 157, 255, 0.265);
		border: 2px solid rgb(0, 157, 255);
		color: white;
	}

	.character-pool button {
		position: absolute;
		right: 0;
		border-radius: 0 1.5rem 1.5rem 0;
		height: 100%;

		padding: 0;
		margin: 0;
	}

	.character-pool button {
		/* background-color: rgb(0, 157, 255); */
	}

	.hidden {
		display: none !important;
	}

	form.inputs {
		margin: 3rem;
	}

	/* applies to table's container when canEdit */
	.glow {
		box-shadow: 0 0 36px #885df1;
	}
</style>
