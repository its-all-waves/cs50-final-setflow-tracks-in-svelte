<script>
	import { onMount } from 'svelte'
	import { db } from '../firebase'
	import {
		doc,
		getDoc,
		setDoc,
		addDoc,
		collection,
		deleteDoc,
		getDocs,
		query,
		collectionGroup,
		QuerySnapshot,
		updateDoc
	} from 'firebase/firestore'
	import { userStore, userDocRef, sessionDocRef, projectDocRef } from '../firebase_stores'
	import { characters, tracks, scenes, trackCount, sceneCount } from './machine'
	import { SDK_VERSION } from 'firebase/app'

	// /** @type {import('./$types').LayoutData} */
	// export let data

	const sessionConverter = {
		toFirestore() {
			// TODO: what do i do with date prop? leave out?
			return {
				characters: $characters,
				tracks: $tracks,
				scenes: $scenes,
				trackCount: $trackCount,
				sceneCount: $sceneCount
			}
		},
		fromFirestore(snapShot, options) {
			const data = snapShot.data(options)
			$characters = data.characters ?? {}
			$tracks = data.tracks ?? {}
			$scenes = data.scenes ?? {}
			$trackCount = data.trackCount ?? 0
			$sceneCount = data.sceneCount ?? 0
			return
		}
	}

	onMount(async () => {
		// DEV / DEBUG
		{
			// await DEV_clearAllProjectsInDb(db)
			// await DEV_createMockProjectInDb(db, $projectDocRef, $sessionDocRef)
		}

		// note: the local user data store is updated by routes/+layout.svelte

		// THE INITIAL DB FETCH UPON LOGIN +++++++++++++++++++++++++++++++++++++

		if (!$userStore.currentSessionId) {
			// create new project doc
			$projectDocRef = await addDoc(collection(db, 'projects'), {})
			// create new projects.doc.sessions.doc
			$sessionDocRef = await addDoc(
				collection(db, 'projects', $projectDocRef.id, 'sessions'),
				{}
			)
			// create new projects.doc.roles.doc
			await addDoc(collection(db, 'projects', $projectDocRef.id, 'roles'), {})

			// update current project / session in db
			await updateDoc($userDocRef, {
				current_project_id: $projectDocRef.id,
				current_session_id: $sessionDocRef.id
			})

			// update docRef stores and local user data proj and session ids
			$userStore.currentProjectId = $projectDocRef.id
			$userStore.currentSessionId = $sessionDocRef.id
		}

		// fetch the session data from db
		const { currentProjectId, currentSessionId } = $userStore
		$projectDocRef = doc(db, `projects/${currentProjectId}`)
		$sessionDocRef = doc(
			db,
			`projects/${currentProjectId}/sessions/${currentSessionId}`
		).withConverter(sessionConverter)
		const sessionSnapshot = await getDoc($sessionDocRef)
		const sessionData = sessionSnapshot.data()
		if (sessionData) {
			$characters = sessionData.characters
			$tracks = sessionData.tracks
			$scenes = sessionData.scenes
			$trackCount = sessionData.trackCount
			$sceneCount = sessionData.sceneCount
		}
	})

	async function DEV_resetDatabase(
		database,
		localUserStore,
		projectDocRefStore,
		sessionDocRefStore
	) {
		await DEV_clearAllProjectsInDb(database)
		await DEV_createMockProjectInDb(
			database,
			localUserStore,
			projectDocRefStore,
			sessionDocRefStore
		)
	}
	/** DEV - DELETE ALL PROJECTS AND SESSIONS */
	async function DEV_clearAllProjectsInDb(database) {
		// delete each project doc that isn't the model / mock data
		const allProjectsDocsQuerySnapshot = await getDocs(query(collection(database, 'projects')))
		// const projectDocsToDelete = allProjectsDocsQuerySnapshot.docs.filter(
		// 	(doc) => doc.id !== 'project_id_1'
		// )
		// projectDocsToDelete.forEach(async (doc) => await deleteDoc(doc.ref))
		const docsToDelete = allProjectsDocsQuerySnapshot.docs
		docsToDelete.forEach(async (doc) => await deleteDoc(doc.ref))

		// delete every sessions collection (these exist within each project doc)
		const sessionsCollectionGroup = collectionGroup(database, 'sessions')
		const allSessionsQuerySnapshot = await getDocs(sessionsCollectionGroup)
		allSessionsQuerySnapshot.forEach(async (doc) => await deleteDoc(doc.ref))

		const rolesCollectionGroup = collectionGroup(database, 'roles')
		const allRolesQuerySnapshot = await getDocs(rolesCollectionGroup)
		allRolesQuerySnapshot.forEach(async (doc) => await deleteDoc(doc.ref))

		// wipe user's current project + session
		await updateDoc($userDocRef, { current_project_id: '', current_session_id: '' })
		console.log('DEBUG')
	}

	/** Sets the db as the single source of truth
	 * 1) Sets the user store with the mock data's project and session IDs.
	 * 2) Creates mock data and sends it to the database
	 */
	async function DEV_createMockProjectInDb(
		database,
		localUserStore,
		projectDocRefStore,
		sessionDocRefStore
	) {
		const TEST_USER_ID = 'p7FMKDSu92PhM42KY6dKJf5zwyW2'

		// FOR NOW: set the local store as initial db pull uses these props to fetch
		// TODO: get this from db/users/TEST_USER_ID
		localUserStore.currentProjectId = 'project_id_1'
		localUserStore.currentSessionId = 'session_id_1'
		sessionDocRefStore = doc(
			db,
			'projects',
			'project_id_1',
			'sessions',
			'session_id_1'
		).withConverter(sessionConverter)

		projectDocRefStore = doc(database, 'projects', localUserStore.currentProjectId)

		// add/clear existing doc in projects to also create projects collection if doesn't exist
		await setDoc(projectDocRefStore, {})

		// same for a doc in projects.doc.roles
		await setDoc(doc(database, 'projects', 'project_id_1', 'roles', 'role_id_1'), {
			user_id: TEST_USER_ID,
			role: 'owner'
		})

		sessionDocRefStore = doc(database, 'projects', 'project_id_1', 'sessions', 'session_id_1')

		// same for a doc in projects.doc.sessions
		await setDoc(sessionDocRefStore, {
			date: Date.now(),
			trackCount: 0,
			sceneCount: 0,
			characters: {
				character_id_1: {
					name: 'Né-né'
				},
				character_id_2: {
					name: 'Zina'
				},
				character_id_3: {
					name: 'Yuki'
				},
				character_id_4: {
					name: 'Igor'
				}
			},
			tracks: {
				track_id_1: {
					number: 1,
					name: 'Track 1'
				},
				track_id_2: {
					number: 2,
					name: 'Track 2'
				},
				track_id_3: {
					number: 3,
					name: 'Track 3'
				},
				track_id_4: {
					number: 4,
					name: 'Track 4'
				}
			},
			scenes: {
				scene_id_1: {
					number: 1,
					name: '33-A',
					trackList: {
						track_id_1: ['character_id_1'],
						track_id_2: ['character_id_2'],
						track_id_3: [],
						track_id_4: []
					}
				},
				scene_id_2: {
					number: 2,
					name: '66-B',
					trackList: {
						track_id_1: [],
						track_id_2: [],
						track_id_3: ['character_id_3'],
						track_id_4: ['character_id_4']
					}
				}
			}
		})
	}

	$: console.log({ $projectDocRef })
	$: console.log({ $sessionDocRef })
</script>

<h3>Tracks</h3>

<slot />

<style>
	h3 {
		text-align: center;
	}
</style>
