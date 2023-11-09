<script>
	import {
		table,
		charactersInHand,
		selectedDropZones,
		canEdit,
		selectedHeader,
		chosenCharacter
	} from './store'

	export let clearAllSelections // FUNCTION

	/**
	 * note: The ordering of the if else statement matters.
	 *		The basic idea is that it flows from most specific condition to most
	 *		general. Character selections are prioritized over table element
	 *		selections.
	 */
	function handleTrashButtonClick() {
		// conditions deciding the behavior of the delete button
		const aCharacterFromTableIsChosen = $chosenCharacter.name != undefined
		const aCharacterInHand = $charactersInHand.length === 1
		const noCharacterInHand = $charactersInHand.length === 0
		const pickedUpFromPool = $charactersInHand[0]?.location === '__pool__'
		const pickedUpFromTable =
			$charactersInHand[0]?.location !== '__pool__' &&
			$charactersInHand[0]?.location != undefined
		const clickedChosenCharacterAgain = aCharacterInHand && pickedUpFromTable // yes, this looks funny, but it's correct. tried aCharacterFromTableIsChosen instead of aCharacterInHand, but that described unintended condition
		const atLeastOneDropZoneIsSelected = $selectedDropZones.length > 0
		const aTrackIsSelected = $selectedHeader.type === 'track'
		const aSceneIsSelected = $selectedHeader.type === 'scene'
		const noHeaderSelected = $selectedHeader.type == undefined
		const nothingSelected = noCharacterInHand && noHeaderSelected
		const clickedCharacterInPool = aCharacterInHand && pickedUpFromPool

		// TODO: ADD CONFIRM DELETE POPUP: tell user exactly what's about to happen

		// a character can only be chosen from the table, not the pool
		if (aCharacterFromTableIsChosen) {
			// console.log('1')
			deleteChosenCharacterFromScene()
		} else if (clickedChosenCharacterAgain) {
			// TODO: show ui feedback: all of this character in table is selected
			// console.log('2')
			deleteCharacterInstancesFromTable()
		} else if (clickedCharacterInPool) {
			// console.log('3')
			deleteCharacterInHandEverywhere()
		} else if (atLeastOneDropZoneIsSelected) {
			// console.log('4')
			clearSelectedDropZones()
		} else if (aTrackIsSelected) {
			// console.log('5')
			clearTrack()
		} else if (aSceneIsSelected) {
			// console.log('6')
			clearScene()
		} else if (nothingSelected) {
			// console.log('7')
			clearTable()
		}

		clearAllSelections()
	}

	// DELETE FUNCTIONS 👇🏽

	function deleteChosenCharacterFromScene() {
		// get the scene the chosen character came from
		const { name, sceneName } = $chosenCharacter
		const scene = $table.scenes.find((_) => _.name === sceneName)

		// in the scene's trackList, delete the character in hand
		for (let trackListItem of scene.trackList) {
			const names = trackListItem.characterNames
			const index = names.findIndex((_) => _ === name)
			if (index !== -1) names.splice(index, 1)
		}
		$table.scenes = $table.scenes
	}

	/**
	 * delete[Selected]CharacterFromTable() \
	 * `...Selected...` is generic for 'chosen' or just 'inHand' \
	 */
	function deleteCharacterInstancesFromTable() {
		const { name } = $charactersInHand[0]
		for (let scene of $table.scenes) {
			// find the track list item that has the character in its character names
			const trackListItem = scene.trackList.find((_) => _.characterNames.includes(name))
			if (!trackListItem) continue
			// splice out the character from character names
			const { characterNames } = trackListItem
			const index = characterNames.findIndex((_) => _ === name)
			if (index !== -1) characterNames.splice(index, 1)
		}
		$table.scenes = $table.scenes
	}

	function deleteCharacterInHandEverywhere() {
		deleteCharacterInstancesFromTable()
		// delete from the character pool
		const { name } = $charactersInHand[0]
		$table.characters = $table.characters.filter((_) => _.name !== name)
	}

	function clearSelectedDropZones() {
		for (let dropZone of $selectedDropZones) {
			// find the scene
			const { sceneName, trackName } = dropZone
			const scene = $table.scenes.find((_) => _.name === sceneName)
			const trackIndex = scene?.trackList.findIndex((_) => _.trackName === trackName)
			if (trackIndex === -1) continue
			// delete the whole track list item
			scene.trackList.splice(trackIndex, 1)
		}
		$table.scenes = $table.scenes
	}

	function clearTrack() {
		const name = $selectedHeader.name
		for (let scene of $table.scenes) {
			// from scene's track list,
			const { trackList } = scene
			const index = trackList.findIndex((_) => _.trackName === name)
			if (index === -1) continue
			// remove the track list item for the selected track
			trackList.splice(index, 1)
		}
		$table.scenes = $table.scenes
	}

	function clearScene() {
		const name = $selectedHeader.name
		const scene = $table.scenes.find((_) => _.name === name)
		scene.trackList = []
		$table.scenes = $table.scenes
	}

	function clearTable() {
		$table.scenes.forEach((_) => (_.trackList = []))
		$table.scenes = $table.scenes
	}
</script>

<menu>
	<button
		id="btn-delete"
		on:click={handleTrashButtonClick}
	>
		<img
			src="button-icons/trash.fill.svg"
			alt="Trash can"
			title="Clear the selection, else clear the table"
		/>
	</button>
	<button
		id="edit-table"
		class:edit-mode={$canEdit}
		on:click={() => ($canEdit = !$canEdit)}
	>
		<img
			src={$canEdit ? 'button-icons/checkmark.svg' : 'button-icons/pencil.svg'}
			alt={$canEdit ? 'Check mark' : 'Pencil'}
			title={$canEdit ? 'Done editing' : 'Edit the table'}
		/>
	</button>
</menu>

<style>
	menu {
		display: flex;
		justify-content: space-between;
		margin: 0.5rem;
		padding: 0;
	}

	button {
		display: flex;
		width: fit-content;
		margin: 0;
		padding: 0.5rem;
		text-shadow: 0 0.2rem 0 black;
		background-color: rgba(0, 157, 255, 0.265);
		border: 2px solid rgb(0, 157, 255);
		color: white;
	}

	button img {
		width: 20px;
		aspect-ratio: 1 / 1;
	}

	#edit-table.edit-mode {
		background-color: rgba(120, 54, 54, 0.579);
		border-color: rgb(121, 21, 21);
	}
</style>
