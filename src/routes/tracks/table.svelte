<script>
	import { newDropZoneInfo } from '../../lib/TableObjects/Table'
	import { display } from '../../lib/util/util'

	import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

	import Dropzone from './dropzone.svelte'

	/**
	 * Helper for `handleTrackHeaderClick()`.
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

		// proceed only if the [only] char in hand isn't already in this scene
		if ($charactersInHand.length === 1) {
			// return if character already in scene
			const characterName = $charactersInHand[0].name
			const scene = $table.scenes.find((_) => _.name === sceneName)
			const sceneContainsCharacterInHand = scene.trackList.some((_) =>
				_.characterNames.includes(characterName)
			)
			if (sceneContainsCharacterInHand) {
				// console.log(`"${charactersInHand}" is already in scene "${sceneName}"`)
				return
			}
		}

		// if a drop zone is being added to the same scene twice, overwrite the old one
		const index = $selectedDropZones.findIndex((_) => _.sceneName === sceneName)
		if (index > -1) $selectedDropZones.splice(index, 1)

		$selectedDropZones.push(newDropZoneInfo(sceneName, trackName))
		$selectedDropZones = $selectedDropZones
	}

	/**
	 * * Used on scene header click.
	 * * Helper for `handleTrackHeaderClick()`.
	 * @returns {void}
	 * @param {string} type
	 * @param {string} name
	 */
	function setSelectedHeader(type, name) {
		// TODO: try enabling this
		// if there's already a selected track/scene header and a character in
		// hand, unset selected header and unselect drop zones
		// if ($selectedHeader.type && $charactersInHand.length === 0) {
		// 	$selectedHeader = {}
		// 	$selectedDropZones = []
		// 	return
		// }

		/* TODO: NECESSARY TO CLEAR CHARACTERS IN HAND?
		*SEEMS* TO MAKE SENSE (no logic yet) AS I MUST CLEAR $selectedHeader
		IN setCharactersInHand(), I THINK... */

		// also reset the characters in hand -- can have but ONE selection!
		$charactersInHand = []

		$selectedHeader = { type, name }
	}

	/**
	 * Case A) Goal: clear this track for all scenes \
	 * Starting State: no char in hand \
	 * Action: set selected header, add to selected drop zones for ui feedback \
	 * (delete button function will change if selectedHeader.type defined)
	 *
	 * CASE B) GOAL: add char in hand to all scenes on this track \
	 * Starting State: one char in hand \
	 * Action: add to selected drop zones \
	 * (commitDropZones() does stuff with the selectedDropZones[])
	 */
	function handleTrackHeaderClick(trackName) {
		if ($charactersInHand.length === 0) setSelectedHeader('track', trackName)

		// for ui feedback (show selected track)
		for (let scene of $table.scenes) {
			addToSelectedDropZones(scene.name, trackName)
		}
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
					<th on:pointerup={handleTrackHeaderClick(track.name)}>
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

	tbody tr th:hover,
	thead th:hover {
		text-shadow: 0px 0px 6px black, 0 0 6px rgba(255, 255, 255, 0.75),
			0 0 12px rgba(255, 242, 0, 0.75), 0 0 18px rgba(255, 255, 255, 0.75);
		cursor: pointer;
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
	tbody :global(.inHand) {
		scale: 1.15;
	}

	table.read-only {
		pointer-events: none;
	}
</style>
