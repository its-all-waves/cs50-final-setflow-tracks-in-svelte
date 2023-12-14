<script>
	import { nanoid } from 'nanoid'
	import { Msg, characterInHand, characters, send, selectedCharacters } from './machine'

	export let isInstance
	export let id
	export let name
	export let sceneId
	export let trackId

	const instanceId = isInstance ? `ins_${nanoid(9)}_${id}` : undefined

	$: inHand = name
		? name === $characters[$characterInHand]?.name
		: $characters[id]?.name === $characters[$characterInHand]?.name

	$: selected = isIn($selectedCharacters)

	function isIn(selCharacters) {
		// console.log('THIS IS RUNNING 2')
		for (const selected of selCharacters) {
			if (selected.instanceId === instanceId) return true
		}
		return false
	}
</script>

{#if $characters[id]}
	<!-- solves a problem I don't understand that breaks the
ui after deleting a character -->
	<button
		{id}
		{instanceId}
		class="character"
		class:inHand
		class:selected
		data-character-name={name ?? $characters[id].name}
		on:click|preventDefault={() => {
			const msg = isInstance ? Msg.CLICK_TABLE_CHARACTER : Msg.CLICK_POOL_CHARACTER
			send(msg, { instanceId, id, sceneId, trackId })
		}}
	>
		{$characters[id].name}
	</button>
{/if}

<style>
	button {
		padding: 0;
		margin: 0;
		background: none;
		width: fit-content;
		box-shadow: none;
	}

	.character {
		margin: 0.5rem 0.5rem;
		padding: 0.2rem 1rem;
		max-width: 16ch;
		border-top: 2px solid goldenrod;
		border-left: 2px solid goldenrod;
		border-bottom: 2px solid goldenrod;
		border-right: 2px solid goldenrod;
		border-radius: 1.5rem;
		background-color: #11191f;
		line-height: 2rem;
		text-overflow: clip;
		font-size: 1.25rem;
		user-select: none;
		text-shadow: 0 2px 0 black;

		box-shadow: 0 3px 1.5px rgba(0, 0, 0, 0.7);

		position: relative;

		align-self: center; /* somehow made the top and bottom shrink up to the content?! woo! */
	}

	.character:hover {
		cursor: pointer;
	}

	.character::before {
		position: absolute;
		content: '';
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		border-radius: 1.5rem;
		border-top: 3px solid black;
		border-left: 3px solid black;
		border-right: 3px solid black;
		opacity: 0.75;
		filter: blur(1px);

		box-shadow: 0 -2px 0 white, inset 0 2px 0px rgba(255, 230, 165, 0.607);
	}

	.inHand::before {
		opacity: 1;
	}

	.inHand {
		/* border-color: goldenrod; */
		border-width: 1;
		scale: 1.25;
		/* scale: 1.25; */
		transform: translateY(-0.3rem);
		box-shadow: 0 10px 1.5px rgba(0, 0, 0, 0.588), 0 0 30px rgb(255, 193, 37),
			inset 0 1px 1px goldenrod, inset 0 -2px 3px rgba(0, 0, 0, 0.681);
		transition: border 0.1s, scale 0.1s, box-shadow 0.1s;
	}

	.selected {
		box-shadow: 0 10px 1.5px rgba(0, 0, 0, 0.588), 0 0 30px white, inset 0 1px 1px white,
			inset 0 -2px 3px rgba(0, 0, 0, 0.681);
		border-color: white;

		border-width: 1;
		scale: 1.1;
		transform: translateY(-0.3rem);
		transition: border 0.1s, scale 0.1s, box-shadow 0.1s;
	}
</style>
