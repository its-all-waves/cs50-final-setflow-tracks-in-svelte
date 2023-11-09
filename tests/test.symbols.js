//@ts-check
/** @typedef {import('@playwright/test').Locator} Locator */
/** @typedef {import('@playwright/test').Page} Page */

import { test } from '@playwright/test'

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SETUP TESTS
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const SCENE_A = '33-A' // scene 1
export const SCENE_B = '66-B' // scene 2
export const TRACK_A = 'Track_1'
export const TRACK_B = 'Track_2'
export const CHARACTER_A = 'Né-né'
export const CHARACTER_B = 'Zina'

// html elements, dependent on constants above
/** @type {Locator}   */ export let commitButton
/** @type {Locator}   */ export let deleteButton

/** @type {Locator}   */ export let characterPool
/** @type {Locator}   */ export let characterA
/** @type {Locator}   */ export let characterB

/** @type {Locator}   */ export let headerSceneA
/** @type {Locator}   */ export let headerSceneB

/** @type {Locator}   */ export let headerTrackA
/** @type {Locator}   */ export let headerTrackB

/** @type {Locator}   */ export let dropZoneAA
/** @type {Locator}   */ export let dropZoneAB
/** @type {Locator}   */ export let dropZoneBA
/** @type {Locator}   */ export let dropZoneBB

// get all the elements for whoever imports me
test.beforeEach(async ({ page }) => {
	await page.goto('/tracks')

	commitButton = page.locator('#btn-commit')
	deleteButton = page.locator('#btn-delete')

	characterPool = page.locator('.character-pool')
	characterA = characterPool.getByText(CHARACTER_A)
	characterB = characterPool.getByText(CHARACTER_B)

	headerTrackA = page.locator(`[data-track-header="${TRACK_A}"]`)
	headerTrackB = page.locator(`[data-track-header="${TRACK_B}"]`)

	headerSceneA = page.locator(`[data-scene-header="${SCENE_A}"]`)
	headerSceneB = page.locator(`[data-scene-header="${SCENE_B}"]`)

	dropZoneAA = page.locator(
		`[data-drop-zone][data-scene-name="${SCENE_A}"][data-track-name="${TRACK_A}"]`
	)
	dropZoneAB = page.locator(
		`[data-drop-zone][data-scene-name="${SCENE_A}"][data-track-name="${TRACK_B}"]`
	)
	dropZoneBA = page.locator(
		`[data-drop-zone][data-scene-name="${SCENE_B}"][data-track-name="${TRACK_A}"]`
	)
	dropZoneBB = page.locator(
		`[data-drop-zone][data-scene-name="${SCENE_B}"][data-track-name="${TRACK_B}"]`
	)
})
