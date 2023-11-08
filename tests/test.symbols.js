//@ts-check
/** @typedef {import('@playwright/test').Locator} Locator */
/** @typedef {import('@playwright/test').Page} Page */

import { test } from '@playwright/test'

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SETUP TESTS
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const SCENE_A = '33-A'
export const SCENE_B = '66-B'
export const TRACK_A = 'Track_3'
export const TRACK_B = 'Track_4'
export const CHARACTER = 'Né-né'

// html elements, dependent on constants above
/** @type {Locator}   */ export let commitButton
/** @type {Locator}   */ export let characterPool
/** @type {Locator}   */ export let dropZoneAA
/** @type {Locator}   */ export let dropZoneBB
/** @type {Locator}   */ export let headerSceneA
/** @type {Locator}   */ export let headerSceneB
/** @type {Locator}   */ export let headerTrackA
/** @type {Locator}   */ export let headerTrackB
/** @type {Locator}   */ export let character

// get all the elements for whoever imports me
test.beforeEach(async ({ page }) => {
	await page.goto('/tracks')

	commitButton = page.locator('#btn-commit')
	characterPool = page.locator('.character-pool')
	character = characterPool.getByText(CHARACTER)
	dropZoneAA = page.locator(
		`[data-drop-zone][data-scene-name="${SCENE_A}"][data-track-name="${TRACK_A}"]`
	)
	dropZoneBB = page.locator(
		`[data-drop-zone][data-scene-name="${SCENE_B}"][data-track-name="${TRACK_B}"]`
	)
	headerTrackA = page.locator(`[data-track-header="${TRACK_A}"]`)
	headerTrackB = page.locator(`[data-track-header="${TRACK_B}"]`)
	headerSceneA = page.locator(`[data-scene-header="${SCENE_A}"]`)
	headerSceneB = page.locator(`[data-scene-header="${SCENE_B}"]`)
})
