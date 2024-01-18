<script>
	import '../app.css'

	import { onMount } from 'svelte'
	import { auth, db } from './firebase'
	import { doc, getDoc, setDoc } from 'firebase/firestore'
	import { authHandlers, userStore, userDocRef } from './firebase_stores'

	import '../lib/util/extendsArray'

	const nonAuthRoutes = ['/']

	let pageLoaded = false

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			const currentPath = window.location.pathname

			// if not logged in and current route requires auth, redirect to /
			if (!user && !nonAuthRoutes.includes(currentPath)) {
				window.location.href = '/'
				pageLoaded = true
				return
			}

			// if logged in and on /, send to tracks
			if (user && currentPath === '/') {
				window.location.href = '/tracks'
				pageLoaded = true
				return
			}

			// if not logged in, show +page.svelte (renders <Authenticate>)
			if (!user) {
				pageLoaded = true
				return
			}

			// get a ref to the user doc. if doesn't exist, create it?
			$userDocRef = doc(db, 'users', user.uid)
			const userSnapshot = await getDoc($userDocRef)

			const userData = userSnapshot.data()

			const dataForDbUserDoc = {
				name: userData.name ?? '',
				email: userData.email ?? '',
				currentProjectId: userData.current_project_id ?? '',
				currentSessionId: userData.current_session_id ?? ''
			}

			$userStore = {
				// ...$userStore,
				id: user.uid,
				loadedFromDb: true,
				...dataForDbUserDoc
			}

			await setDoc($userDocRef, dataForDbUserDoc, { merge: true })

			pageLoaded = true
		})
	})
</script>

<div class="mainContainer">
	{#if !pageLoaded}
		<span class="loading">Loading...</span>
	{:else}
		{#if $userStore.loadedFromDb}
			<button on:click={authHandlers.logout}>logout</button>
		{/if}
		<slot />
	{/if}
</div>
