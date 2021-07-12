import { initializeApp } from 'firebase/app'
import { getAuth, useAuthEmulator } from 'firebase/auth'
import { getFirestore, useFirestoreEmulator } from 'firebase/firestore'

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCpT3KQZR_wlb4EPrq4ZX05sm72x6AZSak',
  authDomain: 'srs-db-1b23d.firebaseapp.com',
  databaseURL: 'https://srs-db-1b23d.firebaseio.com',
  projectId: 'srs-db-1b23d',
  storageBucket: 'srs-db-1b23d.appspot.com',
  messagingSenderId: '982649992026',
  appId: '1:982649992026:web:add300d17d38f6a1d4b963',
})

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

if (globalThis.location.hostname === 'localhost') {
  useFirestoreEmulator(db, 'localhost', 8080)
  useAuthEmulator(auth, 'http://localhost:9099')
}
