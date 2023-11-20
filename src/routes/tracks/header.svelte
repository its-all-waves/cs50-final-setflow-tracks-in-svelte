<script>
	import { display } from '../../lib/util/util'
	import { table, selectedHeader, selectedDropZones, charactersInHand } from './store'

	export let addToSelectedDropZones // FUNCTION

	/** @type {'scene' | 'track'} */
	export let type
	export let name

	function setSelectedHeader() {
		// prevents: have to click scene header twice to select scene under
		// certain conditions
		// if character in hand and clicked a scene header, don't set selected header
		if ($charactersInHand.length && type === 'scene') {
			console.log('1) DENIED setting selected header')
			return
		}

		// prevents: unnecessary update of selected drop zones and selected header
		// if clicked a scene header with no header currently selected
		const thisSceneIsEmpty =
			type === 'scene' && isEmpty($table.scenes.find((_) => _.name === name))
		// if no header selected and this scene is empty, don't set selected header
		if (!$selectedHeader.type && thisSceneIsEmpty) {
			console.log('2) DENIED setting selected header')
			return
		}

		// deselect the header if clicking it again
		const clickedSelectedHeader = $selectedHeader.name === name && $selectedHeader.type === type
		$selectedHeader = clickedSelectedHeader ? {} : { type, name }

		setSelectedDropZonesBySelectedHeader()
	}

	function setSelectedDropZonesBySelectedHeader() {
		// TODO: confirm: seems i no longer need this
		// // prevents: have to click scene twice to select in certain conditions
		// if ($charactersInHand.length && $selectedHeader.type === 'scene') return

		// if no header selected, clear selected drop zones
		if (!$selectedHeader.type /* && type === 'track' */) {
			$selectedDropZones = [] // else we just keep adding to the array; side effect: clears any existing track selection -- i am ok with that
			// TODO: should i give ui feedback here?
			return
		}

		// update selected drop zones when a track header is selected
		else if ($selectedHeader.type === 'track') {
			$selectedDropZones = [] // else we just keep adding to the array
			for (let scene of $table.scenes) {
				addToSelectedDropZones(scene.name, $selectedHeader.name)
			}
		}

		// update selected drop zones when a scene header is selected
		else if ($selectedHeader.type === 'scene') {
			$selectedDropZones = [] // else we just keep adding to the array

			// if scene is empty, it cannot be selected, so return
			const selectedScene = $table.scenes.find((_) => _.name === $selectedHeader.name)
			if (!selectedScene) throw new Error('Huuwhat?')
			if (isEmpty(selectedScene)) {
				// TODO: why does it feel wrong to do stuff to selectedHeader here?
				$selectedHeader = {} // side effect: clears any existing track selection -- i am ok with that
				return
			}

			// selected scene contains >= 1 character (thus allowing selection),
			// so select the scene's drop zones
			for (let track of $table.tracks) {
				addToSelectedDropZones($selectedHeader.name, track.name)
			}
		}
	}

	function isEmpty(scene) {
		return scene.trackList.every((_) => _.characterNames.length === 0)
	}
</script>

<th
	data-scene-header={type === 'scene' ? name : undefined}
	data-track-header={type === 'track' ? name : undefined}
	on:pointerup={setSelectedHeader}
>
	{name}
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
