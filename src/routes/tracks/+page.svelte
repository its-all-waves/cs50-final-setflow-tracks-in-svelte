<script>
	import { onMount } from 'svelte'

	import { newTrack } from '../../lib/TableObjects/Track'
	import { newScene, newTrackListItem } from '../../lib/TableObjects/Scene'
	import { newCharacter } from '../../lib/TableObjects/Character'

	import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

	import Table from './table.svelte'
	import Character from './character.svelte'
	import Toolbar from './toolbar.svelte'

	/**
	 * 	@type {import('./$types').PageData} */
	export let data // receive data obj from "server", then pass into the store
	$table = data.table

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
			$table.tracks = $table.tracks.concat(track)
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
		$table.scenes = $table.scenes.concat(newScene(name))

		// clear the input field
		inputField.value = null
	}

	/** Add a character to the global table object */
	function submitCharacter(event) {
		if (event.key !== 'Enter') return

		let inputField = event.target
		const name = inputField.value.replace(' ', '_')

		// TODO: validate input
		if (!name) return

		// create a character, push it to characters[]
		$table.characters = $table.characters.concat(newCharacter(name))

		sortCharactersAtoZ()

		inputField.value = null
	}

	function sortCharactersAtoZ() {
		const characters = $table.characters
		let swapCounter = -1
		while (true) {
			if (swapCounter === 0) break
			swapCounter = 0
			for (let i = 0; i < characters.length - 1; i++) {
				const name1 = characters[i].name
				const name2 = characters[i + 1].name
				const name1BelongsBeforeName2 = name1.localeCompare(name2) < 0
				if (name1BelongsBeforeName2) continue
				const temp = characters[i]
				characters[i] = characters[i + 1]
				characters[i + 1] = temp
				swapCounter++
			}
		}
		$table.characters = characters
	}

	function commitDropZones(event) {
		// committing is executed only by Enter key (+focus) or button click
		if (event.type !== 'pointerup' && event.key !== 'Enter') return

		// unknown case atm
		if ($charactersInHand.length === 0) {
			throw new Error('But how did we get here, tho?')
		}

		// currently the only valid case
		else if ($charactersInHand.length === 1) {
			// one character in hand and have not selected a track or scene
			addCharacterInHandToSelectedScenes()
		}

		// characters in hand > 1
		else {
			throw new Error("We haven't a need for this case yet...")
		}

		clearAllSelections()
	}

	/** Helper for commitDropZones() \
	 * Forget what's currently selected */
	function clearAllSelections() {
		$charactersInHand = []
		$selectedDropZones = []
		$selectedHeader = {}
	}

	/** Helper for commitDropZones() \
	 * put the CHARACTER on this TRACK, in this SCENE */
	function addCharacterInHandToSelectedScenes() {
		if ($charactersInHand.length !== 1) {
			throw new Error('No idea how we got here...')
		}

		for (let i = 0; i < $selectedDropZones.length; i++) {
			const { sceneName, trackName } = $selectedDropZones[i]

			const scene = $table.scenes.find((_) => _.name === sceneName)

			// TODO: handle error - scene undefined

			scene.trackList = scene.trackList.concat(
				newTrackListItem(trackName, $charactersInHand[0].name)
			)
			$table.scenes = $table.scenes
		}
	}

	// DEBUG
	onMount(DEV_populate_table)

	function DEV_populate_table() {
		// add X tracks
		const NUM_TRACKS = 4
		for (let i = 0; i < NUM_TRACKS; i++) {
			$table.tracks[i] = newTrack('Track_' + (i + 1))
		}

		// add 2 scenes
		$table.scenes[0] = newScene('33-A')
		$table.scenes[1] = newScene('66-B')
		// $table.scenes[2] = newScene('101-D')
		// $table.scenes[3] = newScene('V-101-C')

		// add characters
		$table.characters[0] = newCharacter('Né-né')
		$table.characters[1] = newCharacter('Zina')
		$table.characters[2] = newCharacter('Yuki')
		$table.characters[3] = newCharacter('Igor')
		// $table.characters[4] = newCharacter('Alex')
	}

	// // DEBUG
	// $: console.log(`$selectedHeader changed to: ${JSON.stringify($selectedHeader)}`)
	// $: console.log(`$charactersInHand changed to: ${JSON.stringify($charactersInHand)}`)
</script>

<svelte:window on:keydown={$charactersInHand.length === 1 && commitDropZones} />

<div class="container">
	<article>
		<!-- does character in hand need to be a bind: ? -->
		<Toolbar {clearAllSelections} />
		<!-- a poor-man's OR op? -->
		{#if $table.tracks.length + $table.scenes.length > 0}
			<div
				class="table"
				class:glow={$canEdit}
			>
				<Table resetUiSelectionFlags={clearAllSelections} />
			</div>
		{/if}
	</article>

	<div class="character-pool">
		{#each $table.characters as character}
			<Character
				name={character.name}
				location="__pool__"
			/>
		{/each}
		<button
			id="btn-commit"
			class:hidden={$charactersInHand.length === 0}
			on:pointerup={commitDropZones}
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
		margin: 1.5rem;
		border: 1px solid rgb(0, 157, 255);
		border-radius: 1.5rem;
		min-height: 3rem;

		/* overflow-x: auto; */
		/* overflow-y: visible; */
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 1rem;
		font-size: 2.4rem;
		text-shadow: 0 0.2rem 0 black;
		width: 3ch;
		background-color: #124266;
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

		/* position: sticky; */
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
