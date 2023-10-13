import { nanoid } from 'nanoid'
export { nanoid }
export const NANO_ID_LENGTH = 6

/**
 * @param {string} name
 * @returns {string}
 * */
export function display(name) {
	return name.replace('_', ' ')
}
