<script>
	import { onMount } from 'svelte'
	import { display } from '../../lib/util/util'

	import Dropzone from './dropzone.svelte'
	import { newTrackListItem } from '../../lib/TableObjects/Scene'

	// expose as attrs
	export let data
	/**
	 * @type {DropZoneInfo[]} */
	export let selectedDropZones
	export let characterInHand

	let allDropZones = []

	function addCharacterInHandToAllScenesOn(trackName) {
		if (!characterInHand) return

		/* TODO: How to handle a scene already occupied?
		eg: track 1 -> ___ ___ ___ pam ___ ___
		FOR NOW: disallow the whole operation and tell user why
		*/

		for (let scene of data.table.scenes) {
			/* TODO: Why does this smell bad?
			I feel like scene.trackList should already be initialized / ready to
			add to an existing trackListItem, at least in some cases. Why is it
			certainly undefined at this point? Where should it be initialized?
			*/

			// throw an error (aim: help in dev to figure how we // get here)
			if (scene.trackList.characterNames !== undefined) {
				// (if characterNames is DEFINED...)
				throw new Error('How the ELF did we get here?!')
			}
			// characterNames is UNDEFINED
			scene.trackList = scene.trackList.concat(newTrackListItem(trackName, characterInHand))
		}
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
							bind:allDropZones
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
</style>
