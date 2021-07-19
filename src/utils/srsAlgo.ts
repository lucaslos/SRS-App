import { Temporal } from '@js-temporal/polyfill'
import { Card, cardsStore } from '@src/stores/cardsStore'
import { ReviewItem, ReviewStats, reviewStore } from '@src/stores/reviewStore'
import { clamp, clampMax, clampMin } from '@utils/clamp'
import { round } from '@utils/math'

const timeAdjustMs = Temporal.Duration.from({ hours: 9 }).total({
  unit: 'millisecond',
})

const diffRate = 3.5
const highCOFLimit = 2

type Answers = 'success' | 'hard' | 'wrong'

const extraReviewsIncrease: Record<Answers, number> = {
  hard: 0.01,
  wrong: 0.02,
  success: 0,
}
const repetitionsIncrease: Record<Answers, number> = {
  success: 1,
  hard: 0,
  wrong: -1,
}
const baseDiffIncrease: Record<Answers, number> = {
  success: -0.2,
  hard: 0.05,
  wrong: 0.2,
}
const highCOFRepetitionIncrease: Record<Answers, number> = {
  success: 0,
  hard: -1,
  wrong: -2,
}
const highRepetitionIncrease: Record<Answers, number> = {
  success: 0,
  hard: 0.5,
  wrong: 0.5,
}

const maxDaysDiff = [1, 1, 4, 7, 12, 20, 30, 60, 90, 150, 270, 400, 720, 1000]

export function calcCOF(
  card: Pick<Card, 'lastReview' | 'reviews' | 'difficulty'>,
  referenceUnixTimestamp: number,
): number {
  const { lastReview, reviews, difficulty } = card

  if (!lastReview) return -1

  const dateDiff = Math.floor(
    (referenceUnixTimestamp - timeAdjustMs - Date.parse(lastReview)) /
      (1000 * 3600 * 24),
  )

  return dateDiff > 0
    ? dateDiff / maxDaysDiff[reviews > 13 ? 13 : reviews]! +
        clamp(difficulty, 0, 1) * diffRate
    : 0
}

export const needsReview = (cof: number) => cof >= 1

export type CardReviewResult = Pick<
  Card,
  'difficulty' | 'lastReview' | 'wrongReviews' | 'reviews'
>

export function getReviewItemResult(
  answer: Answers,
  card: CardReviewResult,
  extraReviews: number,
  startTimeMs: number,
): CardReviewResult {
  const cof = calcCOF(card, startTimeMs)

  let diffIncrease = baseDiffIncrease[answer] + card.difficulty

  // add diff proportionally to wrong/hard review in a same review section
  if (extraReviews > 1) {
    if (answer === 'hard') {
      diffIncrease += (extraReviews - 1) * extraReviewsIncrease.hard
    } else if (answer === 'wrong') {
      diffIncrease += (extraReviews - 1) ** 2 * extraReviewsIncrease.wrong
    }
  }

  // add diff proportionally to repetitions
  diffIncrease +=
    (clampMax(card.reviews, 10) / 10) ** 2 * highRepetitionIncrease[answer]

  // first time success review bonus
  if (card.reviews === 1 && (answer === 'success' || answer === 'hard')) {
    diffIncrease += -0.6
  }

  let { reviews, wrongReviews } = card

  if (cof >= highCOFLimit) {
    reviews += highCOFRepetitionIncrease[answer]
  } else {
    reviews += repetitionsIncrease[answer]
  }

  if (answer === 'wrong') {
    wrongReviews++
  }

  return {
    lastReview: Temporal.Instant.fromEpochMilliseconds(
      startTimeMs - timeAdjustMs,
    )
      .toZonedDateTimeISO('UTC')
      .toPlainDate()
      .toString(),
    wrongReviews,
    reviews: clampMin(reviews, 1),
    difficulty: round(clamp(diffIncrease, 0, 1), 2),
  }
}

type CardResultWithId = CardReviewResult & { id: string }

export function processReview(reviewItems: ReviewItem[]): {
  results: CardResultWithId[]
  stats: ReviewStats
} {
  const results: CardResultWithId[] = []
  const stats: ReviewStats = {
    endTime: Temporal.now.instant().epochMilliseconds,
    wrong: 0,
    hard: 0,
    success: 0,
  }

  const { startTime } = reviewStore

  const processed = new Set<string>()

  for (const item of reviewItems) {
    const card = cardsStore.cards.byId[item.cardId]

    if (!item.answer || !card || processed.has(item.cardId)) continue

    processed.add(item.cardId)

    stats[item.answer]++

    const extraReviews =
      reviewItems.filter((reviewItem) => reviewItem.cardId === item.cardId)
        .length - 1

    results.push({
      ...getReviewItemResult(item.answer, card, extraReviews, startTime),
      id: card.id,
    })
  }

  return { results, stats }
}
