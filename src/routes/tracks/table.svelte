<script>
	// import { newDropZoneInfo } from '../../lib/TableObjects/Table'
	// import { display } from '../../lib/util/util'

	// /** @typedef {import('../../lib/types').CharacterInHand} CharacterInHand */
	// /** @typedef {import('../../lib/types').Scene} Scene */
	// /** @typedef {import('../../lib/types').Table} Table */
	// /** @typedef {import('../../lib/types').SelectedHeader} SelectedHeader */

	// import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

	import Dropzone from './dropzone.svelte'
	import { Msg, send, tracks, scenes } from './machine'

	// /**
	//  * Gets passed to children <Header> and <DropZone>.
	//  * Adds a dropZoneInfo obj to $selectedDropZones *if* it can be added. \
	//  * Rules: A) The scene obj ref'd by `sceneName` cannot contain the same
	//  * character twice. B) If adding a drop zone for the same scene twice (in
	//  * one motion), overwrite the last one selected in this scene. \
	//  * Note: The alt to `clickedDropZone` is clicked scene or track header.
	//  * @returns {void}
	//  * @param {string} sceneName
	//  * @param {string} trackName
	//  * */
	// function addToSelectedDropZones(sceneName, trackName, clickedDropZone = false) {
	// 	const clickedASelectedDropZone = $selectedDropZones.some(
	// 		(_) => _.sceneName === sceneName && _.trackName === trackName
	// 	)
	// 	// if clicked selected drop zone, unselect it, return
	// 	if (clickedASelectedDropZone) {
	// 		const index = $selectedDropZones.findIndex(
	// 			(_) => _.sceneName === sceneName && _.trackName === trackName
	// 		)
	// 		if (index !== -1) {
	// 			$selectedDropZones.splice(index, 1)
	// 			$selectedDropZones = $selectedDropZones
	// 			// console.log('2 ???')
	// 			return
	// 		}
	// 	}

	// 	// proceed only if the [only] char in hand isn't already in this scene
	// 	if ($charactersInHand.length === 1) {
	// 		// return if character already in scene
	// 		const characterName = $charactersInHand[0].name
	// 		const scene = $table.scenes.find((_) => _.name === sceneName)
	// 		const sceneContainsCharacterInHand = scene.trackList.some((_) =>
	// 			_.characterNames.includes(characterName)
	// 		)
	// 		if (sceneContainsCharacterInHand) {
	// 			// TODO: show feedback to user `"${charactersInHand}" is already in scene "${sceneName}"`
	// 			// console.log('3 ???')
	// 			return
	// 		}
	// 	}

	// 	const sceneAlreadyHasASelectedDropZone = $selectedDropZones.some(
	// 		(_) => _.sceneName === sceneName
	// 	)

	// 	// replace the old selected drop zone with the new one
	// 	if (clickedDropZone && sceneAlreadyHasASelectedDropZone) {
	// 		// get index of this scene's selected drop zone to splice it out
	// 		const index = $selectedDropZones.findIndex((_) => _.sceneName === sceneName)
	// 		if (index !== -1) {
	// 			$selectedDropZones.splice(index, 1)
	// 			// console.log('4 ???')
	// 		}
	// 	}
	// 	// if a scene or track header is selected, this click on a drop zone
	// 	// removes the current selection from selected scene's col
	// 	else if ($selectedHeader.type && clickedDropZone) {
	// 		// TODO: why does it feel wrong to do stuff to selectedHeader here?
	// 		$selectedHeader = {}
	// 		$selectedDropZones = []
	// 		// console.log('5 ???')
	// 	}

	// 	// note: can select one track or scene at a time

	// 	$selectedDropZones.push(newDropZoneInfo(sceneName, trackName))
	// 	$selectedDropZones = $selectedDropZones
	// 	// console.log('6 ???')
	// }

	$: tracksEntries = Object.entries($tracks)
	$: scenesEntries = Object.entries($scenes)
</script>

<table data-main-table>
	<thead>
		<tr>
			<th class="empty" />
			<!-- {#if sceneEntries.length > 0} -->
			<!-- a column header per scene -->
			{#each scenesEntries as [id, { name }]}
				<th
					data-scene-header={name}
					on:click={() => {
						send(Msg.CLICK_SCENE_HEADER, { id })
					}}
				>
					{name}
				</th>
			{/each}
			<!-- {/if} -->
		</tr>
	</thead>

	<tbody>
		<!-- {#if tracksEntries.length > 0} -->
		<!-- a row + header per track -->
		{#each tracksEntries as [trackId, { name: trackName }]}
			<tr data-track-row={trackName}>
				<th
					data-track-header={trackName}
					on:click={() => {
						send(Msg.CLICK_TRACK_HEADER, { id: trackId })
					}}
				>
					{trackName}
				</th>
				<!-- a cell (col) per scene -->
				{#each scenesEntries as [sceneId, _]}
					<td>
						<Dropzone
							{sceneId}
							{trackId}
							scene={$scenes[sceneId]}
							{trackName}
						/>
					</td>
				{/each}
			</tr>
		{/each}
		<!-- {/if} -->
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

	/* table switches to pointer-events: none when not editable */
	thead,
	tbody,
	th,
	td {
		pointer-events: inherit;
	}

	th.empty {
		background: rgb(17, 25, 31);
	}

	/* limit cell (and dropZone) height */
	td {
		height: 4rem;
	}

	/* .in-hand comes from character.svelte */
	tbody :global(.inHand) {
		scale: 1.15;
	}

	table.read-only {
		pointer-events: none;
	}

	/* header stuff */
	th {
		margin: 0;
		padding: 0;
		text-align: center;
		font-weight: bold;
	}

	[data-scene-header] {
		position: sticky; /* currently does nothing... */
		top: -0.6rem;
		height: 3rem;
		background: rgb(17, 25, 31);
		background: linear-gradient(180deg, rgba(17, 25, 31, 1) 75%, rgba(17, 25, 31, 0) 100%);
	}

	/* row headers - keep narrow */
	[data-track-header] {
		position: sticky;
		left: 0;
		width: 12ch;
		min-width: 9ch;
		background: rgb(17, 25, 31);
		background: linear-gradient(90deg, rgba(17, 25, 31, 1) 75%, rgba(17, 25, 31, 0) 100%);
	}

	th:hover {
		text-shadow: 0 2px 1px black, 0px 0px 6px black, 0 0 6px rgba(255, 255, 255, 0.75),
			0 0 12px rgba(255, 242, 0, 0.75), 0 0 18px rgba(255, 255, 255, 0.75);
		cursor: pointer;
	}
</style>
