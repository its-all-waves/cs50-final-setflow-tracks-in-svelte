<script>
	import { newTrack } from '../../lib/TableObjects/Track'
	import { newScene } from '../../lib/TableObjects/Scene'

	import Table from './table.svelte'

	/** @type {import('./$types').PageData} */
	export let data

	let trackCount = 4
	let trackPrefix = 'track'
	/** true triggers rendering of table */
	let tracksWereSubmitted = false

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

		tracksWereSubmitted = true
		console.log('TRACKS SUBMITTED')
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

	$: console.log(data)
</script>

<h3>Tracks</h3>

{#if tracksWereSubmitted}
	<Table {data} />
{/if}

<form>
	<div class="track-input">
		<input
			autofocus
			name="track-prefix"
			type="text"
			class=""
			value={trackPrefix}
			on:keyup={submitTracks}
		/>
		<span> X </span>
		<input
			name="track-count"
			type="text"
			class=""
			value={trackCount}
			on:keyup={submitTracks}
		/>
	</div>

	<div class="scene-input">
		<input
			name="scene-name"
			type="text"
			class=""
			placeholder="add a scene"
			on:keyup={submitScene}
		/>
	</div>

	<div class="actor-input">
		<input
			name="actor-name"
			type="text"
			class=""
			placeholder="add a character"
		/>
	</div>
</form>

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
</style>
