import firebase from 'firebase/app';
import 'firebase/database';
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

const app = firebase.initializeApp(isDev ? devConfig : prodConfig);

export default app;
