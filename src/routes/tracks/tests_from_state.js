// TESTING +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// enum
const Test = Object.freeze({
	character_NeeNee: 'NeeNee',
	character_Jamz: 'Jamz',
	character_Cliff: 'Cliff',
	character_FrankieD: 'Frankie D',
	track_1: 'track 1',
	track_2: 'track 2',
	scene_44_B: '44-B',
	scene_3_A: '3-A'
})

// prep test - populate characters, tracks, scenes
function prepTest() {
	// const { characters, tracks, scenes } = state.ctx
	const { ctx } = state

	ctx.characters = {}
	ctx.tracks = {}
	ctx.scenes = {}

	for (const key in Test) {
		if (!key.startsWith('character')) continue
		const name = Test[key]
		ctx.characters[name] = { name }
	}

	for (const key in Test) {
		if (!key.startsWith('track')) continue
		const name = Test[key]
		ctx.tracks[name] = { name }
	}

	for (const key in Test) {
		if (!key.startsWith('scene')) continue
		const name = Test[key]
		ctx.scenes[name] = { name, trackList: {} }
		const { trackList } = ctx.scenes[name]
		for (const track in ctx.tracks) {
			trackList[track] = new Set()
		}
	}
}
prepTest()

// get object refs from state
const { selectedCharacters, selectedDropZones, characters, tracks, scenes } = state.ctx

const ctx = state.ctx // access primitive values from state.ctx thru this

// START TEST ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// unlock the table
console.log('initial state:', state.state)
state.dispatch(Transition.UNLOCK_TABLE)

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - pick up a character and put it down', '\n')
{
	resetForTest()

	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})

	console.log('character in hand:', ctx.characterInHand)

	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})

	console.log('character in hand:', ctx.characterInHand)
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - override character in hand by selecting character from table', '\n')
{
	resetForTest()

	// put a character in hand
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_Cliff
	})
	// select a table character (nulling characterInHand)
	state.dispatch(Transition.CLICK_TABLE_CHARACTER, {
		name: Test.character_Jamz,
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	console.log('selected characters:', selectedCharacters)
	console.log('character in hand:', ctx.characterInHand)
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - stack character selections from table', '\n')
{
	resetForTest()

	// select a table character (nulling characterInHand)
	state.dispatch(Transition.CLICK_TABLE_CHARACTER, {
		name: Test.character_Jamz,
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	// select another table character
	state.dispatch(Transition.CLICK_TABLE_CHARACTER, {
		name: Test.character_Cliff,
		scene: Test.scene_3_A,
		track: Test.track_1
	})
	// make sure 2 table characters are selected
	console.log('selected characters:', selectedCharacters)
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - put a character in a scene', '\n')
{
	resetForTest()

	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})

	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_2
	})

	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)
	// check if it worked
	logAllTableContents()
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - try putting 2 characters in one scene -- should fail', '\n')
{
	resetForTest()

	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_2
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	// check if it worked
	logAllTableContents()
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - DELETE character from scene', '\n')
{
	resetForTest()

	// check value before test
	logAllTableContents()
	// put NeeNee on table in 44-B, track 1
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)
	logAllTableContents()

	// select the character from the scene
	state.dispatch(Transition.CLICK_TABLE_CHARACTER, {
		name: Test.character_NeeNee,
		scene: Test.scene_44_B,
		track: Test.track_1
	})

	// with a table character selected, delete that instance
	state.dispatch(Transition.DELETE)

	logAllTableContents()
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - select then deselect a drop zone', '\n')
{
	resetForTest()

	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_2
	})
	console.log('drop zone is selected: ', dropZoneIsSelected(Test.scene_44_B, Test.track_2))

	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_2
	})
	console.log('drop zone is selected: ', dropZoneIsSelected(Test.scene_44_B, Test.track_2))
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log(
	'\n\t',
	'TEST - selecting another drop zone in same scene overwrites last selected in that scene',
	'\n'
)
{
	resetForTest()

	// click a drop zone
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	// see what drop zones are selected -- should be 44-B track 1
	console.log({ selectedDropZones })

	// click a drop zone in the same scene, different track
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_2
	})

	// see what drop zones are selected -- should be 44-B track 2
	console.log({ selectedDropZones })
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - can clear selected drop zones', '\n')
{
	resetForTest()

	// put 2 characters on the table
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_Jamz
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_3_A,
		track: Test.track_2
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)
	logAllTableContents()

	// select the 2 drop zones
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_3_A,
		track: Test.track_2
	})

	// clear the drop zones
	state.dispatch(Transition.DELETE)

	logAllTableContents()
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - delete character in hand everywhere', '\n')
{
	resetForTest()

	// put character on the table
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	logAllTableContents()

	// select character from pool
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})

	// delete
	state.dispatch(Transition.DELETE)

	// check that character is not in characters{} nor scenes{}
	logAllTableContents()
	console.log(`${Test.character_NeeNee} should still be in characters: `, characters)
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - lock table and be prevented from doing a thing', '\n')
{
	resetForTest()

	// put character on the table
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	// lock
	state.dispatch(Transition.LOCK_TABLE)
	state.dispatch(Transition.CLICK_POOL_CHARACTER)
	console.log(`character in hand should be null:`, ctx.characterInHand)
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - clear the table', '\n')
{
	resetForTest()

	// put character on the table
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	// put another character on the table
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_Cliff
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_3_A,
		track: Test.track_2
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	// who's on the table?
	logAllTableContents()

	// delete
	state.dispatch(Transition.DELETE)

	logAllTableContents()
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - selecting a track header selects all the drop zones on the track', '\n')
{
	resetForTest()

	const { selectedHeader, selectedDropZones } = ctx
	// click a track header
	state.dispatch(Transition.CLICK_TRACK_HEADER, { track: Test.track_1 })

	// confirm its all selected
	// console.log({ selectedHeader })
	console.log({ selectedDropZones })
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', 'TEST - deselect a selected track', '\n')
{
	resetForTest()

	const { selectedHeader, selectedDropZones } = ctx

	// click a track header
	state.dispatch(Transition.CLICK_TRACK_HEADER, { track: Test.track_1 })

	// confirm its all selected
	// console.log({ selectedHeader })
	console.log({ selectedDropZones })

	// click a track header
	state.dispatch(Transition.CLICK_TRACK_HEADER, { track: Test.track_1 })

	console.log({ selectedDropZones })
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log(
	'\n\t',
	`TEST - select track, click drop zone to alter only that scene's selection`,
	'\n'
)
{
	resetForTest()

	// select a track
	state.dispatch(Transition.CLICK_TRACK_HEADER, { track: Test.track_1 })

	console.log({ selectedHeader: ctx.selectedHeader })
	console.log({ selectedDropZones: ctx.selectedDropZones })

	// select a drop zone on a different track
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_3_A,
		track: Test.track_2
	})

	// make sure only the selected drop zone in scene 3-A was changed
	console.log({ selectedHeader: ctx.selectedHeader })
	console.log({ selectedDropZones: ctx.selectedDropZones })
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', `TEST - cannot select a scene with no characters in the scene`, '\n')
{
	resetForTest()

	state.dispatch(Transition.CLICK_SCENE_HEADER, { scene: Test.scene_3_A })

	console.log({ selectedDropZones: ctx.selectedDropZones })
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', `TEST - selecting a scene selects only the populated drop zone`, '\n')
{
	resetForTest()

	// add a character to a scene 1 on track 1
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_Cliff
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	// select the scene
	state.dispatch(Transition.CLICK_SCENE_HEADER, { scene: Test.scene_44_B })

	// is only selected drop zone at scene 1 track 1?
	console.log({ selectedDropZones: ctx.selectedDropZones })
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', `TEST - selecting a scene selects all populated drop zones`, '\n')
{
	resetForTest()

	// add a character to a scene 1 on track 1
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_Cliff
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	// add a character to a scene 1 on track 2
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_FrankieD
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_2
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	// select the scene
	state.dispatch(Transition.CLICK_SCENE_HEADER, { scene: Test.scene_44_B })

	// is only selected drop zone at scene 1 track 1?
	console.log({ selectedDropZones: ctx.selectedDropZones })
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', `TEST - a random sequence of events involving selecting a scene`, '\n')
{
	resetForTest()

	// put a character in a scene
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_NeeNee
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_44_B,
		track: Test.track_1
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	// select the scene
	state.dispatch(Transition.CLICK_SCENE_HEADER, { scene: Test.scene_44_B })

	// scene should be selected
	console.log({ selectedDropZones: ctx.selectedDropZones })

	// deselect scene
	state.dispatch(Transition.CLICK_SCENE_HEADER, { scene: Test.scene_44_B })

	// scene should be deselected
	console.log({ selectedDropZones: ctx.selectedDropZones })

	// clear table
	state.dispatch(Transition.DELETE)

	// select the same scene -- should fail
	state.dispatch(Transition.CLICK_SCENE_HEADER, { scene: Test.scene_44_B })
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', `TEST - delete a track, delete a scene`, '\n')
{
	resetForTest()

	// check current tracks
	console.log({ tracks: Object.keys(ctx.tracks) })
	// delete one
	state.dispatch(Transition.DELETE_TRACK, { track: Test.track_1 })
	// check tracks again
	console.log({ tracks: Object.keys(ctx.tracks) })

	// check current scenes
	console.log({ scenes: Object.keys(ctx.scenes) })
	// delete one
	state.dispatch(Transition.DELETE_SCENE, { scene: Test.scene_3_A })
	// check scenes again
	console.log({ scenes: Object.keys(ctx.scenes) })
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', `TEST - delete a character`, '\n')
{
	resetForTest()

	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_Jamz
	})

	console.log({ characterInHand: ctx.characterInHand })
	console.log({ characters: ctx.characters })

	state.dispatch(Transition.DELETE_CHARACTER)

	console.log({ characters: ctx.characters })
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', `TEST - cancel stuff`, '\n')
{
	resetForTest()

	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_Cliff
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_3_A,
		track: Test.track_1
	})

	state.dispatch(Transition.CANCEL)

	console.log(
		{ characterInHand: ctx.characterInHand },
		{ selectedHeader: ctx.selectedHeader },
		{ selectedCharacters: ctx.selectedCharacters },
		{ selectedDropZones: ctx.selectedDropZones }
	)
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
console.log('\n\t', `TEST - rename a character, track, scene`, '\n')
{
	resetForTest()

	// what characters are we starting with?
	console.log('characters', ctx.characters)

	// rename character
	state.dispatch(Transition.RENAME, {
		type: 'character',
		name: Test.character_Cliff,
		newName: 'Criff-san'
	})

	// check that character was renamed
	console.log('characters', ctx.characters)

	// what tracks are we starting with?
	console.log('tracks:', ctx.tracks)
	printScenes()

	// rename track
	state.dispatch(Transition.RENAME, {
		type: 'track',
		name: Test.track_1,
		newName: 'track fu'
	})

	// check that the track was renamed
	console.log('tracks:', ctx.tracks)
	printScenes()

	// put something in track fu
	state.dispatch(Transition.CLICK_POOL_CHARACTER, {
		name: Test.character_Cliff
	})
	state.dispatch(Transition.CLICK_DROP_ZONE, {
		scene: Test.scene_3_A,
		track: 'track fu'
	})
	state.dispatch(Transition.COMMIT_CHARACTER_TO_TABLE)

	// check that the character was added to the renamed scene
	console.log({ tracks: Object.keys(ctx.tracks) })
	printScenes()

	// rename scene
	state.dispatch(Transition.RENAME, {
		type: 'scene',
		name: Test.scene_3_A,
		newName: '3-Nutz'
	})

	// check that the scene was renamed
	printScenes()
}

// // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// console.log('\n\t', `TEST - what happens to scene contents when i rename something?`, '\n')
// {
//     resetForTest()
// }

console.log('       ')

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// TEST FUNCTIONS

function dropZoneIsSelected(_scene, _track) {
	if (!_scene || !_track) throw new Error('You used this function wrongly.')
	const { selectedDropZones } = ctx
	for (let dropZone of selectedDropZones) {
		const { scene, track } = dropZone
		if (scene === _scene && track === _track) {
			return true
		}
	}
	return false
}

function logAllTableContents() {
	const { scenes } = ctx
	console.log('------ contents of all scenes:')
	for (let scene in scenes) {
		console.log(`\t${scene}: `, scenes[scene].trackList)
	}
}

function logCharacters() {
	console.log(`----- characters{}`, state.characters)
}

function clearCharactersFromTable() {
	const { scenes } = ctx
	for (const scene in scenes) {
		const { trackList } = scenes[scene]
		for (const track in trackList) {
			trackList[track].clear()
		}
	}
}

function resetForTest() {
	if (state.state === State.TableLocked) state.changeStateTo(State.TableUnlocked)
	state.resetSelections()
	clearCharactersFromTable()

	prepTest()
}

function printScenes() {
	for (const scene in ctx.scenes) {
		console.log(ctx.scenes[scene])
	}
}

/* TODO: to get this into the project

- see what is printed out of those funky sets

- decide on final types for table data
    - Map for anything? tracks maybe? trackLists?
        - make scene.trackList a map!


NOTES:
- deleting + renaming scene/track
    - < tap/click + hold > or < right click > to access context menu 
        on scene and track headers
    - use new native html context menu thingy (see web dev simplified video)
    - context menu items dispatch to state
    - context menu (for now):
        - rename {scene/track name}
        - delete {scene/track name}






*/
