<script>
	import { newDropZoneInfo } from '../../lib/TableObjects/Table'
	import { display } from '../../lib/util/util'

	import Dropzone from './dropzone.svelte'

	export let data
	/**
	 * @type {DropZoneInfo[]} */
	export let selectedDropZones
	export let characterInHand
	export let canEdit

	function addCharacterInHandToAllScenesOn(trackName) {
		if (!characterInHand) return

		for (let scene of data.table.scenes) {
			// selectedDropZones.push(newDropZoneInfo(scene.name, trackName))
			addToSelectedDropZones(scene.name, trackName)
		}
		// force the UI update
		selectedDropZones = [...selectedDropZones]
	}

	/**
	 * @returns {void}
	 * @param {string} sceneName
	 * @param {string} trackName
	 * */
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
	}
</script>

<table
	class:canEdit
	class:read-only={!canEdit}
	data-main-table
>
	<thead>
		<tr>
			<th class="empty" />

			<!-- a column header per scene -->
			{#each data.table.scenes as scene}
				<th
					data-scene-col={scene.name}
					class:selected={false}
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
				<th
					class:selected={false}
					on:pointerup={() => addCharacterInHandToAllScenesOn(track.name)}
				>
					{display(track.name)}
				</th>

				<!-- a cell (col) per scene -->
				{#each data.table.scenes as scene}
					<td>
						<Dropzone
							bind:characterInHand
							bind:selectedDropZones
							{data}
							{scene}
							trackName={track.name}
						/>
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

	/* table switches to pointer-events: none when not editable */
	thead,
	tbody,
	th,
	td,
	td div {
		pointer-events: inherit;
	}

	thead th,
	tbody th {
		text-align: center;
	}

	/* row headers - keep narrow */
	tbody tr th {
		position: sticky;
		left: 0;
		width: 12ch;
		min-width: 9ch;
		background: rgb(17, 25, 31);
		background: linear-gradient(90deg, rgba(17, 25, 31, 1) 75%, rgba(17, 25, 31, 0) 100%);
	}

	tbody tr th:hover {
		text-shadow: 0px 0px 6px black, 0 0 6px rgba(255, 255, 255, 0.75),
			0 0 12px rgba(255, 242, 0, 0.75), 0 0 18px rgba(255, 255, 255, 0.75);
	}

	/* column headers */
	thead th {
		position: sticky; /* currently does nothing... */
		top: -0.6rem;
		height: 3rem;
		background: rgb(17, 25, 31);
		background: linear-gradient(180deg, rgba(17, 25, 31, 1) 75%, rgba(17, 25, 31, 0) 100%);
	}

	/* limit cell (and dropZone) height */
	td {
		height: 4rem;
	}

	th.selected {
		text-shadow: 0px 0px 6px black, 0 0 6px rgba(255, 255, 255, 0.75),
			0 0 12px rgba(255, 242, 0, 0.75), 0 0 18px rgba(255, 255, 255, 0.75);
		transition: text-shadow 0.1s 0s, font-size 0.075s 0s;
		font-size: 1.25rem;
	}

	/* .in-hand comes from character.svelte */
	tbody :global(.in-hand) {
		scale: 1;
	}

	table.canEdit {
		pointer-events: all;
	}

	table.read-only {
		pointer-events: none;
	}
</style>
