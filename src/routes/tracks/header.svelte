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

{#if type === 'scene'}
	<th
		data-scene-col={name}
		on:pointerup={setSelectedHeader(type, name)}
	>
		{display(name)}
	</th>
{:else if type === 'track'}
	<th on:pointerup={setSelectedHeader(type, name)}>
		{display(name)}
	</th>
{/if}

<style>
</style>
