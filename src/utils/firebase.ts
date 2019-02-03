import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { isDev } from 'utils/genericUtils';

const devConfig = {
  databaseURL: `ws://localhost:5555`,
};

const prodConfig = {
  apiKey: 'AIzaSyDmUrUmGIGEPHd32QmLJh9hklBGfsd_qoU',
  authDomain: 'srs-db-1b23d.firebaseapp.com',
  databaseURL: 'https://srs-db-1b23d.firebaseio.com',
  projectId: 'srs-db-1b23d',
  storageBucket: 'srs-db-1b23d.appspot.com',
  messagingSenderId: '982649992026',
};

export function login(user: string, pass: string, onErr: (err: any) => void) {
  if (typeof user !== 'string' || typeof pass !== 'string') throw new Error('User or password not defined');

  firebase
    .auth()
    .signInWithEmailAndPassword(user, pass)
    .then(() => {
      localStorage.pass = pass;
      localStorage.user = user;
    })
    .catch(err => {
      if (err) {
        localStorage.removeItem('pass');
        localStorage.removeItem('user');

        onErr(err);
      }
    });
}

window.firebaseLogOut = () => {
  localStorage.removeItem('pass');
  localStorage.removeItem('user');

  firebase
    .auth()
    .signOut()
    .then(
      () => {
        console.log('SignOut successful!');
      },
      (error) => {
        console.log(error);
      }
    );
};

const testAuth = false;

export const firebaseDev = isDev && !testAuth;
const app = firebase.initializeApp(firebaseDev ? devConfig : prodConfig);

export default app;
