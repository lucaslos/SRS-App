import { Card } from '@src/firebase/collectionTypings'
import { db } from '@src/firebase/initialize'
import { authStore } from '@src/stores/auth'
import { converterWithId } from '@src/utils/firestoreConverter'
import { handleError } from '@src/utils/handleError'
import { subscribe } from '@utils/solid'
import {
  addDoc,
  collection,
  FirestoreError,
  onSnapshot,
} from 'firebase/firestore'
import { onCleanup } from 'solid-js'
import { createStore } from 'solid-js/store'

type State = {
  state: 'loading' | 'error' | 'success'
  error: FirestoreError | null
  cards: Card[]
}

const [cards, setCards] = createStore<State>({
  state: 'loading',
  error: null,
  cards: [],
})

function getCardsCollection(userId: string) {
  return collection(db, 'users', userId, 'cards').withConverter(
    converterWithId<Card>(),
  )
}

subscribe(() => {
  const userId = authStore.user?.uid

  if (userId) {
    const cardsCollection = getCardsCollection(userId)

    const unsubscribe = onSnapshot(
      cardsCollection,
      (querySnapshot) => {
        const state: Card[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()

          state.push(data)
        })

        setCards('cards', state)
      },
      (error) => {
        setCards('error', error)

        handleError(error)
      },
    )

    onCleanup(() => {
      unsubscribe()
    })
  }
})

export async function createCard(card: Omit<Card, 'id'>) {
  const userId = authStore.user?.uid

  if (!userId) return false

  const cardsCollection = getCardsCollection(userId)

  try {
    await addDoc(cardsCollection, {
      id: 'any',
      ...card,
    })

    return true
  } catch (error) {
    handleError(error)

    return false
  }
}
