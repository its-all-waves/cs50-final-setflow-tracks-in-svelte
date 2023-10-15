<script>
	import { display } from '../../lib/util/util'

	// exposed to parent as attr
	/** @type {Character} */
	export let characterName
	export let characterInHand

	/** a reference to THIS element (search bind:this) */
	let self

	function setCharacterInHand(event) {
		characterInHand = event.target.dataset.characterName
		console.log(`IN HAND: ${characterInHand}`)
	}
</script>

<div
	bind:this={self}
	class:in-hand={characterName === characterInHand}
	data-draggable
	data-character-name={characterName}
	on:pointerdown={setCharacterInHand}
>
	{display(characterName)}
</div>

<style>
	[data-draggable] {
		margin: 0.5rem 0.3rem;
		padding: 0.2rem 1rem;
		border: 2px solid rgb(0, 183, 255);
		border-radius: 1.5rem;
		line-height: 2rem;
		max-width: 16ch;
		text-overflow: clip;
		font-size: 1.25rem;
	}

	.in-hand {
		border: 3px solid red;
	}
</style>
