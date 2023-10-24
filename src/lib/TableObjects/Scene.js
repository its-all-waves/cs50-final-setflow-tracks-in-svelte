import { nanoid, NANO_ID_LENGTH } from '../util/util'

/**
 * @typedef {object} TrackListItem
 * @property {string} trackName
 * @property {string[]} characterName
 */

/**
 * @typedef {object} Scene
 * @property {string} id
 * @property {string} name
 * @property {TrackListItem[]} trackList
 */

/**
 * @returns {TrackListItem}
 * */
export function newTrackListItem(trackName, charName = null) {
	// TODO: fill in 'context:' in below comment...
	// charName not given         (context: when ??? we're adding to existing scenes (not starting from 0)? )
	if (charName === null) {
		let characterNames = []
		return {
			trackName,
			characterNames
		}
	}

	// charName is given
	let characterNames = [charName]
	return {
		trackName,
		characterNames
	}
}

/**
 * @param {string} name
 * @returns {Scene}
 * */
export function newScene(name, scenes = null, tracks = null) {
	const id = nanoid(NANO_ID_LENGTH)
	const trackList = []

	/* my thinking:
	check what tracks currently exist
	add those tracks to this scene's trackList as trackListItems with empty
	characterNames[] */

	// if we are creating the first scene...
	if (scenes === null) {
		return {
			id,
			name,
			trackList
		}
	}

	/* TODO: i feel like this logic may want to go under newTrack()... this is
	true if the following procedure would be called far less times if in
	newTrack(), but all else still right. */

	// we're adding to existing scenes...

	// add new trackListItems to trackList
	for (let trackName of currentTrackNames(tracks)) {
		trackList.push(newTrackListItem(trackName))
	}

	return {
		id,
		name,
		trackList
	}
}

/** Helper for newScene ...feels like there's a better way...
 * Returns a list of current track names by creating a new set
 * @returns {Set<string>}
 */
function currentTrackNames(tracksArr) {
	let trackNames = new Set()
	for (let track of tracksArr) {
		trackNames.add(track.name)
	}
	return trackNames
}
