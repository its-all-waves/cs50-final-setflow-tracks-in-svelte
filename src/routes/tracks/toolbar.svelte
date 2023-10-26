<script>
	export let scenes
	export let canEdit

	function clearTable() {
		console.log('CLEAR TABLE')
		alert('SURE YOU WANT TO CLEAR THE TABLE CONTENTS?')

		for (let scene of scenes) {
			for (let trackListItem of scene.trackList) {
				trackListItem.characterNames = []
			}
		}
		scenes = scenes // force ui update
	}
</script>

<menu>
	<button
		id="clear-table"
		on:click={() => clearTable()}
	>
		<img
			src="button-icons/trash.fill.svg"
			alt="Trash can"
			title="Clear the table"
		/>
	</button>
	<button
		id="edit-table"
		class:edit-mode={canEdit}
		on:click={() => (canEdit = !canEdit)}
	>
		<img
			src={canEdit ? 'button-icons/checkmark.svg' : 'button-icons/pencil.svg'}
			alt={canEdit ? 'Check mark' : 'Pencil'}
			title={canEdit ? 'Done editing' : 'Edit the table'}
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
