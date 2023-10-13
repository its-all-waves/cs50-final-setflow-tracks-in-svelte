<script>
	// expose as attrs
	export let data

	function display(name) {
		return name.replace('_', ' ')
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
					<td
						data-track-name={track.name}
						data-scene-name={scene.name}
						data-drop-zone="scene"
					/>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	/* DROP ZONES */
	[data-drop-zone='scene'] {
		border: 3px solid #885df1;
		border-radius: 80px;
		z-index: 3;
	}

	thead th:not(:first-child) {
		border-bottom: 3px solid #885df1;
	}

	thead th,
	tbody th {
		text-align: center;
	}

	/* keep track/row headers narrow */
	tbody th {
		width: 12ch;
	}
</style>
