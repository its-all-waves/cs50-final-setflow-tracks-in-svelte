//@ts-check
/** @typedef {import('@playwright/test').Locator} Locator */
/** @typedef {import('@playwright/test').Page} Page */

import { expect, test } from '@playwright/test'

test.describe('DOES THE THING LOAD?', () => {
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// TEST
	test('tracks page has expected heading', async ({ page }) => {
		await page.goto('/tracks')
		await expect(page.getByRole('heading', { name: 'Tracks' })).toBeVisible()
	})
})
