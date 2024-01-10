//@ts-check
/** @typedef {import('@playwright/test').Locator} Locator */
/** @typedef {import('@playwright/test').Page} Page */

import { test, expect } from '@playwright/test'

// enums to keep names consistent
import { State, Test } from '../src/routes/tracks/machine'

import {
	// page,
	commitButton,
	deleteButton,
	clearButton,
	characterPool,
	characterA,
	characterB,
	headerSceneA,
	headerSceneB,
	headerTrackA,
	headerTrackB,
	dropZoneAA,
	dropZoneAB,
	dropZoneBB,
	dropZoneBA,
	characterC
} from './test.symbols.js'

test.describe(`ALL DELETE BUTTON FUNCTIONS`, () => {
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: deleteChosenCharacterFromScene()
	test(`can delete selected character from a scene`, async ({ page }) => {
		await placeIn(page, dropZoneAA, characterA)

		// assert: only one character in table
		const characterInTable = page.locator(`[data-drop-zone] .character`)
		expect(await characterInTable.all()).toHaveLength(1)

		// click the character in the table to select it
		await characterInTable.click()

		// assert: has .selected class
		await expect(characterInTable).toHaveClass(/\s*selected\s*/)

		// delete
		await deleteButton.click()

		// confirm delete / click Clear button in dialog
		await clearButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: deleteCharacterInstancesFromTable()
	test('can delete all instances of a character from the table (not pool)', async ({ page }) => {
		// put a character in a drop zone
		await placeIn(page, dropZoneAA, characterA)

		// put the same character in another drop zone
		await placeIn(page, dropZoneBB, characterA)

		// click either one to '.selected' it, then again to de-'.selected' it
		const characterInTable = dropZoneBB.locator(`.character`)
		await characterInTable.click()
		await characterInTable.click()

		// delete
		await deleteButton.click()
		await clearButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: deleteCharacterInHandEverywhere()
	test('can delete a character from everywhere', async ({ page }) => {
		// put a character in a drop zone
		await placeIn(page, dropZoneAA, characterA)

		// put the same character in another drop zone
		await placeIn(page, dropZoneBB, characterA)

		// select the character from the pool (put in inHand)
		await characterA.click()

		// delete
		await deleteButton.click()
		await clearButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: clearSelectedDropZones()
	test('can clear all characters from a selected drop zone', async ({ page }) => {
		// place two characters in the same drop zone
		await placeIn(page, dropZoneAA, characterA)
		await placeIn(page, dropZoneAA, characterB)

		// assert: there are two characters in the drop zone
		const allCharactersInTheDropZone = await dropZoneAA.locator(`.character`).all()
		expect(allCharactersInTheDropZone).toHaveLength(2)

		// select the drop zone
		await dropZoneAA.click()

		// delete
		await deleteButton.click()
		await clearButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: clearTrack()
	test('can clear the contents of a whole track', async ({ page }) => {
		// put a character on a track across all scenes
		await placeIn(page, headerTrackA, characterA)

		// add a 2nd character to one of the scenes on the same track (AA = scA trA)
		await placeIn(page, dropZoneAA, characterB)

		// assert: there are 3 characters on track
		const charactersInTrack = await page
			.locator(`[data-track-name="${Test.track_1}"] .character`)
			.all()
		expect(charactersInTrack).toHaveLength(3)

		// select the track, delete
		await headerTrackA.click()
		await deleteButton.click()
		await clearButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: clearScene()
	test('can clear the contents of a whole scene', async ({ page }) => {
		// put character in scene
		await placeIn(page, dropZoneAA, characterA)

		// put another character in the same scene on a different track
		await placeIn(page, dropZoneAB, characterB)

		// put another character in the same drop zone
		await placeIn(page, dropZoneAB, characterC)

		// assert: 3 characters in selected scene
		const characterInScene = page.locator(`[data-scene-name="${Test.scene_33_A}"] .character`)
		await expect(characterInScene).toHaveCount(3)

		// select scene header, delete
		await headerSceneA.click()
		await deleteButton.click()
		await clearButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: clearTable()
	test('can clear the entire table', async ({ page }) => {
		// randomly place characters in the table
		await placeIn(page, dropZoneAA, characterA)
		await placeIn(page, dropZoneAB, characterB)
		await placeIn(page, dropZoneAB, characterC)
		await placeIn(page, dropZoneBA, characterC)

		// assert the table has so many characters
		const characterInTable = page.locator(`[data-main-table] .character`)
		await expect(characterInTable).toHaveCount(4)

		// delete
		await deleteButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HELPERS
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * @returns {Promise<void>}
 * @param {Locator} destination
 * @param {Locator} character \
 * `location = dropZone | headerTrack | headerScene` */
async function placeIn(page, destination, character) {
	await character.click()
	await destination.click()
	await commitButton.click()
}

/**
 * @returns {Promise<void>}
 * @param {Page} page */
async function expect_empty_table(page) {
	expect(await page.locator(`[data-main-table] .character`).all()).toHaveLength(0)
}

/* 

been dealing with a stange issue in some e2e playwright tests. 

my app involves dragging characters from a pool into drop zones. you can place multiple characters in a dropzone. not using any standard drag n drop api. using svelte kit with no libs.

when you have selected a character to place in a drop zone, a commit button appears. if no character is selected, the commit button is hidden. if you click on a character that's already in a drop zone, any characters selected from the pool become unselected, thus hiding the commit button. you can add multiple characters to a single drop zone, as does occur in some of my tests.

the testing issue im having is when placeIn() is called *more than once*, i get a failure. i might have a clue...  clicking any character in any drop zone deselects the character in the pool that is poised to be commited into a selected drop zone. my thinking is that the first placeIn() call works, but then the 2nd one fails if it's clicking in the same drop zone the first placement ocurred in because its not really clicking the drop zone -- its clikcing the character inside of it, thus deselecting the character in the pool and hiding the commit button. i keep seeing the error that playwright cannot find the commit button.

placeIn() clicks a character from the pool, clicks the intended drop zone, then clicks the commit button.

async function placeIn(destination, character) {
	await character.click()
	await destination.click()
	await commitButton.click()
}

how can i force playwright to click the actual dropzone, not just somewhere in the drop zone (which coincides with the character it contains), as it seems like this is what's happening?

*/
