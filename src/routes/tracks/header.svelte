<script>
	import { display } from '../../lib/util/util'
	import { table, selectedHeader, selectedDropZones } from './store'

	export let addToSelectedDropZones // FUNCTION

	/** @type {'scene' | 'track'} */
	export let type
	export let name

	function setSelectedHeader() {
		// deselect the header if clicking it again
		if ($selectedHeader.name === name && $selectedHeader.type === type) {
			$selectedHeader = {}
			return
		}
		// clicking an unselected header, so select it
		$selectedHeader = { type, name }
	}

	// clear selected drop zones when no header selected
	$: setSelectedDropZonesBy($selectedHeader)

	function setSelectedDropZonesBy(header) {
		if (!header.type) {
			$selectedDropZones = []
		}
		// update selected drop zones when a track header is selected
		else if (header.type === 'track') {
			for (let scene of $table.scenes) {
				addToSelectedDropZones(scene.name, header.name)
			}
		}
		// TODO: update selected drop zones when a scene header is selected
		else if (header.type === 'scene') {
			// for (let _ of $table.___) {
			// 	addToSelectedDropZones(scene.name, $selectedHeader.name)
			// }
		}
	}
</script>

<th
	data-scene-header={type === 'scene' ? name : undefined}
	data-track-header={type === 'track' ? name : undefined}
	on:pointerup={setSelectedHeader(type, name)}
>
	{display(name)}
</th>

<style>
	th {
		margin: 0;
		padding: 0;
		text-align: center;
		font-weight: bold;
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

	th:hover {
		text-shadow: 0 2px 1px black, 0px 0px 6px black, 0 0 6px rgba(255, 255, 255, 0.75),
			0 0 12px rgba(255, 242, 0, 0.75), 0 0 18px rgba(255, 255, 255, 0.75);
		cursor: pointer;
	}
</style>
