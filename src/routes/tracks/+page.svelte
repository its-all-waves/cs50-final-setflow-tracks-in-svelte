<script>
	import { onMount } from 'svelte'

	import { newTrack } from '../../lib/TableObjects/Track'
	import { newScene, newTrackListItem } from '../../lib/TableObjects/Scene'
	import { newCharacter } from '../../lib/TableObjects/Character'

	import {
		state,
		ctx,

		// to be replaced 👇🏽
		table,
		charactersInHand,
		selectedDropZones,
		canEdit,
		selectedHeader,
		chosenCharacter
	} from './store'

	import Table from './table.svelte'
	import Character from './character.svelte'
	import Toolbar from './toolbar.svelte'

	// receive data obj from "server", then pass into the store
	/**
	 * 	@type {import('./$types').PageData} */
	export let data
	$state = data.state

	// form input defaults / placeholders
	let trackCount = 4
	let trackPrefix = 'track'

	let deleteButton

	/** Add tracks to the state/$ object */
	function submitTracks(event) {
		if (event.key !== 'Enter') return

		let trackPrefixVal = document.querySelector("input[name='track-prefix']").value
		let trackCountVal = document.querySelector("input[name='track-count']").value

		// TODO: sanitize inputs
		// must have 2 valid track inputs to proceed
		if (!trackPrefixVal || !trackCountVal) return

		trackPrefix = trackPrefixVal
		trackCount = trackCountVal

		// const { ctx } = $state

		// CREATE THE DATA STRUCTURES
		// push new tracks to table.tracks
		let tracks
		for (let i = 0; i < trackCount; i++) {
			const track = newTrack(`${trackPrefix}_${i + 1}`)
			tracks.push(track)
		}
		$state.ctx.tracks = tracks

		// clear input fields
		trackPrefix = null
		trackCount = null
	}

	/** Add a scene to the state/$ object */
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

	/** Add a character to the state/$ object */
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

	// DEBUG
	onMount(DEV_populate_table)

	/** *DO NOT CHANGE VALUES IN THIS FUNCTION, TESTS DEPEND ON THEM.* \
	 * YOU MAY ADD MORE... I THINK?
	 */
	function DEV_populate_table() {
		// enum
		const Test = Object.freeze({
			character_NeNe: 'Né-né',
			character_Zina: 'Zina',
			character_Yuki: 'Yuki',
			character_Igor: 'Igor',
			track_1: 'Track 1',
			track_2: 'Track 2',
			track_3: 'Track 3',
			track_4: 'Track 4',
			scene_33_A: '33-A',
			scene_66_B: '66-B',
			scene_101_D: '101-D',
			scene_V_101_C: 'V-101-C'
		})

		for (const key in Test) {
			if (!key.startsWith('character')) continue
			const name = Test[key]
			$state.ctx.characters[name] = { name }
		}

		for (const key in Test) {
			if (!key.startsWith('track')) continue
			const name = Test[key]
			$state.ctx.tracks[name] = { name }
		}

		for (const key in Test) {
			if (!key.startsWith('scene')) continue
			const name = Test[key]
			$state.ctx.scenes[name] = { name, trackList: {} }
			const { trackList } = $state.ctx.scenes[name]
			for (const track in $state.ctx.tracks) {
				trackList[track] = new Set()
			}
		}

		$state = $state // why don't i need this?
	}

	// DEBUG
	// log scene 1 trackList 1 (1st trackList added, regardless of track number)
	// $: {
	// 	const trackName = ctx?.scenes[0]?.trackList[0]?.trackName
	// 	const characterNames = ctx?.scenes[0]?.trackList[0]?.characterNames
	// 	if (trackName) console.log(`${trackName}: ${characterNames}`)
	// }

	// // log selected header
	// $: {
	// 	const { type, name } = $selectedHeader
	// 	console.log(type ? `- selected header: ${type} : ${name}` : '- no header selected')
	// }

	// // log selected drop zones
	// $: {
	// 	console.log(
	// 		$selectedDropZones.length === 0 ? '- no drop zones selected' : '- selected drop zones:'
	// 	)
	// 	for (let dz of $selectedDropZones) {
	// 		console.log('\t', dz.sceneName, ':', dz.trackName)
	// 	}
	// }

	// // log character in hand
	// $: {
	// 	console.log(
	// 		$charactersInHand.length
	// 			? `- character in hand: ${$charactersInHand[0].name}`
	// 			: '- no character in hand'
	// 	)
	// }
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="container">
	<article>
		<!-- does character in hand need to be a bind: ? -->
		<Toolbar
			bind:deleteButton
			{clearAllSelections}
		/>
		<!-- a poor-man's OR op? -->
		{#if Object.keys({ ...$state.ctx.scenes, ...$state.ctx.tracks }).length > 0}
			<div
				class="table"
				class:glow={$canEdit}
			>
				<Table />
			</div>
		{/if}
	</article>
	<div class="character-pool">
		{#if $state.ctx.characters}
			{#each Object.keys($state.ctx.characters) as character}
				<Character
					name={character}
					location="__pool__"
				/>
			{/each}
		{/if}
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
