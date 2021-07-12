import { auth } from '@src/firebase/initialize'
import { subscribe } from '@utils/solid'
import { onAuthStateChanged, User } from 'firebase/auth'
import { createEffect, createRoot } from 'solid-js'
import { createStore } from 'solid-js/store'

type State = {
  authState: 'loggedIn' | 'error' | 'loading' | 'loggedOut'
  error: Error | null
  user: User | null
}

const [authStore, setAuthStore] = createStore<State>({
  user: auth.currentUser,
  authState: auth.currentUser ? 'loggedIn' : 'loading',
  error: null,
})

onAuthStateChanged(
  auth,
  (user) => {
    return setAuthStore({
      user,
      error: null,
      authState: user ? 'loggedIn' : 'loggedOut',
    })
  },
  (error) =>
    setAuthStore({
      user: null,
      error,
      authState: 'error',
    }),
)

export { authStore }
