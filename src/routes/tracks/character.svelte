<script>
	import { display } from '../../lib/util/util'
	import {
		table,
		charactersInHand,
		selectedDropZones,
		selectedHeader,
		chosenCharacter
	} from './store'

	// exposed to parent as attr
	export let name
	/** @type {'__pool__' | string} */
	export let location // === '__pool__' || scene.name

	function setCharacterInHand() {
		// clicked a chosen character (necessarily in table, and necessarily in hand)
		if (location !== '__pool__' && chosen) {
			// de-chosen the chosen character and return
			$chosenCharacter = {}
			console.log('100 ???')
			return
		}

		// clicked a character in hand in the pool
		if (location === '__pool__' && inHand) {
			// deselect the pool character if clicking it again, return
			$chosenCharacter = {}
			$charactersInHand = []
			console.log('200 ???')
			return
		}

		// clicked the character in hand in the table
		if (location !== '__pool__' && inHand) {
			// set chosen character and return
			$chosenCharacter = {
				name,
				sceneName: location
			}
			console.log('300 ???')
			return
		}

		// if clicked a character in the table
		if (location !== '__pool__') {
			$chosenCharacter = {
				name,
				sceneName: location
			}
			console.log('400 ???')
		}

		// clicked a pool character with a character chosen
		// adding cond 2 keeps prevents unnecessary reactive updates
		if (location === '__pool__' && $chosenCharacter.name) {
			$chosenCharacter = {}
			console.log('800 ???')
		}

		// clicked an unselected character
		// replace what's there with a single character's info
		$charactersInHand = [{ name, location }]
		console.log('500 ???')

		// prevents: unnecessary update of $selectedDropZones
		if (!$selectedHeader.type && !$selectedDropZones.length && !$charactersInHand.length) {
			console.log('600 ???')
			return
		}

		// prevents: character can be added to same scene twice
		removeSelectedDropZonesIfConflict()
		console.log('700 ???')
	}

	/** Helper for setCharacterInHand()
	 * If the character in hand is in this scene, remove this drop zone from
	 * selected drop zones
	 */
	function removeSelectedDropZonesIfConflict() {
		const charInHand = $charactersInHand[0].name

		if (wholeSceneIsSelected) {
			$selectedDropZones = []
			return
		}

		const copyOfSelectedDropZones = [...$selectedDropZones]
		for (let dropZone of copyOfSelectedDropZones) {
			// get the scene this dropZone refers to
			const scene = $table.scenes.find((_) => _.name === dropZone.sceneName)
			if (!scene) continue

			const sceneContainsCharacterInHand = scene.trackList.some((_) =>
				_.characterNames.includes(charInHand)
			)

			if (!sceneContainsCharacterInHand) continue

			const index = $selectedDropZones.indexOf(dropZone)
			if (index === -1) throw new Error('heh?')
			$selectedDropZones.splice(index, 1)
		}
		$selectedDropZones = $selectedDropZones
	}

	$: wholeSceneIsSelected = isWholeSceneSelected($selectedDropZones, $selectedHeader)

	function isWholeSceneSelected(_selectedDropZones, _selectedHeader) {
		if (_selectedHeader.type !== 'scene') return
		return _selectedDropZones.every((_) => _.sceneName === _selectedHeader.name)
	}

	$: inHand = $charactersInHand.length === 1 && $charactersInHand[0].name === name

	$: chosen = iAmThe($chosenCharacter)

	/** Determines if *this* character is the chosen one */
	function iAmThe(_chosenCharacter) {
		return _chosenCharacter.name === name && _chosenCharacter.sceneName === location
	}

	// DEBUG
	// $: console.log(chosen ? `chosen: ${$chosenCharacter.name} : ${$chosenCharacter.sceneName}` : ``)
</script>

<div
	class="character"
	class:inHand
	class:chosen
	data-character-name={name}
	on:pointerup={setCharacterInHand}
>
	{display(name)}
</div>

<style>
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

	.chosen {
		box-shadow: 0 10px 1.5px rgba(0, 0, 0, 0.588), 0 0 30px white, inset 0 1px 1px white,
			inset 0 -2px 3px rgba(0, 0, 0, 0.681);
		border-color: white;
	}
</style>
