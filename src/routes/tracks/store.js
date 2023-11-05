// @ts-check
import { writable } from 'svelte/store'

/** @typedef {import('../../lib/types').DropZoneInfo} DropZoneInfo */
/** @typedef {import('../../lib/types').CharacterInHand} CharacterInHand */
/** @typedef {import('../../lib/types').SelectedHeader} SelectedHeader */
/** @typedef {import('../../lib/types').Table} Table */

/**
 * @template T
 * @typedef {import('../../../node_modules/svelte/src/runtime/store/public').Writable<T>} Writable<T> */

// export const table = writable(/** @type {Table} */ {})
/** @type {Writable<Table>} */
export const table = writable(/** @type {Table} */ {})

/** @type {Writable<CharacterInHand[]>} */
export const charactersInHand = writable(
	/** @type {CharacterInHand[]} */
	[]
)

/** @type {Writable<DropZoneInfo[]>} */
export const selectedDropZones = writable(
	/** @type {DropZoneInfo[]} */
	[]
)

/** @type {Writable<SelectedHeader>} */
export const selectedHeader = writable(
	/** @type {SelectedHeader} */
	{}
)

export const canEdit = writable(true)
