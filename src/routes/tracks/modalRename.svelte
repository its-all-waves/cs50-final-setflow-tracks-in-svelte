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
	<article>
		<header>
			<h1>Rename {name}</h1>
		</header>
		<form method="dialog">
			<input
				bind:value={newName}
				type="text"
			/>
			<button
				type="button"
				class="secondary outline"
				on:click={() => {
					newName = ''
					node.close()
				}}
			>
				Cancel
			</button>
			<button
				type="submit"
				class="outline"
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
