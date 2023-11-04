/** @typedef {import('../types').Character} Character */

/**
 * @returns {Character}
 * @param {string} name
 * @param {string?} defaultTrackName
 * */
export function newCharacter(name, defaultTrackName = null) {
	return {
		name,
		defaultTrackName
	}
}
