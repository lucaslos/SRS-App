import { Temporal } from '@js-temporal/polyfill'
import { Card } from '@src/stores/cardsStore'
import { ReviewItem } from '@src/stores/reviewStore'
import {
  calcCOF,
  getReviewItemResult,
  CardReviewResult,
} from '@src/utils/srsAlgo'

describe('calcCOF', () => {
  test('-1 when last review is nullish', () => {
    const referenceTimeStamp = Date.parse('2021-07-14')

    expect(
      calcCOF(
        {
          lastReview: null,
          reviews: 0,
          difficulty: 0,
        },
        referenceTimeStamp,
      ),
    ).toBe(-1)
  })

  test('reviewed "today"', () => {
    const referenceTimeStamp = Date.parse('2021-07-14')

    expect(
      calcCOF(
        {
          lastReview: '2021-07-14',
          reviews: 0,
          difficulty: 0,
        },
        referenceTimeStamp,
      ),
    ).toBe(0)
  })

  test('day hours adjust works', () => {
    expect(
      calcCOF(
        { lastReview: '2021-07-14', reviews: 0, difficulty: 0 },
        Date.parse('2021-07-15T08:59Z'),
      ),
    ).toBe(0)

    expect(
      calcCOF(
        { lastReview: '2021-07-14', reviews: 0, difficulty: 0 },
        Date.parse('2021-07-15T09:00Z'),
      ),
    ).toBe(1)
  })

  test('days diff', () => {
    const timeStamp = Date.parse('2021-07-15T12:00Z')

    expect(
      calcCOF(
        { lastReview: '2021-07-14', reviews: 0, difficulty: 0 },
        timeStamp,
      ),
    ).toBe(1)

    expect(
      calcCOF(
        { lastReview: '2021-07-11', reviews: 2, difficulty: 0 },
        timeStamp,
      ),
    ).toBe(1)

    expect(
      calcCOF(
        { lastReview: '2021-07-8', reviews: 3, difficulty: 0 },
        timeStamp,
      ),
    ).toBe(1)
  })
})

describe('get review item new values', () => {
  const startTimeInstant = Temporal.ZonedDateTime.from({
    timeZone: 'UTC',
    year: 2021,
    month: 7,
    day: 18,
    hour: 12,
  })

  test('new card', () => {
    expect(
      getReviewItemResult(
        'success',
        {
          lastReview: null,
          reviews: 0,
          difficulty: 0,
          wrongReviews: 0,
        },
        0,
        startTimeInstant.toInstant().epochMilliseconds,
      ),
    ).toStrictEqual<CardReviewResult>({
      difficulty: 0,
      lastReview: '2021-07-18',
      reviews: 1,
      wrongReviews: 0,
    })
  })

  test('date adjust', () => {
    expect(
      getReviewItemResult(
        'success',
        {
          lastReview: null,
          reviews: 0,
          difficulty: 0,
          wrongReviews: 0,
        },
        0,
        Date.parse('2021-07-15T08:00Z'),
      ),
    ).toStrictEqual<CardReviewResult>({
      difficulty: 0,
      lastReview: '2021-07-14',
      reviews: 1,
      wrongReviews: 0,
    })

    expect(
      getReviewItemResult(
        'success',
        {
          lastReview: null,
          reviews: 0,
          difficulty: 0,
          wrongReviews: 0,
        },
        0,
        Date.parse('2021-07-15T09:00Z'),
      ),
    ).toStrictEqual<CardReviewResult>({
      difficulty: 0,
      lastReview: '2021-07-15',
      reviews: 1,
      wrongReviews: 0,
    })
  })

  test('sencond review', () => {
    expect(
      getReviewItemResult(
        'success',
        {
          lastReview: '2021-07-14',
          reviews: 1,
          difficulty: 0,
          wrongReviews: 0,
        },
        0,
        Date.parse('2021-07-15T09:00Z'),
      ),
    ).toStrictEqual<CardReviewResult>({
      difficulty: 0,
      lastReview: '2021-07-15',
      reviews: 2,
      wrongReviews: 0,
    })
  })

  test('wrong answer', () => {
    expect(
      getReviewItemResult(
        'wrong',
        {
          lastReview: '2021-07-14',
          reviews: 2,
          difficulty: 0,
          wrongReviews: 0,
        },
        0,
        Date.parse('2021-07-15T09:00Z'),
      ),
    ).toStrictEqual<CardReviewResult>({
      difficulty: 0.22,
      lastReview: '2021-07-15',
      reviews: 1,
      wrongReviews: 1,
    })
  })

  test('wrong then right', () => {
    expect(
      getReviewItemResult(
        'success',
        {
          lastReview: '2021-07-14',
          reviews: 2,
          difficulty: 0.22,
          wrongReviews: 1,
        },
        0,
        Date.parse('2021-07-15T19:00Z'),
      ),
    ).toStrictEqual<CardReviewResult>({
      difficulty: 0.02,
      lastReview: '2021-07-15',
      reviews: 3,
      wrongReviews: 1,
    })
  })

  test('with repeated reviews', () => {
    expect(
      getReviewItemResult(
        'wrong',
        {
          lastReview: '2021-07-14',
          reviews: 2,
          difficulty: 0.22,
          wrongReviews: 1,
        },
        2,
        Date.parse('2021-07-15T19:00Z'),
      ),
    ).toStrictEqual<CardReviewResult>({
      difficulty: 0.46,
      lastReview: '2021-07-15',
      reviews: 1,
      wrongReviews: 2,
    })

    expect(
      getReviewItemResult(
        'wrong',
        {
          lastReview: '2021-07-14',
          reviews: 2,
          difficulty: 0.22,
          wrongReviews: 1,
        },
        3,
        Date.parse('2021-07-15T19:00Z'),
      ),
    ).toStrictEqual<CardReviewResult>({
      difficulty: 0.52,
      lastReview: '2021-07-15',
      reviews: 1,
      wrongReviews: 2,
    })
  })

  test('add extra difficulty to cards with hig cof', () => {
    expect(
      getReviewItemResult(
        'wrong',
        {
          lastReview: '2021-03-14',
          reviews: 5,
          difficulty: 0.22,
          wrongReviews: 1,
        },
        1,
        Date.parse('2021-07-15T19:00Z'),
      ),
    ).toStrictEqual<CardReviewResult>({
      difficulty: 0.55,
      lastReview: '2021-07-15',
      reviews: 3,
      wrongReviews: 2,
    })
  })
})
