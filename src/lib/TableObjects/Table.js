/**
 * @typedef {object} Table
 * @property {Track[]} tracks
 * @property {Scene[]} scenes
 * @property {Character[]} characters
 */

/**
 * @typedef {object} DropZoneInfo
 * @property {string} sceneName
 * @property {string} trackName
 */

const DEFAULT_TRACK_COUNT = 4

// TODO: in .svelte, name the table .main-table

/** TODO: how to handle track options?
 * @param {string?} trackPrefix
 * @param {number?} trackCount
 * @returns {Table}
 * */
export function newTableObj(trackPrefix = 'track', trackCount = DEFAULT_TRACK_COUNT) {
	const tracks = []
	const scenes = []
	const characters = []

	return {
		tracks,
		scenes,
		characters
	}
}

/**
 * @returns {DropZoneInfo}
 * @param {string} sceneName
 * @param {string} trackName */
export function newDropZoneInfo(sceneName, trackName) {
	return { sceneName, trackName }
}
