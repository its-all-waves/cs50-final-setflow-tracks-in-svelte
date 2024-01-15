<script>
	// import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

	import Character from './character.svelte'
	import { characters, tracks, scenes, send, Msg, selectedDropZones } from './machine'

	export let sceneId
	export let trackId // my thinking is that I don't want to look up the scene and track again in this component if the parent has already gotten it
	export let scene
	export let trackName

	// drop zone gets .selected css if it exists in selected drop zones
	$: selected = isIn($selectedDropZones)

	function isIn(selDropZones) {
		// console.log('THIS IS RUNNING')
		for (const dz of selDropZones) {
			if (dz.sceneId === sceneId && dz.trackId === trackId) return true
		}
		return false
	}

	$: trackListEntries = Object.entries(scene.trackList).sort(
		([, a], [, b]) => a.number - b.number
	)
</script>

<button
	class:selected
	data-drop-zone
	data-scene-name={scene.name}
	data-track-name={trackName}
	on:click|preventDefault={() =>
		send(Msg.CLICK_DROP_ZONE, {
			sceneId,
			trackId
		})}
>
	{#each trackListEntries as [trackId, chars]}
		<!-- {@debug $tracks} -->
		{#if $tracks[trackId].name === trackName}
			{#each chars as charId}
				<Character
					isInstance={true}
					id={charId}
					{sceneId}
					{trackId}
					name={$characters[charId].name}
				/>
			{/each}
		{/if}
	{/each}
</button>

<style>
	button {
		padding: 0;
		margin: 0;
		background: none;
		transition: none;
	}

	/* get rid of default outline after clicked */
	button:focus {
		box-shadow: none;
	}

	[data-drop-zone] {
		display: flex;
		border: 1px solid #885df1;
		border-radius: 12px;
		height: 100%;
		min-width: 12ch;
	}

	.selected {
		border: 2px solid rgb(255, 255, 255);
	}
</style>
