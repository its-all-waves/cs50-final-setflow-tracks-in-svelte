//@ts-check
/** @typedef {import('../types').Character} Character */
/** @typedef {import('../types').Track} Track */
/** @typedef {import('../types').Scene} Scene */
/** @typedef {import('../types').DropZoneInfo} DropZoneInfo */
/** @typedef {import('../types').Table} Table */

/**
 * @returns {Table}
 * */
export function newTableObj() {
	/** @type {Track[]} */
	const tracks = []

	/** @type {Scene[]} */
	const scenes = []

	/** @type {Character[]} */
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
 * @param {string} trackName
 * */
export function newDropZoneInfo(sceneName, trackName) {
	return {
		sceneName,
		trackName
	}
}
