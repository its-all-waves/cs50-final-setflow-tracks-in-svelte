/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		// command: 'npm run dev',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	// reporter: [['list'], ['json', { outputFile: 'test-results.json' }]]
	use: {
		headless: true
	}
}

export default config
