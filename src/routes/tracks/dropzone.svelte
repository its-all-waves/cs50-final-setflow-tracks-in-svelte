<script>
	import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

	import Character from './character.svelte'

	export let scene
	export let trackName

	export let addToSelectedDropZones // FUNCTION

	function handleClick() {
		// if a header is selected when a drop zone is clicked, clear selected header, select clicked
		// drop zone
		// if ($selectedHeader.type === 'scene') return
		// if ($selectedHeader.type === 'scene') $selectedHeader = {}

		addToSelectedDropZones(scene.name, trackName, true)
	}

	$: selected = $selectedDropZones.some(
		(_) => _.sceneName === scene.name && _.trackName === trackName
	)
</script>

<div
	class:selected
	data-drop-zone
	data-scene-name={scene.name}
	data-track-name={trackName}
	on:pointerup={() => handleClick()}
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
	/* DROP ZONES */
	[data-drop-zone] {
		display: flex;
		border: 1px solid #885df1;
		border-radius: 12px;
		height: 100%;
		min-width: 12ch;
	}

	.selected[data-drop-zone] {
		border: 2px solid rgb(255, 255, 255);
	}
</style>
