import { Temporal } from '@js-temporal/polyfill'
import { FBCard } from '@src/firebase/collectionTypings'
import { db } from '@src/firebase/initialize'
import { authStore } from '@src/stores/auth'
import { handleError } from '@src/utils/handleError'
import { calcCOF } from '@src/utils/srsAlgo'
import { subscribe } from '@utils/solid'
import { PartialRecord } from '@utils/typings'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreError,
  writeBatch,
  onSnapshot,
  QueryDocumentSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { onCleanup } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface Card extends FBCard {
  id: string
}

export type CardsStore = {
  status: 'loading' | 'error' | 'success'
  error: FirestoreError | null
  cards: {
    byId: PartialRecord<string, Card | null>
    allIds: string[]
  }
}

const [cardsStore, setStore] = createStore<CardsStore>({
  status: 'loading',
  error: null,
  cards: {
    byId: {},
    allIds: [],
  },
})

export { cardsStore }

function getCardsCollection(userId: string) {
  return collection(db, 'users', userId, 'cards').withConverter({
    toFirestore: ({ id, ...data }: Card) => data,
    fromFirestore: (snap: QueryDocumentSnapshot): FBCard => snap.data() as any,
  })
}

subscribe(() => {
  const userId = authStore.user?.uid

  if (userId) {
    const cardsCollection = getCardsCollection(userId)

    const unsubscribe = onSnapshot(
      cardsCollection,
      (snapshot) => {
        setStore(
          produce<CardsStore>((draftStore) => {
            draftStore.status = 'success'
            draftStore.error = null

            for (const change of snapshot.docChanges()) {
              const data: Card = {
                ...change.doc.data(),
                id: change.doc.id,
              }

              if (change.type === 'added') {
                draftStore.cards.allIds.push(data.id)
                draftStore.cards.byId[data.id] = data

                continue
              }

              if (change.type === 'modified') {
                draftStore.cards.byId[data.id] = data

                continue
              }

              if (change.type === 'removed') {
                const itemIndex = draftStore.cards.allIds.indexOf(data.id)

                draftStore.cards.byId[data.id] = null
                draftStore.cards.allIds.splice(itemIndex, 1)
              }
            }
          }),
        )
      },
      (error) => {
        setStore(() => ({
          status: 'error',
          error,
        }))

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
    await addDoc(cardsCollection, card)

    return true
  } catch (error) {
    handleError(error)

    return false
  }
}

export async function udpateCard(id: string, card: Partial<Card>) {
  const userId = authStore.user?.uid

  if (!userId) return false

  const cardDoc = doc(getCardsCollection(userId), id)

  try {
    await updateDoc(cardDoc, card)

    return true
  } catch (error) {
    handleError(error)

    return false
  }
}

type CardWithId = Partial<Card> & { id: string }

export async function batchUdpateCard(cards: CardWithId[]) {
  const userId = authStore.user?.uid

  if (!userId) return false

  const batch = writeBatch(db)

  for (const card of cards) {
    batch.update(doc(getCardsCollection(userId), card.id), card)
  }

  try {
    await batch.commit()

    return true
  } catch (error) {
    handleError(error)

    return false
  }
}

export async function deleteCard(id: string) {
  const userId = authStore.user?.uid

  if (!userId) return false

  const cardDoc = doc(getCardsCollection(userId), id)

  try {
    await deleteDoc(cardDoc)

    return true
  } catch (error) {
    handleError(error)

    return false
  }
}
