// const Scene = {
// 	id: null,
// 	name: null,
// 	actors: [],
// 	columnElem: null
// }

import { nanoid, NANO_ID_LENGTH } from '../util/util'

export function newScene(name) {
	const id = nanoid(NANO_ID_LENGTH)
	const actors = []
	const columnElem = null

	return {
		id,
		name,
		actors,
		columnElem
	}
}
