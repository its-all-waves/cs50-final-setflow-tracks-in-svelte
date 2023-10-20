<script>
	import { display } from '../../lib/util/util'
	import { newDropZoneInfo } from '../../lib/TableObjects/Table'

	import Character from './character.svelte'

	// expose as attrs
	export let data
	/**
	 * @type {DropZoneInfo[]} */
	export let selectedDropZones = []
	export let characterInHand
	/** the selected drop zone */
	export let selectedDZ

	/**
	 * @param {string} sceneName
	 * @param {string} trackName */
	function addToSelectedDropZones(sceneName, trackName) {
		if (!characterInHand) return

		// return if character already in scene
		const selectedScene = data.table.scenes.find((scene) => scene.name === sceneName)
		const selectedSceneContainsCharacterInHand = selectedScene.trackList.find((entry) =>
			entry.characterNames.includes(characterInHand)
		)
		if (selectedSceneContainsCharacterInHand) {
			console.log(`"${characterInHand}" is already in scene "${sceneName}"`)
			return
		}

		// TODO: make this an array, or somehow use the existing selectedDropZones array
		// so far so good; set the ref to the selected drop zone so the ui knows what to highlight
		selectedDZ = document.querySelector(
			`[data-scene-name="${sceneName}"][data-track-name="${trackName}"]`
		)

		// selected drop zones can't contain more than one DropZoneInfo obj with the same scene
		// if the same scene is being added now, delete the old one
		const index = selectedDropZones.findIndex((_) => _.sceneName === sceneName)
		if (index > -1) selectedDropZones.splice(index, 1)

		selectedDropZones.push(newDropZoneInfo(sceneName, trackName))
		console.log('👇🏽 SELECTED DROP ZONES')
		console.dir(selectedDropZones)
	}
</script>

<table data-main-table>
	<thead>
		<tr>
			<th class="empty" />

			<!-- a column header per scene -->
			{#each data.table.scenes as scene}
				<th
					data-scene-col={scene.name}
					class:selected={selectedDZ?.dataset?.sceneName === scene.name}
				>
					{display(scene.name)}
				</th>
			{/each}
		</tr>
	</thead>

	<tbody>
		<!-- a row + header per track -->
		{#each data.table.tracks as track}
			<tr data-track-row={track.name}>
				<th class:selected={selectedDZ?.dataset?.trackName === track.name}>
					{display(track.name)}
				</th>

				<!-- a cell (col) per scene -->
				{#each data.table.scenes as scene}
					<td>
						<div
							data-drop-zone
							data-scene-name={scene.name}
							data-track-name={track.name}
							on:pointerup={() => addToSelectedDropZones(scene.name, track.name)}
							class:selected={selectedDZ?.dataset?.sceneName === scene.name &&
								selectedDZ?.dataset?.trackName === track.name}
						>
							{#each scene.trackList as trackEntry}
								{#if trackEntry.trackName === track.name}
									{#each trackEntry.characterNames as characterName}
										<Character
											{characterName}
											bind:characterInHand
										/>
									{/each}
								{/if}
							{/each}
						</div>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table,
	thead,
	th,
	tr,
	td {
		margin: 0;
		padding: 0;
	}

	thead th,
	tbody th {
		text-align: center;
	}

	/* keep track/row headers narrow */
	tbody tr th {
		position: sticky;
		left: 0;
		width: 12ch;
		min-width: 9ch;
		background: rgb(17, 25, 31);
		background: linear-gradient(90deg, rgba(17, 25, 31, 1) 75%, rgba(17, 25, 31, 0) 100%);
	}

	thead th {
		position: sticky;
		top: -0.6rem;
		height: 3rem;
		background: rgb(17, 25, 31);
		background: linear-gradient(0deg, rgba(17, 25, 31, 1) 75%, rgba(17, 25, 31, 0) 100%);
	}

	td {
		height: 4rem;
		padding: 0;
		margin: 0;
		padding: 0;
	}

	/* DROP ZONES */
	[data-drop-zone] {
		border: 1px solid #885df1;
		border-radius: 30px;
		height: 100%;
		min-width: 12ch;
	}

	.selected[data-drop-zone] {
		border: 2px solid green;
	}

	th.selected {
		text-shadow: 0px 0px 6px black, 0 0 6px rgba(255, 255, 255, 0.75),
			0 0 12px rgba(255, 242, 0, 0.75), 0 0 18px rgba(255, 255, 255, 0.75);
		transition: text-shadow 0.1s 0s, font-size 0.075s 0s;
		font-size: 1.25rem;
	}
</style>
