//@ts-check
/** @typedef {import('@playwright/test').Locator} Locator */
/** @typedef {import('@playwright/test').Page} Page */

import { test, expect } from '@playwright/test'

import {
	SCENE_A,
	SCENE_B,
	TRACK_A,
	TRACK_B,
	CHARACTER_A,
	CHARACTER_B,
	CHARACTER_C,
	commitButton,
	deleteButton,
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
		await placeIn(dropZoneAA, characterA)

		// assert: only one character in table
		const characterInTable = page.locator(`[data-drop-zone] .character`)
		expect(await characterInTable.all()).toHaveLength(1)

		// click the character in the table to select it
		await characterInTable.click()

		// assert: has .chosen class
		await expect(characterInTable).toHaveClass(/\s*chosen\s*/)

		// delete
		await deleteButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: deleteCharacterInstancesFromTable()
	test('can delete all instances of a character from the table (not pool)', async ({ page }) => {
		// put a character in a drop zone
		await placeIn(dropZoneAA, characterA)

		// put the same character in another drop zone
		await placeIn(dropZoneBB, characterA)

		// click either one to 'chosen' it, then again to 'unchosen' it
		const characterInTable = dropZoneBB.locator(`.character`)
		await characterInTable.click()
		await characterInTable.click()

		// delete
		await deleteButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: deleteCharacterInHandEverywhere()
	test('can delete a character from everywhere', async ({ page }) => {
		// put a character in a drop zone
		await placeIn(dropZoneAA, characterA)

		// put the same character in another drop zone
		await placeIn(dropZoneBB, characterA)

		// select the character from the pool (put in inHand)
		await characterA.click()

		// delete
		await deleteButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: clearSelectedDropZones()
	test('can clear all characters from a selected drop zone', async ({ page }) => {
		// place two characters in the same drop zone
		await placeIn(dropZoneAA, characterA)
		await placeIn(dropZoneAA, characterB)

		// assert: there are two characters in the drop zone
		const allCharactersInTheDropZone = await dropZoneAA.locator(`.character`).all()
		expect(allCharactersInTheDropZone).toHaveLength(2)

		// select the drop zone
		await dropZoneAA.click()

		// delete
		await deleteButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: clearTrack()
	test('can clear the contents of a whole track', async ({ page }) => {
		// put a character on a track across all scenes
		await placeIn(headerTrackA, characterA)

		// add a 2nd character to one of the scenes on the same track (AA = scA trA)
		await placeIn(dropZoneAA, characterB)

		// assert: there are 3 characters on track
		const charactersInTrack = await page
			.locator(`[data-track-name="${TRACK_A}"] .character`)
			.all()
		expect(charactersInTrack).toHaveLength(3)

		// select the track, delete
		await headerTrackA.click()
		await deleteButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST: clearScene()
	test('can clear the contents of a whole scene', async ({ page }) => {
		// put character in scene
		await placeIn(dropZoneAA, characterA)

		// put another character in the same scene on a different track
		await placeIn(dropZoneAB, characterB)

		// put another character in the same drop zone
		await placeIn(dropZoneAB, characterC)

		// assert: 3 characters in selected scene
		const characterInScene = page.locator(`[data-scene-name="${SCENE_A}"] .character`)
		await expect(characterInScene).toHaveCount(3)

		// select scene header, delete
		await headerSceneA.click()
		await deleteButton.click()

		// ASSERT:
		await expect_empty_table(page)
	})
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// TEST: clearTable()
test('can clear the entire table', async ({ page }) => {
	// randomly place characters in the table
	await placeIn(dropZoneAA, characterA)
	await placeIn(dropZoneAB, characterB)
	await placeIn(dropZoneAB, characterC)
	await placeIn(dropZoneBA, characterC)

	// assert the table has so many characters
	const characterInTable = page.locator(`[data-main-table] .character`)
	await expect(characterInTable).toHaveCount(4)

	// delete
	await deleteButton.click()

	// ASSERT:
	await expect_empty_table(page)
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HELPERS
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * @returns {Promise<void>}
 * @param {Locator} destinationToClick
 * @param {Locator} character \
 * `location = dropZone | headerTrack | headerScene` */
async function placeIn(destinationToClick, character) {
	await character.click()
	await destinationToClick.click()
	await commitButton.click()
}

/**
 * @returns {Promise<void>}
 * @param {Page} page */
async function expect_empty_table(page) {
	expect(await page.locator(`[data-main-table] .character`).all()).toHaveLength(0)
}
