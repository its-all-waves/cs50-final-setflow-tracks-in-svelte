<script>
	import { characters } from './machine'

	export let node
	export let detail
	let newName = ''

	$: name = detail?.type === 'character' ? $characters[detail?.id]?.name : '<scene | track>'
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	class="modal"
	bind:this={node}
	on:keydown={(e) => {
		if (e.key !== 'Escape') return
		newName = ''
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
				node.dispatchEvent(
					new CustomEvent('submit-modal-rename', {
						bubbles: true,
						detail: {
							...detail,
							newName
						}
					})
				)
				newName = ''
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
