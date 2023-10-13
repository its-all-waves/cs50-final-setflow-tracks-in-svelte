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
						data-receiver
					/>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	td {
		border: 1px solid blue;
		border-radius: 30%;
	}
</style>
