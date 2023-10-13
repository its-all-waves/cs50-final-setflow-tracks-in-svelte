<script>
	import { display } from '../../lib/util/util'

	function dropCharacter() {}

	// exposed to parent as attr
	export let data
</script>

<div class="character-pool">
	{#each data.table.characters as character}
		<div data-draggable>
			{display(character.name)}
		</div>
	{/each}
</div>

<style>
	.character-pool {
		display: flex;
		margin: 1.5rem;
		border: 1px solid rgb(0, 255, 255);
		border-radius: 1.5rem;
		min-height: 3rem;
	}

	.character-pool [data-draggable] {
		margin: 0.5rem 0.3rem;
		padding: 0.2rem 1rem;
		border: 2px solid rgb(0, 183, 255);
		border-radius: 1.5rem;
		line-height: 2rem;
		max-width: 16ch;
		text-overflow: clip;
	}
</style>
