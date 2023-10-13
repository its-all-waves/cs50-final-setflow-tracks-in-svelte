<script>
	import { newTrack } from '../../lib/TableObjects/Track'

	import Table from './table.svelte'

	/** @type {import('./$types').PageData} */
	export let data

	// const TRACK_NAME_PLACEHOLDER = 'track'
	// const TRACK_COUNT_PLACEHOLDER = 4

	let trackCount = 4
	let trackPrefix = 'track'
	/** true triggers rendering of table + ??? */
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

		// TODO: eval goal: svelte will bind ui to table obj
		// CREATE THE DATA STRUCTURES
		// push new tracks to table.tracks
		for (let i = 0; i < trackCount; i++) {
			const track = newTrack(`${trackPrefix}_${i + 1}`)
			data.table.tracks.push(track)
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

		const sceneNameVal = event.target.value

		// TODO: sanitize inputs
		if (!sceneNameVal) return

		// create a scene, then push it to scenes[]
		const scene = newScene()

		data.table.scenes.push(scene)
	}

	$: console.log(data)
</script>

<h3>Tracks</h3>

{#if tracksWereSubmitted}
	<Table {data} />
{/if}

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
