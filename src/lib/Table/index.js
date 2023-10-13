import { CssClass } from '../util/enums'

const DEFAULT_TRACK_COUNT = 4

// TODO: in .svelte, name the table .main-table
// TABLE PROPS
/** @type {HTMLTableElement} */
export const tableElem = document.querySelector('[data-main-table]')
export const bodyElem = tableElem.querySelector('tbody')
export const headerElem = tableElem.querySelector('thead')
export const footerElem = tableElem.querySelector('tfoot')

/** TODO: how to handle track options?
 * @param {string?} trackPrefix
 * @param {number?} trackCount
 * @param {Scene?} scene
 * Create a table with either both track options or a scene */
export function createTable(trackPrefix = 'track', trackCount = DEFAULT_TRACK_COUNT) {
	// TODO: VALIDATE INPUT

	// create table rows and add to the main table body
	for (let i = 0; i < trackCount; i++) {
		const trackName = `${trackPrefix}_${i + 1}`
		const row = newRow(trackName)
		bodyElem.append(row)
	}

	// GENERATE THE HTML TABLE BASE ON THE INPUT

	// ADD TABLE TO DOM
}

function newRow(trackName) {
	// structure
	const row = document.createElement('tr')
	const header = newHeader(trackName)
	// visuals
	row.classList.add(CssClass.track)
	row.append(header)
	return row
}

/** Helper for newRow() */
function newHeader(trackName) {
	const header = document.createElement('th')
	row.dataset.trackName = trackName
	return header
}
