<script>
	import { display } from '../../lib/util/util'
	import { table, characterInHand, selectedDropZones, canEdit } from './store'

	// exposed to parent as attr
	export let name
	export let location // === '__pool__' || scene.name

	function setCharacterInHand() {
		$characterInHand = {
			name,
			location
		}
	}

	$: chosen = isLastClickedCharacterFromTable($characterInHand)

	function isLastClickedCharacterFromTable(charInHand) {
		return (
			charInHand.location !== '__pool__' &&
			charInHand.location === location &&
			charInHand.name === name
		)
	}
</script>

<div
	class:in-hand={name === $characterInHand.name}
	class:chosen
	data-draggable
	data-character-name={name}
	on:pointerup={setCharacterInHand}
>
	{display(name)}
</div>

<!-- 
	method for allowing deletion of entire scene and track

	spit ball!

	A)

	change characterInHand to an array of the same obj

	anytime a character is clicked -- regardless of location -- the 
	array is cleared and the latest clicked character is inserted

	anytime a track is clicked, a fn would go thru every scene and
	gather all the names from every trackListItem with the same
	.trackName into charactersInHand[]
	
		possible next moves	
			delete everyone ref'd in the array
			+ the array,
			OR 
			cancel, clearing the array itself

	anytime a scene is clicked, a fn would go through all the scene's trackListItems, resetting all .characterNames[] to []

	This doesn't seem to crazy...
	





 -->

<style>
	[data-draggable] {
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
	}

	[data-draggable]::before {
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

	.in-hand::before {
		opacity: 1;
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

	.chosen {
		box-shadow: 0 10px 1.5px rgba(0, 0, 0, 0.588), 0 0 30px white, inset 0 1px 1px white,
			inset 0 -2px 3px rgba(0, 0, 0, 0.681);
		border-color: white;
	}
</style>
