<script>
	import { characters, scenes, tracks } from './machine'
	export let node
	export let detail

	$: name =
		detail?.type === 'character'
			? $characters[detail?.id]?.name
			: detail?.type === 'track'
			? $tracks[detail?.id]?.name
			: detail?.type === 'scene'
			? $scenes[detail?.id]?.name
			: undefined
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	class="modal"
	bind:this={node}
	on:keydown={(e) => {
		e.stopPropagation()
		if (e.key !== 'Enter' && e.key !== 'Escape') return
		if (e.key === 'Enter') {
			node.dispatchEvent(
				new CustomEvent('submit-modal-delete', {
					bubbles: true,
					detail
				})
			)
		}
		node.close()
	}}
>
	<form method="dialog">
		<!-- <p>Delete {$characters[detail?.id]?.name}?</p> -->
		<p>Delete {name} {detail?.type === 'character' ? 'everywhere' : ''}?</p>

		<button
			type="button"
			on:click={() => {
				node.close()
			}}
		>
			Cancel
		</button>

		<button
			type="submit"
			on:click={() => {
				node.dispatchEvent(
					new CustomEvent('submit-modal-delete', {
						bubbles: true,
						detail
					})
				)
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
