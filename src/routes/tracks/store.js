//@ts-check
import { writable } from 'svelte/store'

/** @typedef {import('../../lib/types').DropZoneInfo} DropZoneInfo */
/** @typedef {import('../../lib/types').CharacterInHand} CharacterInHand */
/** @typedef {import('../../lib/types').SelectedHeader} SelectedHeader */
/** @typedef {import('../../lib/types').Table} Table */

export const table = writable(/** @type {Table} */ {})

export const charactersInHand = writable(
	/** @type {CharacterInHand[]} */
	[]
)

export const selectedDropZones = writable(
	/** @type {DropZoneInfo[]} */
	[]
)

export const selectedHeader = writable(
	/** @type {SelectedHeader} */
	{}
)

export const canEdit = writable(true)
