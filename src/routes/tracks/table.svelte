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

	let selectedDropZone

	/**
	 * @param {string} sceneName
	 * @param {string} trackName */
	function addToSelectedDropZones(sceneName, trackName) {
		if (!characterInHand) return

		// return if character already in scene
		const selectedScene = data.table.scenes.find((scene) => scene.name === sceneName)
		if (
			selectedScene.trackList.find((entry) => entry.characterNames.includes(characterInHand))
		) {
			console.log(`"${characterInHand}" is already in scene "${sceneName}"`)
			return
		}

		selectedDropZones.push(newDropZoneInfo(sceneName, trackName))

		// find the thing with this scene and track name
		selectedDropZone = document.querySelector(
			`[data-scene-name=${sceneName}][data-track-name=${trackName}]`
		)
		// if (!selectedDropZone) return
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
					class:selected={selectedDropZone?.dataset?.sceneName === scene.name}
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
				<th class:selected={selectedDropZone?.dataset?.trackName === track.name}
					>{display(track.name)}</th
				>

				<!-- a cell (col) per scene -->
				{#each data.table.scenes as scene, i}
					<td>
						<div
							data-drop-zone
							data-scene-name={scene.name}
							data-track-name={track.name}
							on:pointerup={() => addToSelectedDropZones(scene.name, track.name)}
							class:selected={selectedDropZone?.dataset?.sceneName === scene.name &&
								selectedDropZone?.dataset?.trackName === track.name}
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
