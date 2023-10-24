<script>
	import { newDropZoneInfo } from '../../lib/TableObjects/Table'
	import Character from './character.svelte'

	export let selectedDropZones
	export let characterInHand
	export let data
	export let scene
	export let trackName

	/**
	 * @param {string} sceneName
	 * @param {string} trackName */
	function addToSelectedDropZones(sceneName, trackName) {
		if (!characterInHand) return

		// return if character already in scene
		const selectedScene = data.table.scenes.find((_) => _.name === sceneName)
		const selectedSceneContainsCharacterInHand = selectedScene.trackList.find((_) =>
			_.characterNames.includes(characterInHand)
		)
		if (selectedSceneContainsCharacterInHand) {
			console.log(`"${characterInHand}" is already in scene "${sceneName}"`)
			return
		}

		// selected drop zones can't contain more than one DropZoneInfo obj with the same scene
		// if the same scene is being added now, delete the old one
		const index = selectedDropZones.findIndex((_) => _.sceneName === sceneName)
		if (index > -1) selectedDropZones.splice(index, 1)

		selectedDropZones = selectedDropZones.concat(newDropZoneInfo(sceneName, trackName))
		// console.log('👇🏽 SELECTED DROP ZONES')
		// console.dir(selectedDropZones)
	}

	/** whether to apply .selected class
	 * @type {boolean} */
	$: selected = isSelected(selectedDropZones)

	function isSelected(selected) {
		for (let i = 0; i < selected.length; i++) {
			if (selected[i].sceneName === scene.name && selected[i].trackName === trackName) {
				return true
			}
		}
		return false
	}
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
					{characterName}
					bind:characterInHand
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
