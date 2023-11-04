/**
 * @returns {import('../types').Table}
 * */
export function newTableObj() {
	/** @type {import('../types').Track[]} */
	const tracks = []

	/** @type {import('../types').Scene[]} */
	const scenes = []

	/** @type {import('../types').Character[]} */
	const characters = []

	return {
		tracks,
		scenes,
		characters
	}
}

/**
 * @returns {import('../types').DropZoneInfo}
 * @param {string} sceneName
 * @param {string} trackName
 * */
export function newDropZoneInfo(sceneName, trackName) {
	return {
		sceneName,
		trackName
	}
}
