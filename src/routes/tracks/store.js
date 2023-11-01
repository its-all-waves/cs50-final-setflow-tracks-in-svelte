import { writable } from 'svelte/store'

export const table = writable({}) // object? // set in +page.svelte

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
