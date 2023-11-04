import { nanoid, NANO_ID_LENGTH } from '../util/util'

/**
 * @returns {import('../types').TrackListItem}
 * @param {string} trackName
 * @param {string?} charName
 * */
export function newTrackListItem(trackName, charName = null) {
	// TODO: forgot... under what circumstance is this fn called with a charName?
	const characterNames = charName ? [charName] : []

	return {
		trackName,
		characterNames
	}
}

/**
 * @param {string} name
 * @param {import('../types').Scene[]} scenes
 * @param {import('../types').Track[]} tracks
 * @returns {Scene}
 * */
export function newScene(name, scenes = null, tracks = null) {
	/** @type {string} */
	const id = nanoid(NANO_ID_LENGTH)

	/** @type {import('../types').TrackListItem[]} */
	const trackList = []

	/* my thinking:
	check what tracks currently exist
	add those tracks to this scene's trackList as trackListItems with empty
	characterNames[] */

	// TODO: should this condition be scenes.length > 0 ? Then make scenes a
	// required param?
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
 * @param {import('../types').Track[]}
 */
function currentTrackNames(tracks) {
	const trackNames = new Set()
	for (let track of tracks) {
		trackNames.add(track.name)
	}
	return trackNames
}
