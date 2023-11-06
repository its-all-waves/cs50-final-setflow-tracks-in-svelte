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
	function addToSelectedDropZones(sceneName, trackName) {
		// proceed only if we have a character in hand or a header selected
		if ($charactersInHand.length === 0 && !$selectedHeader.type) return

		// if char in hand, cannot select scene
		if ($charactersInHand.length === 1 && $selectedHeader.type === 'scene') return

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

		// note: can select one track or scene at a time

		// if character in hand and a drop zone is being added to the same scene
		// twice, overwrite the old one
		if ($charactersInHand.length === 1 || $selectedHeader.type === 'track') {
			const index = $selectedDropZones.findIndex((_) => _.sceneName === sceneName)
			if (index > -1) $selectedDropZones.splice(index, 1)
		}

		if ($selectedHeader.type === 'scene') {
			const index = $selectedDropZones.findIndex((_) => _.trackName === trackName)
			if (index > -1) $selectedDropZones.splice(index, 1)
		}

		$selectedDropZones.push(newDropZoneInfo(sceneName, trackName))
		$selectedDropZones = $selectedDropZones
	}

	// TODO: make selectedDropZones change with selected header???
	// how would this affect selecting individual drop zones?
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
