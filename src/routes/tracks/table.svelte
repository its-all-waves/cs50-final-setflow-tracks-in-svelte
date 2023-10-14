<script>
	import { display } from '../../lib/util/util'
	// expose as attrs
	export let data
	/**
	 * @type {{ scene: string, track: string }[]} */
	export let selectedDropZones = []

	/**
	 * @param {string} sceneName
	 * @param {string} trackName */
	function addToSelectedDropZones(sceneName, trackName) {
		const thisDropZone = { sceneName, trackName }
		selectedDropZones.push(thisDropZone)

		console.log('PUSHED: ')
		console.log(selectedDropZones)
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
							data-drop-zone
							data-scene-name={scene.name}
							data-track-name={track.name}
							class:selected={false}
							on:pointerup={() => addToSelectedDropZones(scene.name, track.name)}
						>
							{#each scene.trackList as trackEntry}
								{#if trackEntry.trackName === track.name}
									{#each trackEntry.characterNames as characterName}
										<div data-draggable>{characterName}</div>
									{/each}
								{/if}
							{/each}

							<!-- a [draggable] character per player in scene -->
							<!-- {#each scene.trackList as entry}
								<pre>{JSON.stringify(entry)}</pre>

								{#each entry.characterNames as characterName}
									<div
										data-draggable
										data-character-name={characterName}
									>
										<pre>{JSON.stringify(entry)}</pre>
										{characterName}
									</div>
								{/each}
							{/each} -->
						</div>
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

	[data-draggable] {
		margin: 0.5rem 0.3rem;
		padding: 0.2rem 1rem;
		border: 2px solid rgb(0, 183, 255);
		border-radius: 1.5rem;
		line-height: 2rem;
		max-width: 16ch;
		text-overflow: clip;
	}
</style>
