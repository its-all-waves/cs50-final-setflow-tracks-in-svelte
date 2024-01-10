//@ts-check
/** @typedef {import('@playwright/test').Locator} Locator */
/** @typedef {import('@playwright/test').Page} Page */

import { test } from '@playwright/test'

import { State, Test } from '../src/routes/tracks/machine'

export { _page as page }

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// SETUP TESTS
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// html elements, dependent on constants above
/** @type {Locator} */ export let commitButton
/** @type {Locator} */ export let deleteButton
/** @type {Locator} */ export let clearButton

/** @type {Locator} */ export let characterPool
/** @type {Locator} */ export let characterA
/** @type {Locator} */ export let characterB
/** @type {Locator} */ export let characterC

/** @type {Locator} */ export let headerSceneA
/** @type {Locator} */ export let headerSceneB

/** @type {Locator} */ export let headerTrackA
/** @type {Locator} */ export let headerTrackB

/** @type {Locator} */ export let dropZoneAA
/** @type {Locator} */ export let dropZoneAB
/** @type {Locator} */ export let dropZoneBA
/** @type {Locator} */ export let dropZoneBB

let _page

// get all the elements for whoever imports me
test.beforeEach(async ({ page }) => {
	await page.goto('/tracks')

	commitButton = page.locator('#btn-commit')
	deleteButton = page.locator('#btn-delete')
	clearButton = page.locator('#btn-clear')

	characterPool = page.locator('.character-pool')
	characterA = characterPool.getByText(Test.character_NeNe)
	characterB = characterPool.getByText(Test.character_Zina)
	characterC = characterPool.getByText(Test.character_Yuki)

	headerTrackA = page.locator(`[data-track-header="${Test.track_1}"]`)
	headerTrackB = page.locator(`[data-track-header="${Test.track_2}"]`)

	headerSceneA = page.locator(`[data-scene-header="${Test.scene_33_A}"]`)
	headerSceneB = page.locator(`[data-scene-header="${Test.scene_66_B}"]`)

	dropZoneAA = page.locator(
		`[data-drop-zone][data-scene-name="${Test.scene_33_A}"][data-track-name="${Test.track_1}"]`
	)
	dropZoneAB = page.locator(
		`[data-drop-zone][data-scene-name="${Test.scene_33_A}"][data-track-name="${Test.track_2}"]`
	)
	dropZoneBA = page.locator(
		`[data-drop-zone][data-scene-name="${Test.scene_66_B}"][data-track-name="${Test.track_1}"]`
	)
	dropZoneBB = page.locator(
		`[data-drop-zone][data-scene-name="${Test.scene_66_B}"][data-track-name="${Test.track_2}"]`
	)
})
