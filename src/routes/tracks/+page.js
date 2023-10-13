// import {  } from "$lib/TableObjects";

import { newTableObj } from '../../lib/TableObjects/Table'

/** @type {import('./$types').PageLoad} */
export async function load() {
	// create the objects / arrays for data
	const table = newTableObj()

	return { table }
}
