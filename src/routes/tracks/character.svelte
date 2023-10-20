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
	class:in-hand={characterName === characterInHand}
	data-draggable
	data-character-name={characterName}
	on:pointerdown={setCharacterInHand}
>
	{display(characterName)}
</div>

<style>
	[data-draggable] {
		margin: 0.5rem 0.5rem;
		padding: 0.2rem 1rem;
		border: 1px solid goldenrod;
		border-radius: 1.5rem;
		background-color: #11191f;
		line-height: 2rem;
		max-width: 16ch;
		text-overflow: clip;
		font-size: 1.25rem;
		user-select: none;
	}

	.in-hand {
		/* border-color: goldenrod; */
		border-width: 1;
		scale: 1.25;
		transform: translateY(-0.3rem);
		box-shadow: 0 10px 1.5px rgba(0, 0, 0, 0.588), 0 0 30px rgb(255, 193, 37),
			inset 0 1px 1px goldenrod, inset 0 -2px 3px rgba(0, 0, 0, 0.681);
		transition: border 0.1s, scale 0.1s, box-shadow 0.1s;
	}
</style>
