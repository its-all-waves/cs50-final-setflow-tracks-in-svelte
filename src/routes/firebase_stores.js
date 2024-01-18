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
	currentProjectId: '',
	currentSessionId: ''
})

export const projects = writable({
	/* 
	project_id_1: {
		session_id_1,
		session_id_2
	},
	project_id_2: {
		session_id_3,
		session_id_4
	}
	*/
})

export const userDocRef = writable(/* Firestore user document reference */)

export const projectDocRef = writable(/* Firestore project document reference */ {})

export const sessionDocRef = writable(/* Firestore session document reference */ {})

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
