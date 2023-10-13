<script>
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

		const trackPrefixVal = document.querySelector("input[name='track-prefix']").value
		const trackCountVal = document.querySelector("input[name='track-count']").value

		// TODO: sanitize inputs

		// must have 2 valid track inputs to proceed
		if (!trackPrefixVal || !trackCountVal) return

		// set the props
		trackPrefix = trackPrefixVal
		trackCount = trackCountVal
		tracksWereSubmitted = true
		console.log('TRACKS SUBMITTED')
	}
</script>

<h3>Tracks</h3>

{#if tracksWereSubmitted}
	<Table
		{trackPrefix}
		{trackCount}
	/>
{/if}

<div class="track-input">
	<input
		name="track-prefix"
		type="text"
		class=""
		placeholder={trackPrefix}
		value={trackPrefix}
		on:keyup={submitTracks}
	/>
	<span> X </span>
	<input
		name="track-count"
		type="number"
		class=""
		placeholder={trackCount}
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
	}

	.track-input span {
		text-align: center;
	}
</style>
