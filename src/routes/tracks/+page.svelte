<script>
	import { nanoid } from 'nanoid'

	import { onMount } from 'svelte'

	import {
		DEV_populate_table,
		feedback,
		characters,
		tracks,
		scenes,
		characterInHand,
		send,
		Msg,
		selectedDropZones,
		selectedCharacters,
		lastEventDetail
	} from './machine'

	import Table from './table.svelte'
	import Character from './character.svelte'
	import Toolbar from './toolbar.svelte'
	import ContextMenu from './contextMenu.svelte'
	import ModalDelete from './modalDelete.svelte'
	import ModalRename from './modalRename.svelte'
	import ModalClear from './modalClear.svelte'

	/**
	 * 	@type {import('./$types').PageData} */
	export let data

	/** Add tracks to the global table object */
	function submitTracks(event) {
		const MAX_TRACK_COUNT = 256

		if (event.key !== 'Enter') return

		let label = document.querySelector("input[name='track-prefix']").value
		let count = document.querySelector("input[name='track-count']").value

		// TODO: sanitize inputs
		// must have 2 valid track inputs to proceed
		if (!label || !count) return

		if ($tracks.size + count > 256) {
			const oldCount = count
			count = MAX_TRACK_COUNT - $tracks.size
			feedback.set(
				`Reached maximum track count of ${MAX_TRACK_COUNT}. Added ${count} tracks instead of ${oldCount}.`
			)
		}

		// TODO: if label already exists in tracks, keep counting
		// e.g. if "Track 1" - "Track 5" exist, this adds "Track 6"+

		for (let i = 0; i < count; i++) {
			const name = `${label}_${i + 1}`
			const id = `trk_${nanoid(9)}`
			$tracks[id] = { name }
		}
		$tracks = $tracks

		// clear input fields
		label = null
		count = null
	}

	/** Add a scene to the global table object */
	function submitScene(event) {
		if (event.key !== 'Enter') return

		const inputField = event.target
		const name = inputField.value.replace(' ', '_')
		// const name = inputField.value

		// TODO: sanitize input
		if (!name) return

		const id = `scn_${nanoid(9)}` // do keep me tho
		$scenes[id] = { name, trackList: {} }
		const { trackList } = $scenes[id]
		for (const trackId in $tracks) {
			trackList[trackId] = new Set()
		}
		$scenes = $scenes

		// clear the input field
		inputField.value = null
	}

	/** Add a character to the global table object */
	function submitCharacter(event) {
		if (event.key !== 'Enter') return

		let inputField = event.target
		const name = inputField.value.replace(' ', '_')
		// const name = inputField.value

		// TODO: validate input
		if (!name) return

		const id = `chr_${nanoid(9)}` // do keep me tho
		$characters[id] = { name }
		$characters = $characters

		sortCharactersAtoZ()

		inputField.value = null
	}

	function sortCharactersAtoZ() {
		let swapCounter = -1
		while (true) {
			if (swapCounter === 0) break
			swapCounter = 0
			for (let i = 0; i < $characters.length - 1; i++) {
				const name1 = $characters[i].name
				const name2 = $characters[i + 1].name
				const name1BelongsBeforeName2 = name1.localeCompare(name2) < 0
				if (name1BelongsBeforeName2) continue
				const temp = $characters[i]
				$characters[i] = $characters[i + 1]
				$characters[i + 1] = temp
				swapCounter++
			}
		}
		$characters = $characters
	}

	function handleKeyboardShortcut(event) {
		switch (event.key) {
			case 'Escape':
				send(Msg.CANCEL)
				break
			case 'Enter':
				event.preventDefault()
				event.stopPropagation()
				send(Msg.COMMIT_CHARACTER_TO_TABLE)
				break
			case 'Delete': // fall thru
			case 'Backspace':
				window.dispatchEvent(new CustomEvent('launch-modal-clear'))
				break
		}
	}

	// keep characters for the ui
	$: charactersEntries = Object.entries($characters).sort(([_, a], [__, b]) => {
		if (a.name < b.name) {
			return -1
		} else if (b.name < a.name) {
			return 1
		}
		return 0
	})

	// context menu ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	let showContextmenu = false
	let contextmenuMousePos = { x: 0, y: 0 }
	/** that which was right-clicked */
	let contextmenuTarget

	function handleContextMenu(e) {
		if (
			!e.target.matches('.character') &&
			!e.target.matches('.track') &&
			!e.target.matches('.scene')
		) {
			return
		}
		e.stopPropagation()
		e.preventDefault()
		contextmenuMousePos = { x: e.pageX, y: e.pageY }
		contextmenuTarget = e.target
		showContextmenu = true
	}

	function handleContextmenuClickRename(e) {
		e.stopPropagation()
		window.dispatchEvent(new CustomEvent('launch-modal-rename', e.detail))
		$lastEventDetail = e.detail
	}

	function handleContextmenuClickDelete(e) {
		e.stopPropagation()
		window.dispatchEvent(new CustomEvent('launch-modal-delete', e.detail))
		$lastEventDetail = e.detail
	}

	// rename modal ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	let modalRename

	function handleLaunchModalRename(e) {
		e.stopPropagation()
		modalRename.showModal()
		$lastEventDetail = null
	}

	function handleSubmitModalRename(e) {
		e.stopPropagation()
		send(Msg.RENAME, e.detail)
		$lastEventDetail = null
	}

	// delete modal ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	let modalDelete

	function handleLaunchModalDelete(e) {
		e.stopPropagation()
		modalDelete.showModal()
		$lastEventDetail = null
	}

	function handleSubmitModalDelete(e) {
		e.stopPropagation()
		const { type, id } = e.detail
		const msg =
			type === 'character'
				? Msg.DELETE_CHARACTER
				: type === 'track'
				? Msg.DELETE_TRACK
				: type === 'scene'
				? Msg.DELETE_SCENE
				: undefined
		send(msg, { id })
		$lastEventDetail = null // pretty sure i can remove this everywhere and make this var local to page.svelte again
	}

	// modal clear +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	let modalClear

	function handleLaunchModalClear(e) {
		e.stopPropagation()
		modalClear.showModal()
	}

	function handleSubmitModalClear(e) {
		e.stopPropagation()
		send(Msg.SMART_CLEAR)
	}

	// DEBUG +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	onMount(DEV_populate_table)
</script>

<svelte:window
	on:contextmenu={handleContextMenu}
	on:contextmenu-click-rename={handleContextmenuClickRename}
	on:launch-modal-rename={handleLaunchModalRename}
	on:submit-modal-rename={handleSubmitModalRename}
	on:contextmenu-click-delete={handleContextmenuClickDelete}
	on:launch-modal-delete={handleLaunchModalDelete}
	on:submit-modal-delete={handleSubmitModalDelete}
	on:launch-modal-clear={handleLaunchModalClear}
	on:submit-modal-clear={handleSubmitModalClear}
	on:click|capture={(e) => {
		/* capture & if showContextMenu prevent click outside 
		of context menu from doing anything else -- next click 
		can interact with other things */
		if (showContextmenu) {
			e.stopPropagation()
			showContextmenu = false
		}
	}}
	on:keydown={handleKeyboardShortcut}
/>

<main class="container">
	<article>
		<!-- does character in hand need to be a bind: ? -->
		<Toolbar />
		<!-- a poor-man's OR op? -->
		{#if Object.keys($tracks).length + Object.keys($scenes).length > 0}
			<div class="table">
				<Table />
			</div>
		{/if}
	</article>

	<div class="character-pool">
		{#each charactersEntries as [id, { name }]}
			<Character
				{id}
				isInstance={false}
				{name}
				sceneId={undefined}
				trackId={undefined}
			/>
		{/each}
		<button
			id="btn-commit"
			class:hidden={$characterInHand == null}
			on:pointerup={() => {
				send(Msg.COMMIT_CHARACTER_TO_TABLE)
			}}
		>
			&#x2713
		</button>
	</div>

	<!-- <DebugInfo /> -->

	<div class="inputs">
		<div class="track-input">
			<input
				autofocus
				name="track-prefix"
				type="text"
				value={'input'}
				on:keydown={submitTracks}
			/>
			<span> X </span>
			<input
				name="track-count"
				type="text"
				value={4}
				on:keydown={submitTracks}
			/>
		</div>

		<div class="scene-input">
			<input
				name="scene-name"
				type="text"
				placeholder="add a scene"
				on:keydown={submitScene}
			/>
		</div>

		<div class="actor-input">
			<input
				name="actor-name"
				type="text"
				placeholder="add a character"
				on:keydown={submitCharacter}
			/>
		</div>
	</div>
</main>

{#if showContextmenu}
	<ContextMenu
		mousePosition={contextmenuMousePos}
		menuTarget={contextmenuTarget}
	/>
{/if}

<!-- HTML dialog as a modal (hidden until .showModal() is called) -->
<ModalRename
	bind:node={modalRename}
	detail={$lastEventDetail}
/>

<ModalDelete
	bind:node={modalDelete}
	detail={$lastEventDetail}
/>

<ModalClear bind:node={modalClear} />

<style>
	/* should be end selector ($=, not *=), but would not work */
	.track-input {
		display: grid;
		grid-template-columns: 2fr 0.2fr 2fr;
		align-items: center;
	}

	.track-input span {
		text-align: center;
	}

	.h-scroll {
		overflow-x: auto;
	}

	.v-scroll {
		/* counter-intuitively, overflow must be unchanged to allow sticky thead */
		/* overflow-y: auto; */
	}

	article {
		overflow-y: auto;
		margin-top: 0;
		padding-top: 0;
	}

	.table {
		max-height: 80%;
		overflow: auto;
	}

	button {
		margin: 1rem;
		padding: 0.5rem;
	}

	.character-pool {
		position: relative;
		display: flex;
		margin: 1.5rem;
		border: 1px solid rgb(0, 157, 255);
		border-radius: 1.5rem;
		min-height: 3rem;

		/* overflow-x: auto; */
		/* overflow-y: visible; */
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 1rem;
		font-size: 2.4rem;
		text-shadow: 0 0.2rem 0 black;
		width: 3ch;
		background-color: #124266;
		border: 2px solid rgb(0, 157, 255);
		color: white;
	}

	.character-pool button {
		position: absolute;
		right: 0;
		border-radius: 0 1.5rem 1.5rem 0;
		height: 100%;

		padding: 0;
		margin: 0;

		/* position: sticky; */
	}

	.character-pool button {
		/* background-color: rgb(0, 157, 255); */
	}

	.hidden {
		display: none !important;
	}

	form.inputs {
		margin: 3rem;
	}

	/* applies to table's container when canEdit */
	.glow {
		box-shadow: 0 0 36px #885df1;
	}
</style>
