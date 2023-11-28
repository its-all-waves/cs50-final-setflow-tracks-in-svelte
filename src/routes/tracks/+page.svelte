<script>
	import { onMount } from 'svelte'

	import { newScene, newTrackListItem } from '../../lib/TableObjects/Scene'
	import { newCharacter } from '../../lib/TableObjects/Character'

	// TODO: GET RID OF ME
	import {
		table,
		charactersInHand,
		selectedDropZones,
		canEdit,
		selectedHeader,
		chosenCharacter
	} from './store'

	import {
		DEV_populate_table,
		// state,
		// send,
		// Test,
		// State,
		// Msg,
		feedback,
		// characterInHand,
		// selectedHeader,
		// selectedCharacters,
		// selectedDropZones,
		characters,
		tracks,
		scenes,
		characterInHand,
		send,
		Msg
	} from './machine'

	import Table from './table.svelte'
	import Character from './character.svelte'
	import Toolbar from './toolbar.svelte'

	import DEBUG_INFO from './DEBUG_INFO.svelte'
	import DebugInfo from './DEBUG_INFO.svelte'
	import { nanoid } from 'nanoid'

	/**
	 * 	@type {import('./$types').PageData} */
	export let data // receive data obj from "server", then pass into the store
	$table = data.table

	/** Add tracks to the global table object */
	function submitTracks(event) {
		if (event.key !== 'Enter') return

		let label = document.querySelector("input[name='track-prefix']").value
		let count = document.querySelector("input[name='track-count']").value

		// TODO: sanitize inputs
		// must have 2 valid track inputs to proceed
		if (!label || !count) return

		// TODO: if label already exists in tracks, keep counting
		// e.g. if "Track 1" - "Track 5" exist, this adds "Track 6"+

		for (let i = 0; i < count; i++) {
			const name = `${label}_${i + 1}`
			const id = `trk_${nanoid(9)}`
			$tracks[id] = { name }
		}
		$tracks = $tracks

		// clear input fields
		label = null
		count = null
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

	function handleKeyPress(event) {
		switch (event.key) {
			case 'Enter':
				commitDropZones()
				break
			case 'Delete': // fall thru
			case 'Backspace':
				deleteButton.click()
				break
		}
	}

	function commitDropZones(event) {
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
		$chosenCharacter = {}
		$selectedDropZones = []
		$selectedHeader = {}
	}

	/** Helper for commitDropZones() \
	 * put the CHARACTER on this TRACK, in this SCENE */
	function addCharacterInHandToSelectedScenes() {
		if ($charactersInHand.length !== 1) {
			throw new Error('No idea how we got here...')
		}

		const characterInHand = $charactersInHand[0]

		for (let i = 0; i < $selectedDropZones.length; i++) {
			const { sceneName, trackName } = $selectedDropZones[i]

			const scene = $table.scenes.find((_) => _.name === sceneName)

			// TODO: handle error - scene undefined

			// keep from duplicating a trackListItem
			const existingTrackListItemForTrack = scene.trackList.find(
				(_) => _.trackName === trackName
			)
			if (existingTrackListItemForTrack) {
				// add to it
				existingTrackListItemForTrack.characterNames.push(characterInHand.name)
				continue
			}

			// add a new track list item for this track
			scene.trackList = scene.trackList.concat(
				newTrackListItem(trackName, characterInHand.name)
			)
		}
		$table.scenes = $table.scenes
	}

	$: charactersEntries = Object.entries($characters)

	// DEBUG
	onMount(DEV_populate_table)
</script>

<svelte:window on:keydown={handleKeyPress} />

<main class="container">
	<article>
		<!-- does character in hand need to be a bind: ? -->
		<Toolbar />
		<!-- a poor-man's OR op? -->
		{#if Object.keys($tracks).length + Object.keys($scenes).length > 0}
			<div class="table">
				<Table />
			</div>
		{/if}
	</article>

	<div class="character-pool">
		{#each charactersEntries as [id, { name }]}
			<Character {id} />
		{/each}
		<button
			id="btn-commit"
			class:hidden={$characterInHand == null}
			on:click={() => {
				send(Msg.COMMIT_CHARACTER_TO_TABLE)
			}}
		>
			&#x2713
		</button>
	</div>

	<DebugInfo />

	<!-- <form class="inputs">
		<div class="track-input">
			<input
				autofocus
				name="track-prefix"
				type="text"
				class=""
				value={trackPrefix}
				on:keydown={submitTracks}
			/>
			<span> X </span>
			<input
				name="track-count"
				type="text"
				class=""
				value={trackCount}
				on:keydown={submitTracks}
			/>
		</div>

		<div class="scene-input">
			<input
				name="scene-name"
				type="text"
				class=""
				placeholder="add a scene"
				on:keydown={submitScene}
			/>
		</div>

		<div class="actor-input">
			<input
				name="actor-name"
				type="text"
				class=""
				placeholder="add a character"
				on:keydown={submitCharacter}
			/>
		</div>
	</form> -->
</main>

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
