import { Temporal } from '@js-temporal/polyfill'
import { batchUdpateCard, cardsStore } from '@src/stores/cardsStore'
import { calcCOF, needsReview, processReview } from '@src/utils/srsAlgo'
import { getLast } from '@utils/getLast'
import { filterUnique } from '@utils/removeDuplicatedFromArray'
import { shuffle } from '@utils/shuffle'
import { sortByPriority } from '@utils/simpleSort'
import { typedArraySet as typedSet } from '@utils/solid'
import { batch } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

type Answers = 'wrong' | 'hard' | 'success'

export type ReviewItem = {
  cardId: string
  cof: number
  answer?: Answers
}

export type ReviewStats = {
  wrong: number
  hard: number
  success: number
  endTime: number
}

type ReviewStore = {
  status: 'closed' | 'dialog' | 'inProgress' | 'ended'
  type: 'reviewNew' | 'review'
  numOfCards: number
  reviewItems: ReviewItem[]
  reviewIndex: number
  startTime: number
  endStats?: ReviewStats
}

export const [reviewStore, setReviewStore] = createStore<ReviewStore>({
  status: 'closed',
  type: 'review',
  numOfCards: 0,
  reviewIndex: -1,
  startTime: -1,
  reviewItems: [],
})

export function openReviewDialog(
  type: ReviewStore['type'],
  numOfCards: ReviewStore['numOfCards'],
) {
  setReviewStore(() => ({
    status: 'dialog',
    type,
    numOfCards,
  }))
}

export function closeReview() {
  setReviewStore('status', 'closed')
}

export function startReview() {
  setReviewStore(() => ({
    status: 'inProgress',
    reviewItems: getCardsToReview(),
    reviewPos: -1,
    startTime: Temporal.now.instant().epochMilliseconds,
  }))

  setTimeout(() => {
    setReviewStore('reviewIndex', 0)
  }, 220)
}

export function getCardsToReview() {
  const { numOfCards, type, startTime } = reviewStore

  let cardsToReview: ReviewItem[] = []

  if (type === 'reviewNew') {
    for (const cardId of cardsStore.cards.allIds) {
      const card = cardsStore.cards.byId[cardId]

      if (!card || card.draft) continue

      if (!card.lastReview) {
        cardsToReview.push({ cardId, cof: -1 })

        if (cardsToReview.length > numOfCards) break
      }
    }

    return cardsToReview
  }

  for (const cardId of cardsStore.cards.allIds) {
    const card = cardsStore.cards.byId[cardId]

    if (!card || card.draft) continue

    const cof = calcCOF(card, startTime)

    if (needsReview(cof)) {
      cardsToReview.push({ cardId, cof })
    }
  }

  cardsToReview = sortByPriority(cardsToReview, (item) => item.cof)
  cardsToReview = shuffle(cardsToReview)

  return cardsToReview
}

export function goToPreviousCard() {
  setReviewStore(
    produce<ReviewStore>((draft) => {
      const activePos = draft.reviewIndex

      if (activePos === 0) return

      if (
        getLast(draft.reviewItems)?.cardId ===
        draft.reviewItems[activePos - 1]?.cardId
      ) {
        draft.reviewItems.pop()
      }

      draft.reviewIndex--
    }),
  )
}

function copyItem(item: ReviewItem): ReviewItem {
  return {
    ...item,
    answer: undefined,
  }
}

export function answerActiveCard(answer: Answers) {
  const { reviewItems, reviewIndex } = reviewStore

  const isLastItem = reviewItems.length === reviewIndex + 1

  const currentItem = reviewItems[reviewIndex]!

  batch(() => {
    setReviewStore(
      'reviewItems',
      ...typedSet<ReviewItem>()([reviewIndex], 'answer', answer),
    )

    if (answer === 'success') {
      if (isLastItem) {
        endReview()
        return
      }

      setReviewStore('reviewIndex', (pos) => pos + 1)
    } else {
      setReviewStore('reviewIndex', (pos) => pos + 1)

      const fillItems: ReviewItem[] = []

      if (isLastItem && reviewItems.length !== 1) {
        const uniqueCards = filterUnique(reviewItems, (item) => item)

        const randomItems = shuffle(
          uniqueCards.filter((item) => item !== currentItem),
        )

        if (uniqueCards.length > 1) {
          fillItems.push(copyItem(randomItems[0]!))
        }

        if (uniqueCards.length > 2) {
          fillItems.push(copyItem(randomItems[1]!))
        }
      }

      setReviewStore('reviewItems', (items) => [
        ...items,
        ...fillItems,
        copyItem(currentItem),
      ])
    }
  })
}

function endReview() {
  const { results, stats } = processReview(reviewStore.reviewItems)

  setReviewStore((store) => ({
    status: 'ended',
    endStats: stats,
    reviewIndex: store.reviewIndex + 1,
  }))

  void batchUdpateCard(results)
}
