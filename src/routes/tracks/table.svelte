<script>
	import { newDropZoneInfo } from '../../lib/TableObjects/Table'
	import { display } from '../../lib/util/util'

	import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

	import Dropzone from './dropzone.svelte'

	function addCharacterInHandToAllScenesOn(trackName) {
		if ($charactersInHand.length === 0 || $charactersInHand.length > 1) return

		for (let scene of $table.scenes) {
			addToSelectedDropZones(scene.name, trackName)
		}
		$selectedDropZones = $selectedDropZones // force ui update
	}

	/**
	 * @returns {void}
	 * @param {string} sceneName
	 * @param {string} trackName
	 * */
	function addToSelectedDropZones(sceneName, trackName) {
		if ($charactersInHand.length === 0) return

		// return if character already in scene
		const selectedScene = $table.scenes.find((_) => _.name === sceneName)
		const selectedSceneContainsCharacterInHand = selectedScene.trackList.find((_) =>
			_.characterNames.includes($charactersInHand[0].name)
		)
		if (selectedSceneContainsCharacterInHand) {
			// console.log(`"${charactersInHand}" is already in scene "${sceneName}"`)
			return
		}

		// selected drop zones can't contain more than one DropZoneInfo obj with the same scene
		// if the same scene is being added now, overwrite the old one
		const index = $selectedDropZones.findIndex((_) => _.sceneName === sceneName)
		if (index > -1) $selectedDropZones.splice(index, 1)

		$selectedDropZones = $selectedDropZones.concat(newDropZoneInfo(sceneName, trackName))
	}

	function setSelectedHeader(type, name) {
		$selectedHeader = {
			type,
			name
		}
		$selectedHeader = $selectedHeader
	}

	function handleTableHeaderClick(type, trackName) {
		if ($charactersInHand.length === 1) {
			addCharacterInHandToAllScenesOn(trackName)
		} else if ($charactersInHand.length === 0) {
			setSelectedHeader(type, trackName) // TODO: necessary?
			addAllToCharactersInHandFromTrack(trackName)
			/* 
					if selectedHeader.type === 'track'
						trigger the track fn
			*/
		}
	}

	function addAllToCharactersInHandFromTrack(trackName) {
		$charactersInHand = [] // TODO: IS THIS RIGHT  ???????????????????????
		for (let scene of $table.scenes) {
			for (let trackListItem of scene.trackList) {
				if (trackListItem.trackName !== trackName) continue
				for (let name of trackListItem.characterNames) {
					$charactersInHand.push({
						name,
						location: scene.name
					})
				}
			}
		}
		$charactersInHand = $charactersInHand
		// console.log('UPDATED charactersInHand: ')
		// console.log($charactersInHand)
	}
</script>

<table
	class:$canEdit
	class:read-only={!$canEdit}
	data-main-table
>
	<thead>
		<tr>
			<th class="empty" />
			{#if $table.scenes.length > 0}
				<!-- a column header per scene -->
				{#each $table.scenes as scene}
					<th
						data-scene-col={scene.name}
						class:selected={false}
						on:pointerup={() => setSelectedHeader('scene', scene.name)}
					>
						{display(scene.name)}
					</th>
				{/each}
			{/if}
		</tr>
	</thead>

	<tbody>
		{#if $table.tracks.length > 0}
			<!-- a row + header per track -->
			{#each $table.tracks as track}
				<tr data-track-row={track.name}>
					<th
						on:click={() => {
							console.dir($charactersInHand)
							console.dir($selectedHeader)
						}}
						on:pointerup={handleTableHeaderClick('track', track.name)}
					>
						{display(track.name)}
					</th>

					<!-- a cell (col) per scene -->
					{#each $table.scenes as scene}
						<td>
							<Dropzone
								{addToSelectedDropZones}
								{scene}
								trackName={track.name}
							/>
						</td>
					{/each}
				</tr>
			{/each}
		{/if}
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

	tbody tr th.chosen {
		border-top: 2px solid white;
		border-bottom: 2px solid white;
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
	/* tbody :global(.in-hand) {
		scale: 1;
	} */

	table.canEdit {
		pointer-events: all;
	}

	table.read-only {
		pointer-events: none;
	}
</style>
