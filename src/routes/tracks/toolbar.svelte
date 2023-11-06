<script>
	import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

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
	 * 	   - chosenHeader.type === 'track', chosenHeader.name === trackName ???, !characterInHand.name, (who is resetting this?) \
	 * clear a whole scene \
	 * 	   - chose a scene	 \
	 * 	   - chosenHeader.type === 'scene', chosenHeader.name === sceneName ???, !characterInHand.name, (need another flag for this and above?) \
	 * clear entire table contents \
	 * 	   - did not choose a scene, track, or character \
	 * 	   - !characterInHand.name,
	 */
	function handleTrashButtonClick() {
		// nothing is selected
		if ($charactersInHand.length === 0 && !$selectedHeader.type) {
			clearTable()
		}
		// selected a character from the TABLE
		else if ($charactersInHand.length === 1 && $charactersInHand[0].location !== '__pool__') {
			deleteCharacterInHandFromScene()
		}
		// selected a character from the POOL
		else if ($charactersInHand.length === 1 && $charactersInHand[0].location === '__pool__') {
			deleteCharacterInHandEverywhere()
		}
		// selected track header
		else if ($charactersInHand.length === 0 && $selectedHeader.type === 'track') {
			clearTrackInAllScenes()
		}
		// // selected a scene header
		// else if ($selectedHeader.type === 'scene') {
		// 	console.log('selected a SCENE header')
		// }

		clearAllSelections()
	}

	// DELETE FUNCTIONS 👇🏽

	function clearTrackInAllScenes() {
		const trackName = $selectedHeader.name
		for (let scene of $table.scenes) {
			for (let trackListItem of scene.trackList) {
				if (trackListItem.trackName !== trackName) continue
				trackListItem.characterNames = []
			}
		}
		$table.scenes = $table.scenes
	}

	function deleteCharacterInHandFromScene() {
		// get the scene the character in hand came from
		const index = $table.scenes.findIndex((_) => _.name === $charactersInHand[0].location)
		if (index === -1) throw new Error('How did we get here?')
		const scene = $table.scenes[index]

		// in the scene's trackList, delete the character in hand
		for (let trackListItem of scene.trackList) {
			const names = trackListItem.characterNames
			const index = names.findIndex((_) => _ === $charactersInHand[0].name)
			if (index > -1) names.splice(index, 1)
		}
		$table.scenes = $table.scenes
	}

	function deleteCharacterInHandEverywhere() {
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
