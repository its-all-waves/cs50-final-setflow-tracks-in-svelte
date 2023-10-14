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
 * @returns {TrackListItem} */
export function newTrackListItem(trackName, charName) {
	const characterNames = [charName]
	return {
		trackName,
		characterNames
	}
}

/**
 * @param {string} name
 * @returns {Scene} */
export function newScene(name) {
	const id = nanoid(NANO_ID_LENGTH)
	const trackList = []

	return {
		id,
		name,
		trackList
	}
}
