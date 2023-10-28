<script>
	import {
		table,
		characterInHand,
		selectedDropZones,
		canEdit,
		lastClickedCharacter
	} from './store'

	export let resetUiSelectionFlags // FUNCTION
	function handleTrashButtonClick() {
		// TODO: CLEAR A WHOLE TRACK

		if (!$lastClickedCharacter.sceneName) {
			// we haven't selected a particular character
			clearTable()
		} else {
			// we have selected a particular character in a particular scene
			deleteCharacterFromScene()
		}

		resetUiSelectionFlags()
	}

	function deleteCharacterFromScene() {
		// get the scene from $lastClickedCharacter
		const sceneName = $lastClickedCharacter.sceneName
		const sceneIndex = $table.scenes.findIndex((_) => _.name === sceneName)
		const scene = $table.scenes[sceneIndex]

		for (let trackListItem of scene.trackList) {
			for (let characterName of trackListItem.characterNames) {
				const characterIndex = trackListItem.characterNames.findIndex(
					(_) => _ === $lastClickedCharacter.name
				)

				if (characterIndex > -1) {
					trackListItem.characterNames.splice(characterIndex, 1)
				}
			}
		}

		// TODO: is there a more efficient way (is this even inefficient)? i only need to update a single cell in the <table>
		$table.scenes = $table.scenes
	}

	function clearTable() {
		console.log('CLEAR TABLE')
		alert('SURE YOU WANT TO CLEAR THE TABLE CONTENTS?')

		for (let scene of $table.scenes) {
			for (let trackListItem of scene.trackList) {
				trackListItem.characterNames = []
			}
		}
		// scenes = scenes // force ui update
		$table.scenes = $table.scenes
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
