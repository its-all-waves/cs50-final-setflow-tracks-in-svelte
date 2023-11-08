//@ts-check
/** @typedef {import('@playwright/test').Locator} Locator */
/** @typedef {import('@playwright/test').Page} Page */

import { test, expect } from '@playwright/test'

import {
	SCENE_A,
	SCENE_B,
	TRACK_A,
	TRACK_B,
	CHARACTER,
	characterPool,
	commitButton,
	headerSceneA,
	headerSceneB,
	headerTrackA,
	headerTrackB,
	dropZoneAA,
	dropZoneBB,
	character
} from './test.symbols.js'

test.describe(`DELETE BUTTON`, () => {
	test(`can delete a character by selecting it first`, async ({ page }) => {})
})
