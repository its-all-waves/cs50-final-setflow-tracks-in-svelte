//@ts-check
/** @typedef {import('@playwright/test').Locator} Locator */
/** @typedef {import('@playwright/test').Page} Page */

import { expect, test } from '@playwright/test'

import { display } from '../src/lib/util/util'

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// BATCH
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
test.describe('IS THE THING THERE ON LOAD?', () => {
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test('tracks page has expected heading', async ({ page }) => {
		await page.goto('/tracks')
		await expect(page.getByRole('heading', { name: 'Tracks' })).toBeVisible()
	})
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// BATCH
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
test.describe('SELECTING DROP ZONES', () => {
	const SCENE_A = '33-A'
	const SCENE_B = '66-B'
	const TRACK_A = 'Track_3'
	const TRACK_B = 'Track_4'
	const CHARACTER = 'Né-né'

	/** @type {Locator}   */ let commitButton
	/** @type {Locator}   */ let characterPool
	/** @type {Locator}   */ let character
	/** @type {Locator}   */ let dropZoneAA
	/** @type {Locator}   */ let dropZoneBB
	/** @type {Locator[]} */ let allDropZones
	/** @type {Locator}   */ let headerTrackA
	/** @type {Locator}   */ let headerTrackB
	/** @type {Locator}   */ let headerSceneA
	/** @type {Locator}   */ let headerSceneB

	// get all the elements for the this batch of tests
	test.beforeEach(async ({ page }) => {
		await page.goto('/tracks')
		commitButton = page.locator('#btn-commit')
		characterPool = page.locator('.character-pool')
		character = characterPool.getByText(CHARACTER)
		dropZoneAA = page.locator(
			`[data-drop-zone][data-scene-name='${SCENE_A}'][data-track-name='${TRACK_A}']`
		)
		dropZoneBB = page.locator(
			`[data-drop-zone][data-scene-name='${SCENE_B}'][data-track-name='${TRACK_B}']`
		)
		allDropZones = await page.locator(`[data-drop-zone]`).all()
		headerTrackA = page.locator(`[data-track-header="${TRACK_A}"]`)
		headerTrackB = page.locator(`[data-track-header="${TRACK_B}"]`)
		headerSceneA = page.locator(`[data-scene-header="${SCENE_A}"]`)
		headerSceneB = page.locator(`[data-scene-header="${SCENE_B}"]`)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test(`can add "${CHARACTER}" to "${SCENE_A}" > "${TRACK_A}"`, async ({ page }) => {
		// pick up a character and put it in dropZone
		await character.click()
		await dropZoneAA.click()
		await commitButton.click()

		// check that dropZone contains CHARACTER
		const characterInDropZone = dropZoneAA.locator('.character')
		const innerText = await characterInDropZone.innerText()
		expect(innerText).toBe(CHARACTER)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test(`a selected drop zone deselects when grabbing a dupl character from pool`, async ({
		page
	}) => {
		const TRACK = TRACK_A
		const dropZone = dropZoneAA

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
		let selectedDropZones = await arrayOfSelectedDropZones(page)
		await expect_locators_have_attribute_value(selectedDropZones, `data-track-name`, TRACK)

		// grab the same character from the pool
		await character.click()

		// FINAL ASSERTS: all on TRACK are selected except dropZone
		// all the selected dropZones are on TRACK and don't include dropZone
		const selectedDropZonesOnTrack = await page
			.locator(`[data-drop-zone][data-track-name="${TRACK}"].selected`)
			.all()

		// assert: only dropZones on TRACK are selected
		await expect_locators_have_attribute_value(
			selectedDropZonesOnTrack,
			`data-track-name`,
			TRACK
		)

		// assert: dropZone not selected
		await expect(dropZone).not.toHaveClass(/\bselected\b/)

		// assert: all selected drop zones on track (excl dropZone) are selected
		for (let _dropZone of selectedDropZonesOnTrack) {
			if (_dropZone === dropZone) continue
			await expect(_dropZone).toHaveClass(/\bselected\b/)
		}
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test('clicking a track header twice selects then deselects it', async ({ page }) => {
		const TRACK = TRACK_A
		const headerTrack = headerTrackA

		// select TRACK header
		await headerTrack.click()

		// get all selected drop zones
		let selectedDropZones = await arrayOfSelectedDropZones(page)

		// assert: there are selected drop zones
		expect(selectedDropZones.length).toBeGreaterThan(0)

		// assert: every selected drop zone is on TRACK
		await expect_locators_have_attribute_value(selectedDropZones, `data-track-name`, TRACK)

		// click the track header again to clear the selection
		await headerTrack.click()

		// assert: all dropZones are deselected
		selectedDropZones = await arrayOfSelectedDropZones(page)
		expect(selectedDropZones).toHaveLength(0)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test('clicking 2 track headers selects 1st then 2nd', async ({ page }) => {
		// select TRACK header
		await headerTrackA.click()

		// get all selected drop zones to assert that only TRACK A is selected
		let selectedDropZones = await arrayOfSelectedDropZones(page)

		// assert: there are selected drop zones
		expect(selectedDropZones.length).toBeGreaterThan(0)

		// assert: every selected drop zone is on TRACK A
		await expect_locators_have_attribute_value(selectedDropZones, `data-track-name`, TRACK_A)

		// click the track header again to clear the selection
		await headerTrackB.click()

		// get all selected drop zones to assert that only TRACK B is selected
		selectedDropZones = await arrayOfSelectedDropZones(page)

		// assert: there are selected drop zones
		expect(selectedDropZones.length).toBeGreaterThan(0)

		// assert: every selected drop zone is on TRACK B
		await expect_locators_have_attribute_value(selectedDropZones, `data-track-name`, TRACK_B)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test('clicking a scene with no char in hand selects nothing', async ({ page }) => {
		await headerSceneA.click()

		// assert: no drop zones are selected
		let selectedDropZones = page.locator(`[data-drop-zone].selected`)
		await expect(selectedDropZones).toHaveCount(0)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test('track selection replaces scene selection & vice versa', async ({ page }) => {
		// note: a scene must contain at least one character to be selected

		// put character in each drop zone (thus each scene)
		await character.click()
		// assert: character is selected
		await expect(character).toHaveClass(/\binHand\b/)

		await dropZoneAA.click()
		// assert: drop zone is selected
		await expect(dropZoneAA).toHaveClass(/\bselected\b/)

		await dropZoneBB.click()
		// assert: drop zone is selected
		await expect(dropZoneBB).toHaveClass(/\bselected\b/)

		await commitButton.click()

		// select scene, select track
		await headerSceneA.click()

		// assert: scene is selected
		let selectedDropZones = await arrayOfSelectedDropZones(page)
		await expect_locators_have_attribute_value(selectedDropZones, `data-scene-name`, SCENE_A)

		await headerTrackA.click()

		// assert: only TRACK A is selected
		selectedDropZones = await arrayOfSelectedDropZones(page)
		await expect_locators_have_attribute_value(selectedDropZones, `data-track-name`, TRACK_A)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test('click 2 drop zones in the same scene and only the last clicked is selected', async ({
		page
	}) => {
		await dropZoneAA.click()

		const dropZoneAB = page.locator(
			`[data-drop-zone][data-scene-name="${SCENE_A}"][data-track-name="${TRACK_B}"]`
		)
		await dropZoneAB.click()

		// assert: only drop zone AB is selected
		let selectedDropZones = await arrayOfSelectedDropZones(page)
		expect(selectedDropZones).toHaveLength(1)
		await expect_locators_have_attribute_value(selectedDropZones, `data-scene-name`, SCENE_A)
		await expect_locators_have_attribute_value(selectedDropZones, `data-track-name`, TRACK_B)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test('clicking the same drop zone twice selects then deselects it', async ({ page }) => {
		await dropZoneAA.click()
		await expect(dropZoneAA).toHaveClass(/\bselected\b/)

		await dropZoneAA.click()
		await expect(dropZoneAA).not.toHaveClass(/\bselected\b/)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test('clicking only once selects a scene after character in hand is clicked', async ({
		page
	}) => {
		/* ADDRESSES BUG: 
	repro:
		- put a character in a drop zone
		- click the character to select it
		- click drop zone's scene's header (nothing should select)
		- click the character again to deselect
		- click the drop zone's scene's header again to select the scene
	behavior:
		- scene header must be clicked twice to be selected
	*/

		// put a character in the drop zone
		await character.click()
		await dropZoneAA.click()
		await commitButton.click()

		// assert: character is in drop zone
		const characterInTable = dropZoneAA.getByText(CHARACTER)
		expect(await characterInTable.count()).toBe(1)

		// click the character
		await character.click()
		// assert: character in table is selected
		await expect(character).toHaveClass(/\binHand\b/)

		// click drop zone's scene's header
		await headerSceneA.click()

		// click character in table [again] OR character [in pool]
		await character.click()

		// ASSERT: drop zone's scene's header need only be clicked once to be selected
		await headerSceneA.click()
		let selectedDropZones = await arrayOfSelectedDropZones(page)

		// assert: all selected drop zones are in selected scene & no others selected
		// if we have one selection per track, and all on selected scene, success!
		const trackCount = await page.locator(`[data-track-header]`).count()
		expect(selectedDropZones).toHaveLength(trackCount)
		await expect_locators_have_attribute_value(selectedDropZones, `data-scene-name`, SCENE_A)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST - WILL FAIL UNTIL BUG IS FIXED
	test('EXPECT FAIL: clicking drop zone with track selected does not replace entire selection', async ({
		page
	}) => {
		/* ADDRESSES BUG:
		repro:
			click a track to select it
			click a drop zone not on selected track to select it

		behavior:
			entire selection is replaced with clicked drop zone

		assert:
		  the only change to selected drop zones is in the selected drop zone with
		  the scene of drop zone BB
		*/

		// note: trackA = Track 3 // dropZoneBB = 66-B : Track 4 = scene B : trackB
		await headerTrackA.click()
		// for clarity...
		const selectedTrack = TRACK_A

		// ASSERT: all of track A is selected and only track A is selected
		const sceneCount = await page.locator('[data-scene-header]').count()
		let selectedDropZones = await arrayOfSelectedDropZones(page)
		// assert: there should be sceneCount drop zones selected
		expect(selectedDropZones).toHaveLength(sceneCount)
		await expect_locators_have_attribute_value(selectedDropZones, `data-track-name`, TRACK_A)

		await dropZoneBB.click()
		// for clarity, clickedDropZone = dropZoneBB &...
		const sceneOfClickedDropZone = SCENE_B
		const trackOfClickedDropZone = TRACK_B

		// ASSERT: only the selection in the clicked drop zone's scene changed,
		// and it changed to the clicked dropZone
		// assert: still sceneCount selected drop zones
		selectedDropZones = await arrayOfSelectedDropZones(page)
		expect(selectedDropZones).toHaveLength(sceneCount)
		// expect(selectedDropZones).toHaveLength(1) // DEBUG: this will allow test to pass

		// if a selected `dz`s scene matches that of the clicked drop zone,
		// assert: the dz's track matches that of the clicked drop zone
		// else assert: the dz's track matches that of the selected track (trackA)
		for (let selectedDz of selectedDropZones) {
			const selectedDzScene = await selectedDz.getAttribute(`data-scene-name`)
			const selectedDzTrack = await selectedDz.getAttribute(`data-track-name`)
			if (selectedDzScene === sceneOfClickedDropZone) {
				expect(selectedDzTrack === trackOfClickedDropZone)
				continue
			}
			// looking at the rest of the scenes/columns
			expect(selectedDzTrack === selectedTrack)
		}
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test(`clicking 2 drop zones in diff scenes doesn't prevent deselecting a selected drop zone`, async ({
		page
	}) => {
		/* ADDRESS BUG:
		repro:
			click a drop zone to select it
			click another in a different scene to select it
			click one of the selected drop zones

		behavior:
			drop zone is not deselected
		
		assert:
			drop zone is deselected
		*/

		await dropZoneAA.click()
		await dropZoneBB.click()
		await dropZoneBB.click()

		// assert: drop zone BB is not selected
		await expect(dropZoneBB).not.toHaveClass(/\bselected\b/)
	})

	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST - FAILS WHILE BUG
	test('clicking selected character in table toggles .chosen class', async ({ page }) => {
		// add a character to the table
		await character.click()
		await dropZoneAA.click()
		await commitButton.click()

		// click the new character in the table
		const characterInTable = page.locator(`[data-drop-zone]`).getByText(CHARACTER)
		await expect(characterInTable).toHaveCount(1)
		await characterInTable.click()

		// expect .chosen class
		await expect(characterInTable).toHaveClass(/\bchosen\b/)
		await expect(characterInTable).toHaveClass(/\binHand\b/)

		// SHOULD PASS UP TO HERE

		// click the character in the table again
		await characterInTable.click()

		// ASSERT: no .chosen class (and yes .inHand class)
		await expect(characterInTable).toHaveClass(/\binHand\b/)
		await expect(characterInTable).not.toHaveClass(/\bchosen\b/)

		// SHOULD FAIL AFTER THIS POINT

		// assert: no characters in table (or pool) have .chosen class
		const allCharactersInTableAndPool = await page.locator(`.character`).all()
		for (let character of allCharactersInTableAndPool) {
			expect(character).not.toHaveClass(/\bchosen\b/)
		}
	})
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// HELPERS

/** @param {Page} page*/
async function arrayOfSelectedDropZones(page) {
	return await page.locator(`[data-drop-zone].selected`).all()
}

/**
 * @param {Locator[]} locArray
 * @param {string} attr
 * @param {string} val
 */
async function expect_locators_have_attribute_value(locArray, attr, val) {
	for (let locator of locArray) {
		await expect(locator).toHaveAttribute(attr, val)
	}
}
