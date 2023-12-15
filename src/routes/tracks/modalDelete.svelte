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
	<article>
		<header>
			<h1>Delete {name} {detail?.type === 'character' ? 'everywhere' : ''}</h1>
		</header>
		<form method="dialog">
			<button
				type="button"
				class="secondary outline"
				on:click={() => {
					node.close()
				}}
			>
				Cancel
			</button>
			<button
				type="submit"
				class="outline red"
				on:click={() => {
					node.dispatchEvent(
						new CustomEvent('submit-modal-delete', {
							bubbles: true,
							detail
						})
					)
				}}
			>
				Delete
			</button>
		</form>
	</article>
</dialog>

<style>
	dialog {
		border: 1px solid gray;
		background: rgba(0, 0, 0, 0.511);
		backdrop-filter: blur(4.25px);
	}
	/* 
	::backdrop {
		background: rgba(0, 0, 0, 1);
	} */

	article {
		padding-bottom: 0;
	}

	header {
		margin-bottom: 1.5rem;
	}

	h1 {
		text-align: center;
		font-size: 1rem;
		padding: 0;
		margin: 0;
		width: 24ch;
	}

	.red {
		border-color: #791515;
		color: #791515;
	}
</style>
