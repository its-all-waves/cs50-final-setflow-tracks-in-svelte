// @ts-check
/**
 * @template T
 * @typedef {import('svelte/store').Writable<T>} Writable<T> */
/** @typedef {import('../../lib/types').DropZoneInfo} DropZoneInfo */
/** @typedef {import('../../lib/types').CharacterInHand} CharacterInHand */
/** @typedef {import('../../lib/types').ChosenCharacter} ChosenCharacter */
/** @typedef {import('../../lib/types').SelectedHeader} SelectedHeader */
/** @typedef {import('../../lib/types').Table} Table */

import { writable } from 'svelte/store'

import { _state } from './state'

export const state = writable(_state)
