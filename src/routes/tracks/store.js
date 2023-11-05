//@ts-check
import { writable } from 'svelte/store'

/** @typedef {import('../../lib/types').DropZoneInfo} DropZoneInfo */
/** @typedef {import('../../lib/types').Table} Table */

export const table = writable(/** @type {Table} */ {})

export const charactersInHand = writable(
	/** @type {{name: string, location: string}[]} */
	[]
)

export const selectedDropZones = writable(/** @type {DropZoneInfo[]} */ [])

export const canEdit = writable(true)

export const selectedHeader = writable(
	/** @type {{type: string, name: string}} */
	{}
)
