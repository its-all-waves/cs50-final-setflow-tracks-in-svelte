//@ts-check
import { nanoid, NANO_ID_LENGTH } from '../util/util'

/** @typedef {import('../types').Track} Track */

/**
 * @returns {Track}
 * @param {string} name
 */
export function newTrack(name) {
	/** @type {string} */
	const id = nanoid(NANO_ID_LENGTH)

	return {
		id,
		name
	}
}
