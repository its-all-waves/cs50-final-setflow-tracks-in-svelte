import { writable } from 'svelte/store'

export const table = writable({}) // object? // set in +page.svelte

export const characterInHand = writable(null) // string?

export const selectedDropZones = writable(/** @type {DropZoneInfo[]} */ [])

export const canEdit = writable(true)

export const lastClickedCharacter = writable({}) // string?
