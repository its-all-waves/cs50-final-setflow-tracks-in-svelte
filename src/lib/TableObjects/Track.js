// const Track = {
// 	id: null,
// 	name: null,
// 	rowElem: null
// }

import { nanoid } from 'nanoid'

const NANO_ID_LENGTH = 6

/**
 * @param {string} name
 */
export function newTrack(name) {
	console.log('TODO: newTrack()')

	const id = nanoid(NANO_ID_LENGTH)

	/** @type {HTMLElement?} */
	let rowElem = null

	return {
		id,
		name,
		rowElem
	}
}
