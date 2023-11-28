<script>
	import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

	import Character from './character.svelte'
	import { characters, tracks, scenes, send, Msg } from './machine'
	import { nanoid } from 'nanoid'

	export let sceneId
	export let trackId // my thinking is that I don't want to look up the scene and track again in this component if the parent has already gotten it
	export let scene
	export let trackName

	export let addToSelectedDropZones // function(sceneName, trackName)

	// drop zone gets .selected css if it exists in selected drop zones
	$: selected = $selectedDropZones.some(
		(_) => _.sceneName === scene.name && _.trackName === trackName
	)

	$: trackListEntries = Object.entries(scene.trackList)
</script>

<button
	class:selected
	data-drop-zone
	data-scene-name={scene.name}
	data-track-name={trackName}
	on:click={() =>
		send(Msg.CLICK_DROP_ZONE, {
			sceneId,
			trackId
		})}
>
	{#each trackListEntries as [trackId, chars]}
		{#if $tracks[trackId].name === trackName}
			{#each chars as charId}
				<Character
					isInstance={true}
					characterId={charId}
					{sceneId}
					{trackId}
				/>
			{/each}
		{/if}
	{/each}
</button>

<style>
	button {
		background: none;
		margin: 0;
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
