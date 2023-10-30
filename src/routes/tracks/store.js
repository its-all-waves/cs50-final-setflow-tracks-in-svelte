import { writable } from 'svelte/store'

export const table = writable({}) // object? // set in +page.svelte

export const characterInHand = writable({}) // { name, location }

export const selectedDropZones = writable(/** @type {DropZoneInfo[]} */ [])

export const canEdit = writable(true)

export const selectedHeader = writable({})
