<script>
	import { newDropZoneInfo } from '../../lib/TableObjects/Table'
	import Character from './character.svelte'
	import {
		table,
		characterInHand,
		selectedDropZones,
		canEdit,
		lastClickedCharacter
	} from './store'

	export let scene
	export let trackName

	export let addToSelectedDropZones // FUNCTION

	/** whether to apply .selected class
	 * @type {boolean} */
	$: selected = $selectedDropZones.some(
		(_) => _.sceneName === scene.name && _.trackName === trackName
	)
</script>

<div
	class:selected
	data-drop-zone
	data-scene-name={scene.name}
	data-track-name={trackName}
	on:pointerup={() => addToSelectedDropZones(scene.name, trackName)}
>
	{#each scene.trackList as trackListItem}
		{#if trackListItem.trackName === trackName}
			{#each trackListItem.characterNames as characterName}
				<Character
					name={characterName}
					location={scene.name}
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
