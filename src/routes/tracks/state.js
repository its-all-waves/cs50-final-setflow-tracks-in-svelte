'use strict'
/* STATE <--> SVELTE COMMUNICATION

do something in svelte (click a thing)
-> dispatch to state machine with a payload if needed 
-> update ctx as needed 
-> all (data? and ) gui stuff is reactive to ctx, defined as a store
*/

// ENUMS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const Transition = Object.freeze({
	UNLOCK_TABLE: 'UNLOCK_TABLE',
	LOCK_TABLE: 'LOCK_TABLE',
	// select from pool
	CLICK_POOL_CHARACTER: 'CLICK_POOL_CHARACTER',
	// select one character instance from table to delete (or rename?)
	CLICK_TABLE_CHARACTER: 'CLICK_TABLE_CHARACTER',
	// select drop zone(s) to drop a character or clear contents
	CLICK_DROP_ZONE: 'CLICK_DROP_ZONE',
	CLICK_TRACK_HEADER: 'CLICK_TRACK_HEADER',
	CLICK_SCENE_HEADER: 'CLICK_SCENE_HEADER',
	// user commands
	COMMIT_CHARACTER_TO_TABLE: 'COMMIT_CHARACTER_TO_TABLE',
	DELETE: 'DELETE',
	CANCEL: 'CANCEL', // TODO: impl me
	DELETE_CHARACTER: 'DELETE_CHARACTER',
	// context menu
	DELETE_SCENE: 'DELETE_SCENE',
	DELETE_TRACK: 'DELETE_TRACK',
	RENAME: 'RENAME'
})

export const State = Object.freeze({
	TableLocked: 'TableLocked',
	TableUnlocked: 'TableUnlocked',
	__parallel__: '__parallel__'
})

// MACHINE PROPS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let current = State.TableLocked

const ctx = {
	/** @type {string?} the character selected from the _pool_ */
	characterInHand: null,

	/** @type {string?} Facilitates deselecting a selected scene/track. Type (scene/track) is given when dispatching the transition. */
	selectedHeader: null,

	/** @type {Set<{ name: string, scene: string, track: string }>} the character selected from the _table_ */
	selectedCharacters: new Set(),

	/** @type {Set<{ scene: string, track: string }>} */
	selectedDropZones: new Set(),

	/** @type {{} | { [character: string]: { name: string } }} first name keys are dynamic, [hence] */
	characters: {},

	/** @type {{} | { [track: string]: { name: string } }} */
	tracks: {},

	/** @type {{} | { [scene: string]: { name: string, trackList: {[trackName: string]: Set<string>}} }} */
	scenes: {}

	/* trackList = { [trackName]: Set<characterName> } */
}

// MACHINE TRANSITIONS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const transitions = {
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	[State.TableLocked]: {
		[Transition.UNLOCK_TABLE]: function () {
			logAction(Transition.UNLOCK_TABLE)
			changeStateTo(State.TableUnlocked)
		}
	},

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	[State.TableUnlocked]: {
		type: State.__parallel__,

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.LOCK_TABLE]: function () {
			logAction(Transition.LOCK_TABLE)
			resetSelections()
			changeStateTo(State.TableLocked)
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.CLICK_POOL_CHARACTER]: function ({ name }) {
			logAction(Transition.CLICK_POOL_CHARACTER)

			const { ctx } = state

			// if clicked the character in hand
			if (ctx.characterInHand === name) {
				ctx.characterInHand = null
				console.log(`returned ${name} to pool`)
				return
			}

			// clicked not character in hand
			ctx.characterInHand = name
			console.log(`picked up ${ctx.characterInHand} from pool`)
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.CLICK_TABLE_CHARACTER]: function ({ name, scene, track }) {
			logAction(Transition.CLICK_TABLE_CHARACTER)

			const { ctx } = state
			const { selectedCharacters } = ctx

			ctx.characterInHand = null

			// if selected, deselect and return
			let characterAlreadySelected
			for (const character in selectedCharacters) {
				if (character.name === name && character.scene === scene) {
					characterAlreadySelected = character
					break
				}
			}
			if (characterAlreadySelected) {
				const character = characterAlreadySelected
				selectedCharacters.delete(character)
				console.log(`deselected ${name} from scene ${scene}`)
				return
			}

			// clicked an unselected character, so select it
			selectedCharacters.add({ name, scene, track }) // FORCE UI UPDATE?
			console.log(`selected ${name} from scene ${scene}`)
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.CLICK_DROP_ZONE]: {
			guard: function ({ scene, track }) {
				const { scenes, characterInHand } = ctx

				// GUARD against selecting drop zone if character in hand is already in scene's trackList
				let sceneContainsCharacterInHand
				if (characterInHand) {
					const { trackList } = scenes[scene]
					for (const t in trackList) {
						if (trackList[t].has(characterInHand)) {
							sceneContainsCharacterInHand = true
						}
					}
				}
				if (sceneContainsCharacterInHand) {
					console.log(
						`rejected drop zone selection: "${characterInHand}" is already in scene "${scene}"`
					)
					return false
				}

				// TODO: what's the rest of the logic?

				return true // allow the fn to execute
			},

			// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			fn: function ({ scene, track }) {
				logAction(Transition.CLICK_DROP_ZONE)

				const { ctx } = state
				const { selectedDropZones } = ctx

				// clear header selection
				ctx.selectedHeader = null

				// TODO: TEST ALL OF THESE CONDITIONS

				// if clicked selected drop zone, deselect it, return
				let dropZoneAlreadySelected
				for (const dropZone of selectedDropZones) {
					if (dropZone.scene === scene && dropZone.track === track) {
						dropZoneAlreadySelected = dropZone
						break
					}
				}
				if (dropZoneAlreadySelected) {
					selectedDropZones.delete(dropZoneAlreadySelected)
					console.log(`deselected drop zone scene ${scene}, ${track}`)
					return
				}

				// if a drop zone scene is already selected, overwrite it
				let selectedDropZoneAlreadyInScene
				for (const dropZone of selectedDropZones) {
					if (
						dropZone.scene === scene && // only need to check scene, but...
						dropZone.track !== track // <- prevents unnecessary reassignment (and maybe ui reactivity)
					) {
						selectedDropZoneAlreadyInScene = dropZone
						break
					}
				}
				if (selectedDropZoneAlreadyInScene) {
					selectedDropZones.delete(selectedDropZoneAlreadyInScene)
					selectedDropZones.add({ scene, track })
					console.log(`replaced drop zone selection in scene ${scene} with ${track}`)
					return
				}

				// clicked an unselected drop zone in a scene without any selected drop zones
				selectedDropZones.add({ scene, track })
				console.log(`selected drop zone scene ${scene}, ${track}`)

				// TODO: if a scene or track header is selected, this click on a drop zone
				// removes the current selection from selected scene's col
			}
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.CLICK_TRACK_HEADER]: function ({ track }) {
			logAction(Transition.CLICK_TRACK_HEADER)

			const { ctx } = state
			const { selectedDropZones, scenes } = ctx

			selectedDropZones.clear()

			// deselect if selected
			const alreadySelected = ctx.selectedHeader === track
			if (alreadySelected) {
				ctx.selectedHeader = null
				console.log(`deselected drop zones on ${track}`)
				return
			}

			// clicked an unselected track, so select it
			ctx.selectedHeader = track

			// select all drop zones on the track
			for (const scene in scenes) {
				selectedDropZones.add({ scene, track })
			}
			console.log(`selected all drop zones on ${track}`)
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.CLICK_SCENE_HEADER]: {
			guard: function ({ scene }) {
				const { characterInHand, scenes } = ctx

				// can't select a scene with a character in hand
				if (characterInHand) {
					console.log(`cannot select a scene with a character in hand`)
					return false
				}

				// can't select a scene if it's empty
				let sceneIsEmpty = true
				const { trackList } = scenes[scene]
				for (const track in trackList) {
					const trackIsEmpty = trackList[track].size === 0
					if (trackIsEmpty) continue
					sceneIsEmpty = false
					break
				}
				if (sceneIsEmpty) {
					console.log(`scene ${scene} is empty, so it couldn't be selected`)
					return false
				}

				return true
			},
			fn: function ({ scene }) {
				logAction(Transition.CLICK_SCENE_HEADER)

				const { ctx } = state
				const { scenes, selectedDropZones } = ctx

				// deselect if selected and return
				const alreadySelected = ctx.selectedHeader === scene
				if (alreadySelected) {
					ctx.selectedHeader = null
					selectedDropZones.clear()
					console.log(`deselected drop zones in scene ${scene}`)
					return
				}

				// since we have something to select, set the selected header
				ctx.selectedHeader = scene

				// select only drop zones that aren't empty
				const { trackList } = scenes[scene]
				for (const track in trackList) {
					if (trackList[track].size === 0) continue
					// track is not empty, so select drop zone at scene, track
					selectedDropZones.add({ scene, track })
				}
				console.log(`selected populated drop zones in scene ${scene}`)
			}
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.COMMIT_CHARACTER_TO_TABLE]: {
			guard: function () {
				const { characterInHand, selectedDropZones } = ctx
				return characterInHand && selectedDropZones.size > 0
			},

			// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			fn: function () {
				logAction(Transition.COMMIT_CHARACTER_TO_TABLE)
				// commit character in hand to all selected drop zones
				const { characterInHand, selectedDropZones, scenes } = ctx

				selectedDropZones.forEach((dropZone) => {
					const { scene, track } = dropZone
					// create the trackList key for this track if it doesn't exist
					if (!scenes[scene].trackList[track]) {
						// create the key in track list
						scenes[scene].trackList[track] = new Set()
					}
					// add character in hand to scene on track
					scenes[scene].trackList[track].add(characterInHand)
				})

				console.log(`committed ${characterInHand} to`, selectedDropZones)

				resetSelections()
			}
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.DELETE]: function () {
			logAction(Transition.DELETE)
			// commit character in hand to all selected drop zones
			const { selectedCharacters, selectedDropZones, characterInHand, characters, scenes } =
				ctx

			// check in order of specificity

			if (selectedCharacters.size > 0) {
				for (const character of selectedCharacters) {
					const { scene, track, name } = character
					const { trackList } = scenes[scene]
					trackList[track].delete(name)
					console.log(`cleared ${name} from scene ${scene}`)
				}
			}

			//
			else if (selectedDropZones.size > 0) {
				for (const dropZone of selectedDropZones) {
					const { scene, track } = dropZone
					const { trackList } = scenes[scene]
					trackList[track].clear()
				}
				console.log(`cleared`, { selectedDropZones })
			}

			//
			else if (characterInHand) {
				for (const scene in scenes) {
					const { trackList } = scenes[scene]
					for (const track in trackList) {
						if (trackList[track].has(characterInHand))
							trackList[track].delete(characterInHand)
					}
				}
				console.log(`cleared ${characterInHand} from the table`)
			}

			// nothing selected, clear all characters from table
			else {
				for (const scene in scenes) {
					const { trackList } = scenes[scene]
					for (const track in trackList) {
						trackList[track].clear()
					}
				}
				console.log(`cleared all characters from the table`)
			}
			// TODO: more cases: clear selected scene / track

			// cleanup selections
			resetSelections()
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.DELETE_CHARACTER]: function () {
			logAction(Transition.DELETE_CHARACTER)

			const { characterInHand, characters, scenes } = ctx

			// delete from pool
			delete characters[characterInHand]

			// delete from table
			for (const scene in scenes) {
				const { trackList } = scenes[scene]
				for (const track in trackList) {
					const characters = trackList[track]
					if (characters.has(characterInHand)) {
						characters.delete(characterInHand)
					}
				}
			}
			console.log(`deleted ${characterInHand} everywhere`)

			resetSelections()
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.DELETE_TRACK]: function ({ track }) {
			logAction(Transition.DELETE_TRACK)
			const { tracks } = ctx
			delete tracks[track]
			console.log(`deleted ${track}`)
			resetSelections()
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		[Transition.DELETE_SCENE]: function ({ scene }) {
			logAction(Transition.DELETE_SCENE)
			const { scenes } = ctx
			delete scenes[scene]
			console.log(`deleted scene ${scene}`)
			resetSelections()
		},

		[Transition.CANCEL]: function () {
			logAction(Transition.CANCEL)
			resetSelections()
			console.log('canceled')
		},

		// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		/**
		 * @param {Object} params - The parameters for the function.
		 * @param {'character' | 'track' | 'scene'} params.type - The type of the transition.
		 * @description This function renames array[name] to array[newName].
		 */
		[Transition.RENAME]: function ({ type, name, newName }) {
			// catch typo in type param
			if (!['character', 'track', 'scene'].includes(type)) {
				throw new Error(`\`type\` must be 'character' | 'track' | 'scene'`)
			}

			// new name can't equal current name
			if (name === newName) {
				throw new Error(`\`name\` cannot equal \`newName\``)
			}

			logAction(Transition.RENAME)

			const { characters, tracks, scenes } = ctx

			switch (type) {
				case 'character':
					renameKeyIn(characters)
					// find character in scenes and rename
					for (const scene in scenes) {
						const { trackList } = scenes[scene]
						for (const track in trackList) {
							if (!trackList[track].has(name)) continue
							trackList[track].delete(name)
							trackList[track].add(newName)
						}
					}
					break
				case 'track':
					renameKeyIn(tracks)
					/* trackList = { [trackName]: Set<characterName> } */
					for (const scene in scenes) {
						const { trackList } = scenes[scene]
						renameKeyIn(trackList)
					}
					break
				case 'scene':
					renameKeyIn(scenes)
					break
				default:
					break
			}

			resetSelections()

			/** TODO: must test thoroughly
                    if pulling rug out from under the feet -- what are the
                    repercussions in the places referencing these things or
                    copies of them? 
                    
                    PROBLEM? Would using static IDs as the keys
                    fix this? */

			/** Rename array[name] to array[newName] */
			function renameKeyIn(obj) {
				obj[newName] = obj[name]
				if (obj[name].name) obj[newName].name = newName
				delete obj[name]
			}
		}
	}
}

// PUBLIC METHODS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * @param {string} transition
 * @param {object} payload
 * @description Alias for dispatch() */
export function msgState(transition, payload) {
	const currentState = current

	// first, assert that the transition is valid for this state
	let action = transitions[currentState][transition]
	if (!action) {
		console.log(`invalid transition ${transition} for state ${currentState}`)
		return
	}

	// if transition has a guard, employ it
	const { guard } = transitions[currentState][transition]
	if (guard) {
		if (guard(payload) === false) {
			console.log(`the guard at ${currentState}:${transition} prevented the action`)
			return
		}
		// guard === true, allowing fn to be called
		action = transitions[currentState][transition].fn
	}

	// apply the action we've decided upon
	if (!action.apply) {
		throw new Error(`Did you forget to write an action for ${currentState}:${transition} ?`)
	}
	action.apply(state, [payload]) // apply() requires an array
}

// PRIVATE METHODS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function changeStateTo(newState) {
	current = newState
	console.log('state changed to', current)
}

// could also dispatch Transition.RESET_SELECTIONS to trigger this as an action
function resetSelections() {
	const { ctx } = state
	const { selectedCharacters, selectedDropZones } = ctx

	// TODO: do i need if checks? add to prevent potential re-rendering of ui
	if (ctx.characterInHand) ctx.characterInHand = null
	if (selectedCharacters.size > 0) selectedCharacters.clear()

	if (ctx.selectedHeader) ctx.selectedHeader = null
	if (selectedDropZones.size > 0) selectedDropZones.clear()
}

function logAction(action) {
	console.log(`---${action}-->`)
}

// EXPORTS FOR DEBUGGING +++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function DEBUG_changeStateTo(newState) {
	changeStateTo(newState)
}
export function DEBUG_resetSelections(newState) {
	resetSelections(newState)
}

// FINAL EXPORT OF STATE OBJECT ++++++++++++++++++++++++++++++++++++++++++++++++

export const state = {
	current,
	ctx,
	transitions
}
