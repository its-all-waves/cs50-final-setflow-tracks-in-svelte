/* 
const Table = {
	tracks: [],
	scenes: [],
	elem: null,
	headerElem: null,
	bodyElem: null
} 
*/

const DEFAULT_TRACK_COUNT = 4

// TODO: in .svelte, name the table .main-table

/** TODO: how to handle track options?
 * @param {string?} trackPrefix
 * @param {number?} trackCount
 * @returns {{ tracks: Track[], scenes: Scene[], elem: HTMLElement, bodyElem: HTMLElement, headerElem: HTMLElement }}
 * */
export function newTableObj(trackPrefix = 'track', trackCount = DEFAULT_TRACK_COUNT) {
	// queried elements should already exist in the skeleton
	// const elem = document.querySelector('[data-main-table]')
	// const bodyElem = elem.querySelector('tbody')
	// const headerElem = elem.querySelector('thead')

	let elem = null
	let bodyElem = null
	let headerElem = null
	const tracks = []
	const scenes = []

	// // create table rows and add to the main table body
	// for (let i = 0; i < trackCount; i++) {
	// 	const trackName = `${trackPrefix}_${i + 1}`
	// 	const row = newRow(trackName)

	// 	bodyElem.append(row)
	// }

	return {
		tracks,
		scenes,
		elem,
		bodyElem,
		headerElem
	}
}

function newRow(trackName) {
	// structure
	const row = document.createElement(HTMLElem.tr)
	const header = newRowHeader(trackName)
	// visuals
	row.classList.add(CssClass.track)
	row.append(header)
	return row
}

/** Helper for newRow() */
function newRowHeader(trackName) {
	const header = document.createElement(HTMLElem.th)
	row.dataset.trackName = trackName
	return header
}

function DEBUG_newCell() {
	const cell = document.createElement(HTMLElem.td)
	cell.textContent = 'HOT DANG'
	return cell
}
