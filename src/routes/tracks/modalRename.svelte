<script>
	import { characters, tracks, scenes } from './machine'

	export let node
	export let detail
	let newName = ''

	$: name =
		detail?.type === 'character'
			? $characters[detail?.id]?.name
			: detail?.type === 'track'
			? $tracks[detail?.id]?.name
			: detail?.type === 'scene'
			? $scenes[detail?.id]?.name
			: undefined

	// reactive bc newName will change when set
	$: submitModalRename = new CustomEvent('submit-modal-rename', {
		bubbles: true,
		detail: {
			...detail,
			newName
		}
	})
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	class="modal"
	bind:this={node}
	on:keydown={(e) => {
		e.stopPropagation()
		if (e.key !== 'Escape' && e.key !== 'Enter') return
		if (e.key === 'Enter') {
			if (!newName) {
				node.close()
				return
			}
			node.dispatchEvent(submitModalRename)
		}
		newName = ''
		node.close()
	}}
>
	<form method="dialog">
		<p>Rename {name}</p>
		<input
			bind:value={newName}
			type="text"
		/>

		<button
			type="button"
			on:click={() => {
				newName = ''
				node.close()
			}}
		>
			Cancel
		</button>

		<button
			type="submit"
			on:click={() => {
				if (!newName) return
				node.dispatchEvent(submitModalRename)
				newName = ''
				node.close()
			}}
		>
			Confirm
		</button>
	</form>
</dialog>

<style>
	dialog {
		width: 300px;
		height: 300px;
		border: 1px solid gray;
		background: black;
	}

	::backdrop {
		background: rgba(0, 0, 0, 0.485);
	}
</style>
