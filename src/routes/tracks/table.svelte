<script>
	import { display } from '../../lib/util/util'
	// expose as attrs
	export let data
	/** @type {HTMLElement[]} */
	export let selectedDropZones = []

	let self

	function pushToSelectedDropZone() {
		console.log('PUSHED: ')
		console.log(selectedDropZones)
		selectedDropZones.push(self)
	}
</script>

<table data-main-table>
	<thead>
		<tr>
			<th class="empty" />

			<!-- a column header per scene -->
			{#each data.table.scenes as scene}
				<th data-scene-col={scene.name}>
					{display(scene.name)}
				</th>
			{/each}
		</tr>
	</thead>

	<tbody>
		<!-- a row + header per track -->
		{#each data.table.tracks as track}
			<tr data-track-row={track.name}>
				<th>{display(track.name)}</th>

				<!-- a cell (col) per scene -->
				{#each data.table.scenes as scene}
					<td>
						<div
							data-track-name={track.name}
							data-scene-name={scene.name}
							data-drop-zone
							bind:this={self}
							class:selected={self in selectedDropZones}
							on:pointerup={pushToSelectedDropZone}
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
		height: 3rem;
		padding: 1.5rem;
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

	/* thead th:not(:first-child) {
		border-bottom: 3px solid #885df1;
	} */

	.selected {
		border: 2px solid green;
	}
</style>
