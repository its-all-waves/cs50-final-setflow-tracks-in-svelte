// FIREBASE

import { writable } from 'svelte/store'
import { auth } from './firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

// TODO: sync with db
export const userStore = writable({
	loadedFromDb: false,
	id: '',
	name: '',
	email: '',
	last_project_id: '',
	last_session_id: ''
})

export const userDocRef = writable(/* Firestore document reference */)

export const authHandlers = {
	signup: async function (email, password) {
		await createUserWithEmailAndPassword(auth, email, password)
	},
	login: async function (email, password) {
		await signInWithEmailAndPassword(auth, email, password)
	},
	logout: async function () {
		await signOut(auth)
	}
}
