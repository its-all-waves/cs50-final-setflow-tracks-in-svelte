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
	 * Goals for delete button:
	 *
	 * goal \
	 * 	   - state \
	 * 	   - info
	 *
	 * delete char from specific scene \
	 * 	   - pick up char from table \
	 * 	   - characterInHand, characterInHand.location !== '__pool__' \
	 * delete char from entire table \
	 * 	   - pick up char from pool \
	 * 	   - characterInHand, characterInHand.location === '__pool__' \
	 * clear a whole track \
	 * 	   - chose a track \
	 * 	   - selectedHeader.type === 'track', selectedHeader.name === trackName ???, !characterInHand.name, (who is resetting this?) \
	 * clear a whole scene \
	 * 	   - chose a scene	 \
	 * 	   - selectedHeader.type === 'scene', selectedHeader.name === sceneName ???, !characterInHand.name, (need another flag for this and above?) \
	 * clear entire table contents \
	 * 	   - did not choose a scene, track, or character \
	 * 	   - !characterInHand.name,
	 */
	function handleTrashButtonClick() {
		const length = $charactersInHand.length
		const noCharacterInHand = length === 0
		const characterInHand = length === 1
		const location = length > 0 && length < 2 ? $charactersInHand[0].location : undefined

		if ($selectedDropZones.length) {
			console.log('1 ???')
			deleteContentsOfSelectedDropZones()
		}
		// nothing is selected
		else if (noCharacterInHand && !$selectedHeader.type) {
			// console.log('2 ???')
			clearTable()
		}
		// selected a character from the TABLE
		else if ($chosenCharacter.name) {
			// console.log('3 ???')
			deleteChosenCharacterFromScene()
		}
		// selected all instances of a character from the TABLE
		// (to delete the instances from the table only)
		// get here by clicking a chosen character again
		else if (characterInHand && location !== '__pool__') {
			deleteCharacterInHandFromTable()
			// console.log('4 ???')
		}
		// selected a character from the POOL
		else if (characterInHand && location === '__pool__') {
			// console.log('5 ???')
			deleteCharacterInHandEverywhere()
		}
		// selected track header
		else if (noCharacterInHand && $selectedHeader.type === 'track') {
			// console.log('6 ???')
			clearTrack()
		}
		// selected a scene header
		else if ($selectedHeader.type === 'scene') {
			// console.log('7 ???')
			clearScene()
		}

		clearAllSelections()
	}

	// DELETE FUNCTIONS 👇🏽

	function clearTrack() {
		if ($selectedHeader.type !== 'track') return

		const trackName = $selectedHeader.name
		for (let scene of $table.scenes) {
			for (let trackListItem of scene.trackList) {
				if (trackListItem.trackName !== trackName) continue
				trackListItem.characterNames = []
			}
		}
		$table.scenes = $table.scenes
	}

	function clearScene() {
		if ($selectedHeader.type !== 'scene') return
		const sceneName = $selectedHeader.name
		for (let scene of $table.scenes) {
			if (scene.name !== sceneName) continue
			for (let trackListItem of scene.trackList) {
				trackListItem.characterNames = []
			}
		}
		$table.scenes = $table.scenes
	}

	function deleteContentsOfSelectedDropZones() {
		for (let dropZone of $selectedDropZones) {
			// find the scene, clear the track
			const { sceneName, trackName } = dropZone
			const scene = $table.scenes.find((_) => _.name === sceneName)
			const index = scene.trackList.findIndex((_) => _.trackName === trackName)
			if (index === -1) continue
			// delete the whole track list item
			scene.trackList.splice(index, 1)
			console.log('DEBUG')
		}
		$table.scenes = $table.scenes
	}

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

	function deleteCharacterInHandFromTable() {
		// delete from table.scenes
		for (let scene of $table.scenes) {
			for (let trackListItem of scene.trackList) {
				const names = trackListItem.characterNames
				if (names.length === 0) continue
				const index = names.findIndex((_) => _ === $charactersInHand[0].name)
				if (index > -1) names.splice(index, 1)
			}
		}
		$table.scenes = $table.scenes // force ui update
	}

	function deleteCharacterInHandEverywhere() {
		deleteCharacterInHandFromTable()

		// delete from table.characters
		const index = $table.characters.findIndex((_) => _.name === $charactersInHand[0].name)
		if (index === -1) return
		$table.characters.splice(index, 1)
		$table.characters = $table.characters // force ui update
	}

	function clearTable() {
		// TODO: make this not an alert(), and a choice! currently it just warns of the inevitable
		alert('SURE YOU WANT TO CLEAR THE TABLE CONTENTS?')

		for (let scene of $table.scenes) {
			for (let trackListItem of scene.trackList) {
				trackListItem.characterNames = []
			}
		}
		$table.scenes = $table.scenes // force ui update
	}
</script>

<menu>
	<button
		id="clear-table"
		on:click={handleTrashButtonClick}
	>
		<img
			src="button-icons/trash.fill.svg"
			alt="Trash can"
			title="Clear the table"
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

	#clear-table.alert,
	#edit-table.edit-mode {
		background-color: rgba(120, 54, 54, 0.579);
		border-color: rgb(121, 21, 21);
	}
</style>
