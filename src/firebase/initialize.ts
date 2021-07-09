import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyCpT3KQZR_wlb4EPrq4ZX05sm72x6AZSak',
  authDomain: 'srs-db-1b23d.firebaseapp.com',
  databaseURL: 'https://srs-db-1b23d.firebaseio.com',
  projectId: 'srs-db-1b23d',
  storageBucket: 'srs-db-1b23d.appspot.com',
  messagingSenderId: '982649992026',
  appId: '1:982649992026:web:add300d17d38f6a1d4b963',
});

export const auth = firebase.auth();
export const db = firebase.firestore();

export type FirestoreError = firebase.firestore.FirestoreError;

if (globalThis.location.hostname === 'localhost') {
  db.useEmulator('localhost', 8080);
  auth.useEmulator('http://localhost:9099');
}

firebase.firestore.Timestamp.fromDate(new Date('December 10, 1815'));
