//@ts-nocheck

import { nanoid } from 'nanoid'
import { writable, get } from 'svelte/store'

// ENUMS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const Msg = Object.freeze({
	UNLOCK_TABLE: 'UNLOCK_TABLE',
	LOCK_TABLE: 'LOCK_TABLE',
	TOGGLE_LOCK: 'TOGGLE_LOCK',
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
	SMART_DELETE: 'DELETE',
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

// CREATE STORES + SUBSCRIBE +++++++++++++++++++++++++++++++++++++++++++++++++++

function useMachine(initialState) {
	const state = writable(initialState)

	/** @param {{msg: string, info: object}} event */
	function send(msg, info) {
		state.update((state) => nextState(state, msg, info))
	}

	return { state, send }
}

export const { state, send } = useMachine(State.TableUnlocked)

/** @description Holds the last response from the machine to display to the user */
export const feedback = writable('')

/** @description The id of the character in the _pool_ that's clicked on to be placed onto the table */
export const characterInHand = writable(/** @type {string?} */ null)

/** @type {string?} */
let $characterInHand
characterInHand.subscribe(($) => ($characterInHand = $))

/** @description A scene or track ID */
export const selectedHeader = writable(/** @type {string?} */ null)

/** @type {string?} */
let $selectedHeader
selectedHeader.subscribe(($) => ($selectedHeader = $))

/** @description The characters selected from the _table_*/
export const selectedCharacters = writable(
	/** @type {Set<{ instanceId: string, characterId: string, sceneId: string }>} */
	new Set()
)

/** @type {Set<{ instanceId: string, characterId: string, sceneId: string }>} */
let $selectedCharacters
selectedCharacters.subscribe(($) => ($selectedCharacters = $))

export const selectedDropZones = writable(/** @type {Set<string>} */ new Set())

/** @type {Set<string>} */
let $selectedDropZones
selectedDropZones.subscribe(($) => ($selectedDropZones = $))

/** @description Keys are dynamic and == character name */
export const characters = writable(
	/** @type {{} | { [characterId: string]: { name: string } }} */
	new Object()
)

/** @type {{} | { [characterId: string]: { name: string } }} */
let $characters
characters.subscribe(($) => ($characters = $))

/** @description Keys are dynamic and == track name */
export const tracks = writable(
	/** @type {{} | { [trackId: string]: { name: string } }} */
	new Object()
)

/** @type {{} | { [trackId: string]: { name: string } }} */
let $tracks
tracks.subscribe(($) => ($tracks = $))

/** @description Keys are dynamic and == scene name, ditto .trackList > track name */
export const scenes = writable(
	/** @type {{} | { [sceneId: string]: { name: string, trackList: {[trackId: string]: Set<string>}} }} */
	new Object()
)

/** @type {{} | { [sceneId: string]: { name: string, trackList: {[trackId: string]: Set<string>}} }} */
let $scenes
scenes.subscribe(($) => ($scenes = $))

// MAIN FUNCTION (PRIVATE) +++++++++++++++++++++++++++++++++++++++++++++++++++++

// TODO: if a lot is repeated here, can it be DRYer by switching on the message?
/**
 * @returns {string}
 * @param {string} state
 * @param {object} event
 * @param {string} event.msg
 * @param {object} event.info
 */
function nextState(state, msg, info) {
	// if info?

	logAction(msg)

	let invalidEvent = false

	// NOTE: _state IS $state !!!
	switch (state) {
		case State.TableLocked:
			if (msg !== Msg.TOGGLE_LOCK) {
				invalidEvent = true
				break
			}
			feedback.set(`table unlocked`)
			return State.TableUnlocked
		case State.TableUnlocked:
			switch (msg) {
				case Msg.TOGGLE_LOCK:
					resetSelections()
					feedback.set(`table locked`)
					return State.TableLocked

				case Msg.CLICK_POOL_CHARACTER:
					clearSelectedCharacters()
					PICK_UP_POOL_CHARACTER(info)
					break

				case Msg.CLICK_TABLE_CHARACTER:
					// drop the character picked up from the pool if there is one
					characterInHand.set(null) // can selected either table characters or pool character
					clearSelectedDropZones() // can select either table characters or drop zones
					SELECT_TABLE_CHARACTER_INSTANCE(info)
					break

				case Msg.CLICK_DROP_ZONE:
					if (!guard_SELECT_DROP_ZONE(info)) break
					clearSelectedCharacters() // can select either table characters or drop zones
					SELECT_DROP_ZONE(info)
					break

				case Msg.CLICK_TRACK_HEADER:
					clearSelectedDropZones()
					SELECT_TRACK(info) // overwrites selected drop zones
					break

				case Msg.CLICK_SCENE_HEADER:
					if (!guard_CLICK_SCENE_HEADER(info)) break
					clearSelectedDropZones()
					SELECT_SCENE(info) // overwrites selected drop zones
					break

				case Msg.COMMIT_CHARACTER_TO_TABLE:
					if (!guard_COMMIT_CHARACTER_TO_TABLE()) break
					COMMIT_CHARACTER_TO_TABLE()
					resetSelections()
					break

				case Msg.SMART_DELETE:
					SMART_DELETE()
					resetSelections()
					break

				// ACCESSED VIA CONTEXT MENU +++++++++++++++++++++++++++++++++++

				case Msg.DELETE_CHARACTER:
					DELETE_CHARACTER(info)
					resetSelections()
					break

				case Msg.DELETE_TRACK:
					DELETE_TRACK(info)
					resetSelections()
					break

				case Msg.DELETE_SCENE:
					DELETE_SCENE(info)
					resetSelections()
					break

				case Msg.RENAME:
					if (!guard_RENAME(info)) break
					RENAME(info)
					break

				default:
					break
			}
			break
		default:
			throw new Error('How did we get here?')
	}

	if (invalidEvent) {
		feedback.set(`event ${msg} is invalid for current state ${state}`)
	}
	return state // unchanged
}

// PRIVATE +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function clearSelectedCharacters() {
	selectedCharacters.update(($) => {
		$.clear()
		return $
	})
}

function clearSelectedDropZones() {
	selectedDropZones.update(($) => {
		$.clear()
		return $
	})
}

function resetSelections() {
	// NOTE: thing.set(x) only sets if thing != x
	characterInHand.set(null)
	clearSelectedCharacters()

	selectedHeader.set(null)
	clearSelectedDropZones()
}

function logAction(action) {
	feedback.set(`---${action}-->`)
}

/** @description Helper for `COMMIT_CHARACTER_TO_TABLE`. An additional filter to
 * prevent a character is duplicated in a scene. */
function containsCharacterInHand(trackList) {
	for (const track in trackList) {
		if (trackList.size === 0 || !trackList[track].has($characterInHand)) continue
		return true
	}
	return false
}

// ACTIONS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/** @param {string} character @description Put `character` in-hand... characterInHand */
function PICK_UP_POOL_CHARACTER({ id }) {
	const { name } = $characters[id]

	// if clicked the character in hand, deselect it
	if (id === $characterInHand) {
		characterInHand.set(null)
		feedback.set(`returned ${name} to pool`)
		return
	}
	characterInHand.set(id)
	feedback.set(`picked up ${name} from pool`)
}

function SELECT_TABLE_CHARACTER_INSTANCE({ instanceId, characterId, sceneId, trackId }) {
	const character = $characters[characterId].name
	const scene = $scenes[sceneId].name

	// if selected, deselect and return
	for (const selected of $selectedCharacters) {
		const { instanceId: id } = selected
		if (id !== instanceId) continue
		$selectedCharacters.delete(selected)
		selectedCharacters.set($selectedCharacters)
		feedback.set(`deselected ${character} in scene ${scene}`)
		return
	}

	// clicked an unselected character, so select it
	// TODO: do i really need to store the whole object? not just the instanceId?
	$selectedCharacters.add({ instanceId, characterId, sceneId, trackId })
	selectedCharacters.set($selectedCharacters)
	feedback.set(`selected ${character} in scene ${scene}`)
}

function guard_SELECT_DROP_ZONE({ sceneId }) {
	// GUARD against selecting drop zone if character in hand is already in scene's trackList
	if (!$characterInHand) return true

	const { trackList } = $scenes[sceneId]
	for (const track in trackList) {
		if (!trackList[track].has($characterInHand)) continue
		feedback.set(
			`rejected drop zone selection: "${characterInHand}" is already in scene "${sceneId}"`
		)
		return false
	}

	return true
}

function SELECT_DROP_ZONE({ sceneId, trackId }) {
	// TODO: TEST ALL OF THESE CONDITIONS
	selectedHeader.set(null)

	const scene = $scenes[sceneId]
	const track = $tracks[trackId]

	// if clicked selected drop zone, deselect it, return
	for (const dz of $selectedDropZones) {
		if (dz.sceneId !== sceneId || dz.trackId !== trackId) continue
		$selectedDropZones.delete(dz)
		selectedDropZones.set($selectedDropZones)
		feedback.set(`deselected drop zone scene ${scene}, ${track}`)
		return
	}

	// if a drop zone scene is already selected, overwrite it
	for (const dz of $selectedDropZones) {
		if (
			dz.sceneId === sceneId && // only need to check scene, but...
			dz.trackId !== trackId // <- prevents unnecessary reassignment (and maybe ui reactivity)
		) {
			$selectedDropZones.delete(dz)
			feedback.set(`deselected drop zone at scene ${scene}, ${track}`)
		}
	}

	// select the drop zone
	$selectedDropZones.add({ sceneId, trackId })
	selectedDropZones.set($selectedDropZones)
	feedback.set(`selected drop zone at scene ${scene}, ${track}`)
}

function SELECT_TRACK({ trackId }) {
	const track = $tracks[trackId].name

	// deselect and return if selected
	if ($selectedHeader === trackId) {
		selectedHeader.set(null)
		feedback.set(`deselected drop zones on ${track}`)
		return
	}

	// clicked an unselected track, so select it
	selectedHeader.set(trackId)

	// select all the drop zones in a track
	for (const sceneId in $scenes) {
		const { trackList } = $scenes[sceneId]
		if (containsCharacterInHand(trackList)) continue // I THINK?
		$selectedDropZones.add({ sceneId, trackId })
		selectedDropZones.set($selectedDropZones)
	}
	feedback.set(`selected all drop zones on ${track}`)
}

function guard_CLICK_SCENE_HEADER({ scene }) {
	// can't select a scene with a character in hand
	if ($characterInHand) {
		feedback.set(`cannot select a scene with a character in hand`)
		return false
	}

	// can't select a scene if it's empty
	let sceneIsEmpty = true
	const { trackList } = $scenes[scene]
	for (const track in trackList) {
		const trackIsOccupied = trackList[track].size > 0
		if (trackIsOccupied) {
			sceneIsEmpty = false
			break
		}
	}
	if (sceneIsEmpty) {
		feedback.set(`scene ${scene} is empty, so it couldn't be selected`)
		return false
	}

	return true
}

function SELECT_SCENE({ scene }) {
	// deselect if selected and return
	if ($selectedHeader === scene) {
		selectedHeader.set(null)
		feedback.set(`deselected drop zones in scene ${scene}`)
		return
	}

	// set the header to scene
	selectedHeader.set(scene)

	// select this scene's non-empty drop zones
	const { trackList } = $scenes[scene]
	for (const track in trackList) {
		if (trackList[track].size === 0) continue
		// track is not empty, so select this drop zone
		$selectedDropZones.add({ scene, track })
	}
	selectedDropZones.set($selectedDropZones)
	feedback.set(`selected populated drop zones in scene ${scene}`)
}

/**
 * @returns {boolean}
 * @description True if selected character from pool (have character in hand) AND there are selected drop zones  */
function guard_COMMIT_CHARACTER_TO_TABLE() {
	return $characterInHand && $selectedDropZones.size > 0
}

function COMMIT_CHARACTER_TO_TABLE() {
	for (const selected of $selectedDropZones) {
		const { sceneId, trackId } = selected
		const { trackList } = $scenes[sceneId]

		/* thought: currently, this disallows selection of a drop zone in a
		scene containing the character in hand. if we want to overwrite the
		selection in this scene, remove character from scene instead of
		`continue` */
		if (containsCharacterInHand(trackList)) continue

		// add character in hand to scene on track
		trackList[trackId].add($characterInHand)
		scenes.set($scenes)
	}

	feedback.set(`committed ${$characterInHand} to selected drop zones`)
}

function SMART_DELETE() {
	// NOTE: check in order of specificity

	if ($selectedCharacters.size > 0) {
		for (const selected of $selectedCharacters) {
			const { instanceId, characterId, sceneId, trackId } = selected
			const { trackList } = $scenes[sceneId]
			trackList[trackId].delete(characterId)
		}
		scenes.set($scenes)
		feedback.set(`cleared selected characters from table`)
	}

	//
	else if ($selectedDropZones.size > 0) {
		for (const dropZone of $selectedDropZones) {
			const { sceneId, trackId } = dropZone
			const { trackList } = $scenes[sceneId]
			trackList[trackId].clear()
		}
		scenes.set($scenes)
		feedback.set(`cleared selected drop zones`)
	}

	// have a character in hand, delete them from the table (not pool)
	else if ($characterInHand) {
		for (const sceneId in $scenes) {
			const { trackList } = $scenes[sceneId]
			for (const trackId in trackList) {
				if (!trackList[trackId].has($characterInHand)) continue
				// this track contains the character in hand
				trackList[trackId].delete($characterInHand)
			}
		}
		scenes.set($scenes)
		feedback.set(`cleared ${$characterInHand} from the table`)
	}

	// TODO: more cases: clear selected scene / track
	//
	// else if ($selectedHeader === )

	// nothing selected, clear all characters from table
	else {
		for (const sceneId in $scenes) {
			const { trackList } = $scenes[sceneId]
			for (const trackId in trackList) {
				if (trackList[trackId].size === 0) continue
				trackList[trackId].clear()
			}
		}
		scenes.set($scenes)
		feedback.set(`cleared all characters from the table`)
	}
}

// The following three DELETE_ functions are to be called via a context menu
function DELETE_CHARACTER({ id }) {
	const character = $characters[id].name

	// delete from pool
	delete $characters[id]
	characters.set($characters)

	// delete from table
	for (const sceneId in $scenes) {
		const { trackList } = $scenes[sceneId]
		for (const trackId in trackList) {
			if (!trackList[trackId].has(id)) continue
			// track contains character in hand, so delete character
			trackList[trackId].delete(id)
		}
	}
	scenes.set($scenes)

	feedback.set(`right click > deleted ${character}`)
}

function DELETE_TRACK({ id }) {
	const track = $tracks[id].name

	// delete from tracks array
	delete $tracks[id]
	tracks.set($tracks)

	// delete from each scene
	for (const sceneId in $scenes) {
		const { trackList } = $scenes[sceneId]
		delete trackList[id]
	}
	scenes.set($scenes)

	feedback.set(`right click > deleted ${track}`)
}

function DELETE_SCENE({ id }) {
	const scene = $scenes[id].name
	delete $scenes[id]
	scenes.set($scenes)
	feedback.set(`right click > deleted scene ${scene}`)
}

function guard_RENAME({ type, id, newName }) {
	let obj
	if (type === 'character') obj = $characters
	if (type === 'track') obj = $tracks
	if (type === 'scene') obj = $scenes

	// can't rename the character if the new name already exists
	const oldName = obj[id].name
	for (const id in obj) {
		if (obj[id].name !== newName) continue
		feedback.set(`couldn't rename ${oldName} to ${newName} as the latter already exists`)
		return false
	}
	return true
}

function RENAME({ type, id, newName }) {
	let oldName
	switch (type) {
		case 'character':
			oldName = $characters[id].name
			$characters[id].name = newName
			characters.set($characters)
			feedback.set(`renamed ${oldName} to ${newName}`)
			break
		case 'track':
			oldName = $tracks[id].name
			$tracks[id].name = newName
			tracks.set($tracks)
			feedback.set(`renamed track ${oldName} to ${newName}`)
			break
		case 'scene':
			oldName = $scenes[id].name
			$scenes[id].name = newName
			scenes.set($scenes)
			feedback.set(`renamed scene ${oldName} to ${newName}`)
			break
		default:
			throw new Error('How did we get here?')
	}
}

// DEBUG +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// enum
export const Test = Object.freeze({
	character_NeNe: 'Né-né',
	character_Zina: 'Zina',
	character_Yuki: 'Yuki',
	character_Igor: 'Igor',
	track_1: 'Track_1',
	track_2: 'Track_2',
	track_3: 'Track_3',
	track_4: 'Track_4',
	scene_33_A: '33-A',
	scene_66_B: '66-B',
	scene_101_D: '101-D',
	scene_V_101_C: 'V-101-C'
})

export function DEV_populate_table() {
	const newChars = {}
	for (const key in Test) {
		if (!key.startsWith('character') || key.endsWith('id')) continue
		const name = Test[key]
		const id = `chr_${nanoid(9)}` // do keep me tho
		newChars[id] = { name }
	}
	characters.set(newChars)

	const newTracks = {}
	for (const key in Test) {
		if (!key.startsWith('track') || key.endsWith('id')) continue
		const name = Test[key]
		const id = `trk_${nanoid(9)}` // do keep me tho
		newTracks[id] = { name }
	}
	tracks.set(newTracks)

	const newScenes = {}
	for (const key in Test) {
		if (!key.startsWith('scene') || key.endsWith('id')) continue
		const name = Test[key]
		const id = `scn_${nanoid(9)}` // do keep me tho
		newScenes[id] = { name, trackList: {} }
		const { trackList } = newScenes[id]
		for (const trackId in $tracks) {
			trackList[trackId] = new Set()
		}
	}
	scenes.set(newScenes)
}
