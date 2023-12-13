<script>
	/*
	The renaming process
	    - right click shows context menu, puts event target in a store --
	    contextMenuTarget
		- 

		- modal pops up -- "Rename <Type>" with a text box
		- final step -- send(Msg.RENAME, {type, id, newName})




	The deleting process
		- modal pops up -- "Are you sure you want to delete <Name>?"
		- 
	 */

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
		selectedCharacters
	} from './machine'

	import Table from './table.svelte'
	import Character from './character.svelte'
	import Toolbar from './toolbar.svelte'

	import { nanoid } from 'nanoid'
	import ContextMenu from './contextMenu.svelte'

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

	function handleKeyPress(event) {
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
				send(Msg.SMART_DELETE)
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

	// DEBUG
	onMount(DEV_populate_table)

	//

	//

	// context menu ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	let showContextMenu = false
	let contextMenuPosition = { left: 0, top: 0 }
	let contextMenuTarget

	function handleContextMenu(e) {
		if (!e.target.matches('.character') && !e.target.matches('.header')) return
		e.preventDefault()
		contextMenuPosition.left = e.pageX
		contextMenuPosition.top = e.pageY
		contextMenuTarget = e.target // that which was right-clicked
		showContextMenu = true
	}

	function handleContextMenuClickRename(e) {
		e.stopPropagation()
		window.dispatchEvent(new CustomEvent('launch-modal-rename', e.detail))
		lastEventDetail = e.detail
	}

	function handleContextMenuClickDelete(e) {
		e.stopPropagation()
		window.dispatchEvent(new CustomEvent('launch-modal-delete', e.detail))
		lastEventDetail = e.detail
	}
</script>

<svelte:window
	on:keydown|passive={handleKeyPress}
	on:contextmenu={() => (showContextMenu = false)}
	on:contextmenu={handleContextMenu}
	on:click={(e) => {
		if (showContextMenu) {
			e.stopPropagation()
			showContextMenu = false
		}
	}}
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
			<Character {id} />
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

	{#if showContextMenu}
		<ContextMenu
			position={contextMenuPosition}
			target={contextMenuTarget}
		/>
	{/if}
</main>

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
