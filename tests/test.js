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

	/** @type {Locator}   */ let commitButton
	/** @type {Locator}   */ let characterPool
	/** @type {Locator}   */ let character
	/** @type {Locator}   */ let dropZoneA, dropZoneB
	/** @type {Locator[]} */ let allDropZones
	/** @type {Locator}   */ let headerTrackA, headerTrackB

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
		headerTrackA = page.locator(`[data-track-row="${TRACK_A}"] th`).getByText(display(TRACK_A))
		headerTrackB = page.locator(`[data-track-row="${TRACK_B}"] th`).getByText(display(TRACK_B))
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
		await headerTrackA.click()

		// assert: only dropZones on TRACK are selected
		let selectedDropZones = await page.locator(`[data-drop-zone].selected`).all()
		for (let _dropZone of selectedDropZones) {
			await expect(_dropZone).toHaveAttribute('data-track-name', TRACK)
		}

		// grab the same character from the pool
		await character.click()

		// FINAL ASSERTS: all on TRACK are selected except dropZone
		// all the selected dropZones are on TRACK and don't include dropZone
		const selectedDropZonesOnTrack = await page
			.locator(`[data-track-row] [data-drop-zone][data-track-name="${TRACK}"].selected`)
			.all()

		// assert: only dropZones on TRACK are selected
		for (let _dropZone of selectedDropZonesOnTrack) {
			expect(_dropZone).toHaveAttribute(`data-track-name`, TRACK)
		}

		// assert: dropZone not selected
		await expect(dropZone).not.toHaveClass(/\bselected\b/)

		// assert: all selected drop zones on track (excl dropZone) are selected
		for (let _dropZone of selectedDropZonesOnTrack) {
			if (_dropZone === dropZone) continue
			await expect(_dropZone).toHaveClass(/\bselected\b/)
		}
	})

	test('clicking a track header twice selects then deselects it', async ({ page }) => {
		const TRACK = TRACK_A
		const headerTrack = headerTrackA

		// select TRACK header
		await headerTrack.click()

		// get all selected drop zones
		let selectedDropZones = await page.locator(`[data-drop-zone].selected`).all()

		// assert: there are selected drop zones
		expect(selectedDropZones.length).toBeGreaterThan(0)

		// assert: every selected drop zone is on TRACK
		for (let _dropZone of selectedDropZones) {
			await expect(_dropZone).toHaveAttribute(`data-track-name`, TRACK)
		}

		// click the track header again to clear the selection
		await headerTrack.click()

		// assert: all dropZones are deselected
		selectedDropZones = await page.locator(`[data-drop-zone].selected`).all()
		expect(selectedDropZones).toHaveLength(0)
	})

	test('clicking 2 track headers selects 1st then 2nd', async ({ page }) => {
		// select TRACK header
		await headerTrackA.click()

		// get all selected drop zones to assert that only TRACK A is selected
		let selectedDropZones = await page.locator(`[data-drop-zone].selected`).all()

		// assert: there are selected drop zones
		expect(selectedDropZones.length).toBeGreaterThan(0)

		// assert: every selected drop zone is on TRACK A
		for (let _dropZone of selectedDropZones) {
			await expect(_dropZone).toHaveAttribute(`data-track-name`, TRACK_A)
		}

		// click the track header again to clear the selection
		await headerTrackB.click()

		// get all selected drop zones to assert that only TRACK B is selected
		selectedDropZones = await page.locator(`[data-drop-zone].selected`).all()

		// assert: there are selected drop zones
		expect(selectedDropZones.length).toBeGreaterThan(0)

		// assert: every selected drop zone is on TRACK B
		for (let _dropZone of selectedDropZones) {
			await expect(_dropZone).toHaveAttribute(`data-track-name`, TRACK_B)
		}
	})
})
