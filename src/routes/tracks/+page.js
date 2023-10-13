// import {  } from "$lib/TableObjects";

import { newTableObj } from '../../lib/TableObjects/Table'

/** @type {import('./$types').PageLoad} */
export async function load() {
	// CREATE THE OBJECTS FOR data
	const table = newTableObj()

	return { table }
}
