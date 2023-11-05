//@ts-check
/** @typedef {import('@playwright/test').Locator} Locator */

import { expect, test } from '@playwright/test'

import { display } from '../src/lib/util/util'

test('tracks page has expected heading', async ({ page }) => {
	await page.goto('/tracks')
	await expect(page.getByRole('heading', { name: 'Tracks' })).toBeVisible()
})

test.describe('selected drop zone rules', () => {
	const SCENE_A = '33-A'
	const SCENE_B = '66-B'
	const TRACK_A = 'Track_3'
	const TRACK_B = 'Track_4'
	const CHARACTER = 'Né-né'

	/** @type {Locator} */ let commitButton
	/** @type {Locator} */ let characterPool
	/** @type {Locator} */ let character
	/** @type {Locator} */ let dropZoneA, dropZoneB
	/** @type {Locator[]} */ let allDropZones

	// get all the elements for the this batch of tests
	test.beforeEach(async ({ page }) => {
		await page.goto('/tracks')
		commitButton = page.locator('#btn-commit')
		characterPool = page.locator('.character-pool')
		character = characterPool.getByText(CHARACTER)
		dropZoneA = page.locator(
			`[data-drop-zone][data-scene-name='${SCENE_A}'][data-track-name='${TRACK_A}']`
		)
		dropZoneB = page.locator(
			`[data-drop-zone][data-scene-name='${SCENE_B}'][data-track-name='${TRACK_B}']`
		)
		allDropZones = await page.locator(`[data-drop-zone]`).all()
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test(`can add "${CHARACTER}" to "${SCENE_A}" > "${TRACK_A}"`, async ({ page }) => {
		// pick up a character and put it in dropZone
		await character.click()
		await dropZoneA.click()
		await commitButton.click()

		// check that dropZone contains CHARACTER
		const characterInDropZone = dropZoneA.locator('.character')
		const innerText = await characterInDropZone.innerText()
		expect(innerText).toBe(CHARACTER)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test(`a selected drop zone deselects when grabbing a dupl character from pool`, async ({
		page
	}) => {
		const TRACK = TRACK_A
		const dropZone = dropZoneA

		// grab the character, select the dropZone
		await character.click()
		await dropZone.click()

		// assert: dropZone is selected after click
		expect(dropZone).toHaveClass(/\bselected\b/)

		// drop the character
		await commitButton.click()

		// assert: dropZone deselects after commit
		expect(dropZone).not.toHaveClass(/\bselected\b/)

		// assert: character landed in the dropZone
		const characterInDropZone = dropZone.locator('.character')
		const innerText = await characterInDropZone.innerText()
		expect(innerText).toBe(CHARACTER)

		// select all dropZones on a track
		const trackHeader = page.locator(`[data-track-row] th`).getByText(display(TRACK))
		await trackHeader.click()

		// assert: only dropZones on TRACK are selected
		let selectedDropZones = await page.locator(`[data-drop-zone].selected`).all()
		for (let _dropZone of selectedDropZones) {
			await expect(_dropZone).toHaveAttribute('data-track-name', TRACK)
		}

		// grab the same character from the pool
		await character.click()

		// FINAL ASSERT: all on TRACK are selected except dropZone
		// dropZone not selected, and...
		await expect(dropZone).not.toHaveClass(/\bselected\b/)
		// ...rest on track are selected
		selectedDropZones = await page.locator(`[data-drop-zone].selected`).all()
		for (let _dropZone of selectedDropZones) {
			await expect(_dropZone).toHaveClass(/\bselected\b/)
		}
	})
})
