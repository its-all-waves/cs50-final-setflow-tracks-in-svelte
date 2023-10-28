<script>
	import {
		table,
		characterInHand,
		selectedDropZones,
		canEdit,
		lastClickedCharacter,
		selectedHeader
	} from './store'

	export let resetUiSelectionFlags // FUNCTION
	function handleTrashButtonClick() {
		// nothing is selected
		if (!$characterInHand && !$selectedHeader.type) {
			clearTable()
		}
		// selected a character from the TABLE
		else if ($lastClickedCharacter.location !== '__pool__') {
			deleteCharacterFromScene()
		}
		// selected a character from the POOL
		else if ($lastClickedCharacter.location === '__pool__') {
			console.log('selected a character from the POOL')
		}
		// selected track header
		else if ($selectedHeader.type === 'track') {
			console.log('selected a TRACK header')
		}
		// selected a scene header
		else if ($selectedHeader.type === 'scene') {
			console.log('selected a SCENE header')
		}

		/* 
		WHAT ARE ALL THE CASES THAT I WILL PRESS DELETE BUTTON?

		pick up char from...
		table				want to delete that char from that scene
		pool 				want to delete that character from pool and table

		didn't pick up character 

		all the goals?
		
		delete char from specific scene
			pick up char from table
			characterInHand, lastClickedCharacter.location !== '__pool__'
		delete char from entire table
			pick up char from pool
			characterInHand, lastClickedCharacter.location === '__pool__'
		clear a whole track
			chose a track
			chosenHeader.type === 'track', choseHeader.name === trackName, !characterInHand, !lastClickedCharacter (who is resetting this?)
		clear a whole scene
			chose a scene	
			chosenHeader.type === 'scene', choseHeader.name === sceneName, !characterInHand, !lastClickedCharacter (need another flag for this and above?)
		clear entire table contents
			did not choose a scene, track, or character
			!characterInHand, 
		*/

		resetUiSelectionFlags()
	}

	function deleteCharacterFromScene() {
		// get the scene from $lastClickedCharacter
		const location = $lastClickedCharacter.location

		if (location === '__pool__') {
			// delete character from every scene
			deleteCharacterFromAllScenes()
			return
		}

		const sceneIndex = $table.scenes.findIndex((_) => _.name === location)
		if (sceneIndex < 0)
			throw new Error('How did we get here? (toolbar.svelte > deleteCharacterFromScene())')
		const scene = $table.scenes[sceneIndex]

		for (let trackListItem of scene.trackList) {
			const names = trackListItem.characterNames
			const characterIndex = names.findIndex((_) => _ === $lastClickedCharacter.name)
			if (characterIndex > -1) names.splice(characterIndex, 1)
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

	function deleteCharacterFromAllScenes() {
		for (let scene of $table.scenes) {
			for (let trackListItem of scene.trackList) {
				const names = trackListItem.characterNames
				const index = names.findIndex((_) => _ === $lastClickedCharacter.name)
				if (index < 0) {
					console.log('FUCKED UP')
					return
				}
				names.splice(index, 1)
			}
		}
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
