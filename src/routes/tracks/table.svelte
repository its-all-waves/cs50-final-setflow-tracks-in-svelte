<script>
	// expose as attrs
	export let data
	// export let trackPrefix
	// export let trackCount
</script>

<table data-main-table>
	<thead>
		<tr>
			<!-- TODO -->
			<th class="empty" />
		</tr>
	</thead>

	<tbody>
		{#each data.table.tracks as track, i}
			<tr>
				<th>{track.name.replace('_', ' ')}</th>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table,
	td,
	th {
		/* border: 1px solid white; */
	}
</style>
