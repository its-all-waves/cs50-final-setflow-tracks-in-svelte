import { nanoid, NANO_ID_LENGTH } from '../util/util'

/**
 * @typedef {object} Track
 * @property {string} id
 * @property {string} name
 * @property {HTMLElement} rowElem
 */

/**
 * @returns {Track}
 * @param {string} name
 */
export function newTrack(name) {
	const id = nanoid(NANO_ID_LENGTH)
	let rowElem = null

	return {
		id,
		name,
		rowElem
	}
}
