// import {  } from "$lib/TableObjects";

import { newTableObj } from '../../lib/TableObjects/Table'

import { state } from './state'

/** @type {import('./$types').PageLoad} */
export async function load() {
	return { state }
}
