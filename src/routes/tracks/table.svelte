<script>
	// TODO: HOW DO I GET THIS?
	let tracks

	// expose as attrs
	export let trackPrefix
	export let trackCount
</script>

<table data-main-table>
	<thead>
		<tr>
			<!-- TODO -->
			<th class="empty" />
		</tr>
	</thead>

	<tbody>
		{#each { length: trackCount } as _, i}
			<tr>
				<th>{trackPrefix} {i + 1}</th>
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
