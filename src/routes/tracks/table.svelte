<script>
	import { newDropZoneInfo } from '../../lib/TableObjects/Table'
	import { display } from '../../lib/util/util'

	/** @typedef {import('../../lib/types').CharacterInHand} CharacterInHand */
	/** @typedef {import('../../lib/types').Scene} Scene */
	/** @typedef {import('../../lib/types').Table} Table */
	/** @typedef {import('../../lib/types').SelectedHeader} SelectedHeader */

	import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

	import Dropzone from './dropzone.svelte'
	import Header from './header.svelte'

	/**
	 * Gets passed to children <Header> and <DropZone>.
	 * Adds a dropZoneInfo obj to $selectedDropZones *if* it can be added. \
	 * Rules: A) The scene obj ref'd by `sceneName` cannot contain the same
	 * character twice. B) If adding a drop zone for the same scene twice (in
	 * one motion), overwrite the last one selected in this scene.
	 * @returns {void}
	 * @param {string} sceneName
	 * @param {string} trackName
	 * */
	function addToSelectedDropZones(sceneName, trackName, clickedDropZone = false) {
		console.log('debug')
		// if char in hand, cannot select scene
		if ($charactersInHand.length === 1 && $selectedHeader.type === 'scene') {
			// TODO: tell user why nothing happened
			return
		}

		// proceed only if the [only] char in hand isn't already in this scene
		if ($charactersInHand.length === 1) {
			// return if character already in scene
			const characterName = $charactersInHand[0].name
			const scene = $table.scenes.find((_) => _.name === sceneName)
			const sceneContainsCharacterInHand = scene.trackList.some((_) =>
				_.characterNames.includes(characterName)
			)
			if (sceneContainsCharacterInHand) {
				// TODO: show feedback to user `"${charactersInHand}" is already in scene "${sceneName}"`
				return
			}
		}

		// if clicking in a scene that already has a selected drop zone,
		// replace the old selected drop zone with the new one
		if (
			!$selectedHeader.type && // a header is selected
			$selectedDropZones.length && // at least one drop zone is selected
			$selectedDropZones.some((_) => _.sceneName === sceneName) // a selected drop zone is already in this scene
		) {
			// get index of this scene's selected drop zone to splice it out
			const index = $selectedDropZones.findIndex((_) => _.sceneName === sceneName)
			if (index !== -1) $selectedDropZones.splice(index, 1)
			console.log('debug')
		}
		// if a scene header is selected, this click on a drop zone removes the
		// current selection from selected scene's col
		else if ($selectedHeader.type && clickedDropZone) {
			$selectedHeader = {}
			$selectedDropZones = []
		}

		// note: can select one track or scene at a time

		$selectedDropZones.push(newDropZoneInfo(sceneName, trackName))
		$selectedDropZones = $selectedDropZones
		console.log('debug')
	}

	// DEBUG
	$: console.log('selected drop zones:'), console.dir($selectedDropZones)
	$: console.log('selected header:'), console.dir($selectedHeader)
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
					<Header
						type="scene"
						name={scene.name}
						{addToSelectedDropZones}
					/>
				{/each}
			{/if}
		</tr>
	</thead>

	<tbody>
		{#if $table.tracks.length > 0}
			<!-- a row + header per track -->
			{#each $table.tracks as track}
				<tr data-track-row={track.name}>
					<Header
						type="track"
						name={track.name}
						{addToSelectedDropZones}
					/>
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
</style>
