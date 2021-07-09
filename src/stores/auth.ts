import { auth } from '@src/firebase/initialize';
import { anyFunction } from '@utils/typings';
import firebase from 'firebase/app';
import { createStore } from 'solid-js/store';

type State = {
  authState: 'loggedIn' | 'error' | 'loading' | 'loggedOut';
  error: firebase.auth.Error | null;
  user: firebase.User | null;
};

const [authStore, setAuthStore] = createStore<State>({
  user: auth.currentUser,
  authState: auth.currentUser ? 'loggedIn' : 'loading',
  error: null,
});

auth.onAuthStateChanged(
  (user) => {
    return setAuthStore({
      user,
      error: null,
      authState: user ? 'loggedIn' : 'loggedOut',
    });
  },
  (error) =>
    setAuthStore({
      user: null,
      error,
      authState: 'error',
    }),
);

export { authStore };
