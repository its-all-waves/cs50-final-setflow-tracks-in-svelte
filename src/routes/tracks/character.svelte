<script>
	import { display } from '../../lib/util/util'
	import { table, charactersInHand, selectedDropZones, canEdit, selectedHeader } from './store'

	// exposed to parent as attr
	export let name
	export let location // === '__pool__' || scene.name
	export let trackName

	function setCharactersInHand() {
		// replace whatever is there with a single character's info
		$charactersInHand = []
		$charactersInHand.push({
			name,
			location
		})
		$charactersInHand = $charactersInHand

		// also reset the selected header -- can have but ONE selection! (TODO: FIGURE OUT HOW TO EXPLICIT STATE THIS!)
		$selectedHeader = {}
	}

	$: inHand = $charactersInHand.length > 0 && isInHand($charactersInHand)

	function isInHand(charsInHand) {
		if (charsInHand.length === 0) return false

		// CASE A) one character in hand
		const isTheCharacterInHand = charsInHand.length === 1 && name === charsInHand[0].name

		// return what we have if there's only one of us selected, AND WE HAVE NOT SELECTED A TRACK OR SCENE
		if (charsInHand.length === 1 && !$selectedHeader.type) return isTheCharacterInHand

		// CASE B) more than 1 character in hand (IOW, we have selected a track or scene)
		let onSameTrackAsSelectedHeader = false
		for (let character of charsInHand) {
			if (character.name !== name) continue
			for (let scene of $table.scenes) {
				if (location !== scene.name) continue
				for (let trackListItem of scene.trackList) {
					if (trackListItem.trackName !== $selectedHeader.name) continue
					onSameTrackAsSelectedHeader = true
				}
			}
		}
		return onSameTrackAsSelectedHeader
	}

	$: chosen = isLastClickedCharacterFromTable($charactersInHand)

	function isLastClickedCharacterFromTable(charsInHand) {
		if (charsInHand.length !== 1) return false
		return (
			charsInHand[0].location !== '__pool__' &&
			charsInHand[0].location === location &&
			charsInHand[0].name === name
		)
	}

	/* 
	method for allowing deletion of entire scene and track

	change characterInHand to an array of the same obj

	a character is clicked -- regardless of location -- the 
	contents of the array is replaced with the single clicked character

	a track is clicked, a fn would go thru every scene and
	gather all the names from every trackListItem with the same
	.trackName into charactersInHand[]
	
		possible next moves	
			delete everyone ref'd in the array
			+ the array,
			OR 
			cancel, clearing the array itself

	a scene is clicked, a fn would go through all the scene's trackListItems, resetting all .characterNames[] to []

	BUT PROBLEM

	what state tells us that we can delete all from a track vs all from a scene

	atm -- if charactersInHand.length > 1, we know we're deleting everyone in the list, but from where are we deleting them? how do we know?

	need way to ref selected header -- setSelectedHeader = {type, name}

	a track is chosen...
		set characterInHand.name to characterName, location to scene.name

	*/
</script>

<div
	class:in-hand={inHand}
	class:chosen
	data-draggable
	data-character-name={name}
	on:pointerup={setCharactersInHand}
>
	{display(name)}
</div>

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
