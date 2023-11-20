// @ts-check
import { writable, derived } from 'svelte/store'

/** @typedef {import('../../lib/types').DropZoneInfo} DropZoneInfo */
/** @typedef {import('../../lib/types').CharacterInHand} CharacterInHand */
/** @typedef {import('../../lib/types').ChosenCharacter} ChosenCharacter */
/** @typedef {import('../../lib/types').SelectedHeader} SelectedHeader */
/** @typedef {import('../../lib/types').Table} Table */

/**
 * @template T
 * @typedef {import('../../../node_modules/svelte/src/runtime/store/public').Writable<T>} Writable<T> */

// import { state as _state } from './state'

export const state = writable(new Object())

export const ctx = derived(state, ($state) => {
	return $state.ctx
})

// TO BE REPLACED BY VALUES IN state !!!

/** @type {Writable<Table>} */
export const table = writable(new Object())

/** @type {Writable<CharacterInHand[]>} */
export const charactersInHand = writable(new Array())

/** @type {Writable<ChosenCharacter>} */
export const chosenCharacter = writable(new Object())

/** @type {Writable<DropZoneInfo[]>} */
export const selectedDropZones = writable(new Array())

/** @type {Writable<SelectedHeader>} */
export const selectedHeader = writable(new Object())

export const canEdit = writable(true)
