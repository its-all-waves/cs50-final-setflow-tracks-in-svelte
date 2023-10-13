<script>
	import { newTrack } from '../../lib/TableObjects/Track'
	import { newScene } from '../../lib/TableObjects/Scene'
	import { newCharacter } from '../../lib/TableObjects/Character'

	import Table from './table.svelte'
	import Character from './character.svelte'

	/** @type {import('./$types').PageData} */
	export let data

	/** @type {HTMLElement} */
	let characterInHand = null
	/** @type {HTMLElement[]} */
	let selectedDropZones = []

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
			data.table.tracks.push(track)
			// TODO: track.rowElem ???
		}

		// trigger a svelte update by making a copy
		data.table.tracks = [...data.table.tracks]

		// clear input fields
		trackPrefix = null
		trackCount = null
	}

	function submitScene(event) {
		if (event.key !== 'Enter') return

		const inputField = event.target
		const name = inputField.value.replace(' ', '_')

		// TODO: sanitize input
		if (!name) return

		// create a scene, push it to scenes[]
		const scene = newScene(name)
		data.table.scenes.push(scene)
		// force a svelte rerender to update ui
		data.table.scenes = [...data.table.scenes]

		// clear the input field
		inputField.value = null
	}

	function submitCharacter(event) {
		if (event.key !== 'Enter') return

		let inputField = event.target
		const name = inputField.value.replace(' ', '_')

		// TODO: sanitize input
		if (!name) return

		// create a character, push it to characters[]
		const character = newCharacter(name)
		data.table.characters.push(character)

		// force svelte to update ui
		data.table.characters = [...data.table.characters]

		inputField.value = null
	}
</script>

<div class="container">
	<h3>Tracks</h3>

	{#if data.table.tracks.length > 0}
		<article>
			<div class="table">
				<Table
					{data}
					bind:selectedDropZones
					bind:characterInHand
				/>
			</div>
		</article>
	{/if}

	{#if data.table.characters.length > 0}
		<div class="character-pool">
			{#each data.table.characters as character}
				<!-- bind:characterInHand allows Character to update the var and re-render this element -- 2-way binding, as opposed to normal passing from parent into child -->
				<Character
					{character}
					bind:characterInHand
				/>
			{/each}
		</div>
	{/if}

	<form>
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
	}

	.table {
		max-height: 80%;
		overflow: auto;
	}

	form {
		margin: 3rem;
	}

	.character-pool {
		display: flex;
		margin: 1.5rem;
		border: 1px solid rgb(0, 255, 255);
		border-radius: 1.5rem;
		min-height: 3rem;
	}
</style>
