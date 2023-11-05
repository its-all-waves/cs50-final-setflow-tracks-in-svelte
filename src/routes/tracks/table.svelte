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
	 * @returns {void}
	 * @param {'track' | 'scene'} type
	 * @param {string} name
	 */
	function setSelectedHeader(type, name) {
		// deselect the header if clicking it again
		if ($selectedHeader.name === name) {
			$selectedHeader = {}
			$selectedDropZones = []
		} else if ($selectedHeader.name !== name) {
			// clicking an unselected header, so select it
			$selectedHeader = { type, name }
		}

		// if no header selected, clear selected drop zones and be done
		if (!$selectedHeader.type) {
			$selectedDropZones = []
			return
		}

		// if selected header is a track, show it
		if ($selectedHeader.type === 'track') {
			for (let scene of $table.scenes) {
				addToSelectedDropZones(scene.name, name)
			}
		}
		// if selected header is a scene, show it
		else if ($selectedHeader.type === 'scene') {
			// a scene is selected, so show selected scene column in ui
		}

		/* TODO: TEST: clicking track header selects drop zones on track,
		clicking again deselects all */
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
					<th on:pointerup={setSelectedHeader('track', track.name)}>
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
