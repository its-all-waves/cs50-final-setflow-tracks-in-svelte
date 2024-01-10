<script>
	import { characters, selectedCharacters, selectedDropZones, characterInHand } from './machine'

	export let node

	let eventSmartClear = new CustomEvent('submit-modal-clear')

	$: prompt =
		$selectedCharacters.size > 0
			? 'Clear selected characters from the table'
			: $selectedDropZones.size > 0
			? 'Clear selected drop zones'
			: $characterInHand
			? `Clear ${$characters[$characterInHand].name} from the table`
			: 'Clear entire table'
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	class="modal"
	bind:this={node}
	on:keydown={(e) => {
		e.stopPropagation()
		if (e.key !== 'Enter' && e.key !== 'Escape') return
		if (e.key === 'Enter') window.dispatchEvent(eventSmartClear)
		node.close()
	}}
>
	<article>
		<header>
			<h1>{prompt}</h1>
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
				id="btn-clear"
				type="submit"
				class="outline red"
				on:click={() => window.dispatchEvent(eventSmartClear)}
			>
				Clear
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
