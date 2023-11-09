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
	characterPool,
	commitButton,
	deleteButton,
	headerSceneA,
	headerSceneB,
	headerTrackA,
	headerTrackB,
	dropZoneAA,
	dropZoneBB,
	characterA,
	characterB
} from './test.symbols.js'

test.describe(`DELETE BUTTON`, () => {
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test(`can delete selected character from a scene`, async ({ page }) => {
		// put a character in the table
		await characterA.click()
		await dropZoneAA.click()
		await commitButton.click()

		// assert: only one character in table
		const characterInTable = page.locator(`[data-drop-zone] .character`)
		expect(await characterInTable.all()).toHaveLength(1)

		// click the character in the table to select it
		await characterInTable.click()

		// assert: has .chosen class
		await expect(characterInTable).toHaveClass(/\s*chosen\s*/)

		// delete
		await deleteButton.click()

		// ASSERT: no more characters in the table
		expect(await characterInTable.all()).toHaveLength(0)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test('can clear all characters from a selected drop zone', async ({ page }) => {
		// put a character in the table
		await characterA.click()
		await dropZoneAA.click()
		await commitButton.click()

		// put another character in the same drop zone
		await characterB.click()
		await dropZoneAA.click()
		await commitButton.click()

		// assert: there are two characters in the drop zone
		const allCharactersInTheDropZone = await dropZoneAA.locator(`.character`).all()
		expect(allCharactersInTheDropZone).toHaveLength(2)

		// select the drop zone
		await dropZoneAA.click()

		// delete
		await deleteButton.click()

		// ASSERT: no more characters in the table
		expect(await page.locator(`[data-main-table] .character`).all()).toHaveLength(0)
	})

	test('', async ({ page }) => {})
})
