// const Character = {
// 	name: null,
// 	elem: null,
// 	defaultTrack: null
// }

/**
 * @param {string} name
 * @returns { { name: string, elem: HTMLElement, defaultTrackName: string }} */
export function newCharacter(name) {
	let elem = null
	let defaultTrackName = null

	return {
		name,
		elem, // draggable!
		defaultTrackName
	}
}
