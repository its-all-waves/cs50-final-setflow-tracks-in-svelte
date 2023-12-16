<script>
	import { Msg, send, tracks, scenes } from './machine'

	import Dropzone from './dropzone.svelte'

	$: tracksEntries = Object.entries($tracks)
	$: scenesEntries = Object.entries($scenes)
</script>

<table data-main-table>
	<thead>
		<tr>
			<th class="empty" />
			<!-- a column header per scene -->
			{#each scenesEntries as [id, { name }]}
				<th data-scene-header={name}>
					<button
						class="scene"
						{id}
						on:click={() => {
							send(Msg.CLICK_SCENE_HEADER, { id })
						}}
					>
						{name}
					</button>
				</th>
			{/each}
		</tr>
	</thead>

	<tbody>
		<!-- a row + header per track -->
		{#each tracksEntries as [trackId, { number: trackNumber, name: trackName }]}
			<tr data-track-row={trackName}>
				<th data-track-header={trackName}>
					<button
						class="track"
						id={trackId}
						on:click={() => {
							send(Msg.CLICK_TRACK_HEADER, { id: trackId })
						}}
						>{`${trackNumber}: ${trackName}`}
					</button>
				</th>
				<!-- a cell (col) per scene -->
				{#each scenesEntries as [sceneId, _]}
					<td>
						<Dropzone
							{sceneId}
							{trackId}
							scene={$scenes[sceneId]}
							{trackName}
						/>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	button {
		padding: 0;
		margin: 0;
		background: none;
		width: 100%;
		box-shadow: none;
		border: none;
		font-weight: inherit;
		font-size: inherit;
		letter-spacing: inherit;
	}

	table,
	thead,
	th,
	tr,
	td {
		margin: 0;
		padding: 0;
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

	/* header stuff */
	th {
		margin: 0;
		padding: 0;
		text-align: center;
		font-size: 0.9rem;
		letter-spacing: 0.1rem;
	}

	[data-scene-header] {
		position: sticky; /* currently does nothing... */
		top: -0.6rem;
		height: 3rem;
		background: rgb(17, 25, 31);
		background: linear-gradient(180deg, rgba(17, 25, 31, 1) 75%, rgba(17, 25, 31, 0) 100%);
	}

	/* row headers - keep narrow */
	[data-track-header] {
		position: sticky;
		left: 0;
		width: 12ch;
		min-width: 9ch;
		background: rgb(17, 25, 31);
		background: linear-gradient(90deg, rgba(17, 25, 31, 1) 75%, rgba(17, 25, 31, 0) 100%);
	}

	th button:hover {
		text-shadow: 0 2px 1px black, 0px 0px 6px black, 0 0 6px rgba(255, 255, 255, 0.75),
			0 0 12px rgba(255, 242, 0, 0.75), 0 0 18px rgba(255, 255, 255, 0.75);
		cursor: pointer;
	}
</style>
