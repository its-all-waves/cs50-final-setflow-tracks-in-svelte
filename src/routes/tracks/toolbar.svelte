<script>
	import {
		table,
		charactersInHand,
		selectedDropZones,
		canEdit,
		selectedHeader,
		chosenCharacter
	} from './store'

	import {
		state,
		send,
		State,
		Msg,
		feedback
		// characterInHand,
		// selectedHeader,
		// selectedCharacters,
		// selectedDropZones,
		// characters,
		// tracks,
		// scenes
	} from './machine'

	$: unlocked = $state === State.TableUnlocked

	// feedback
	let hidden = true
	$: if ($feedback) {
		hidden = false
		setTimeout(() => {
			hidden = true
		}, 2000)
	}
</script>

<menu>
	<button
		id="btn-delete"
		on:click={() => send(Msg.SMART_DELETE)}
	>
		<img
			src="button-icons/trash.fill.svg"
			alt="Trash can"
			title="Clear the selection, else clear the table"
		/>
	</button>

	<button
		id="btn-lock"
		class:unlocked={$state === State.TableUnlocked}
		on:click={() => send(Msg.TOGGLE_LOCK)}
	>
		<img
			src={unlocked ? 'button-icons/lock.open.fill.svg' : 'button-icons/lock.fill.svg'}
			alt={unlocked ? 'Check mark' : 'Pencil'}
			title={unlocked ? 'Done editing' : 'Edit the table'}
		/>
	</button>
</menu>

<span
	id="feedback"
	class:hidden>{$feedback}</span
>

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

	#btn-lock.unlocked {
		background-color: rgba(120, 54, 54, 0.579);
		border-color: rgb(121, 21, 21);
	}

	#feedback {
		/* visibility: hidden; */
		color: goldenrod;
		/* font-weight: bold; */
		font-style: italic;
		font-size: 1rem;
		transition: opacity 1s cubic-bezier(0.1, 0.7, 0.1, 1);
	}

	#feedback.hidden {
		opacity: 0;
		visibility: visible;
	}
</style>
