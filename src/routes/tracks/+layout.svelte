<script>
	import { onMount } from 'svelte'
	import { db } from '../firebase'
	import { doc, getDoc, setDoc } from 'firebase/firestore'
	import { userStore, userDocRef } from '../firebase_stores'
	import { characters, tracks, scenes } from './machine'

	// /** @type {import('./$types').LayoutData} */
	// export let data

	onMount(async () => {
		const sessionConverter = {
			toFirestore() {
				// TODO: copy stores over, but change sets to arrays
				return {
					characters: $characters,
					tracks: $tracks,
					scenes: $scenes
				}
			},
			fromFirestore(snapShot, options) {
				const data = snapShot.data(options)
				if (!data) return null
				return data
			}
		}

		// THE INITIAL DB FETCH UPON LOGIN +++++++++++++++++++++++++++++++++++++

		if (!$userStore.currentProjectId) {
			// MOCK DATA
			$userStore.currentProjectId = 'project_id_1'
			$userStore.currentSessionId = 'session_id_1'
		}
		// fetch the session data from db -- assume a session exists
		const { currentProjectId, currentSessionId } = $userStore
		const sessionDocRef = await doc(
			db,
			`projects/${currentProjectId}/sessions/${currentSessionId}`
		).withConverter(sessionConverter)

		// update the local session store
		const sessionSnapshot = await getDoc(sessionDocRef)

		const sessionData = sessionSnapshot.data()

		if (sessionData) {
			$characters = sessionData.characters
			$tracks = sessionData.tracks
			// convert db array to set before storing in $scenes
			for (const sceneId in sessionData.scenes) {
				const { trackList } = sessionData.scenes[sceneId]
				for (const trackId in trackList) {
					const characterArray = trackList[trackId]
					trackList[trackId] = new Set(characterArray)
				}
			}
			$scenes = sessionData.scenes
		}
	})
</script>

<h3>Tracks</h3>

<slot />

<style>
	h3 {
		text-align: center;
	}
</style>
