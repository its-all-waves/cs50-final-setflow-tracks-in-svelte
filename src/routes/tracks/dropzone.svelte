<script>
	import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

	import Character from './character.svelte'

	export let scene
	export let trackName

	export let addToSelectedDropZones // function(sceneName, trackName)

	// drop zone gets .selected css if it exists in selected drop zones
	$: selected = $selectedDropZones.some(
		(_) => _.sceneName === scene.name && _.trackName === trackName
	)
</script>

<div
	class:selected
	data-drop-zone
	data-scene-name={scene.name}
	data-track-name={trackName}
	on:pointerup={() => addToSelectedDropZones(scene.name, trackName, true)}
>
	{#each scene.trackList as trackListItem}
		{#if trackListItem.trackName === trackName}
			{#each trackListItem.characterNames as characterName}
				<Character
					name={characterName}
					location={scene.name}
					{trackName}
				/>
			{/each}
		{/if}
	{/each}
</div>

<style>
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
