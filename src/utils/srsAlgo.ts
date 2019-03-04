import cardsState from 'state/cards';
import {
  shuffle,
  timeToDate,
  time,
  clamp,
  clampMin,
  isDev,
  timeToDateBr,
  clampMax,
} from 'utils/genericUtils';

/**
 * SRS Algorithm
 *
 * calcs the CoF (chance of forggeting) of cards
 */

type CardWithCoF = Card & {
  cof: number;
};

const timeLimitIncrease = 3600 * (3 + 6) * 1000;
const diffRate = 3.5;
const highCofLimit = 2;
const reviewAgainHardIncrease = 0.01;
const reviewAgainWrongIncrease = 0.02;
const repetitionsIncrease: ObjectWithKey<Results, number> = {
  success: 1,
  hard: 0,
  wrong: -1,
};
const diffIncrease: ObjectWithKey<Results, number> = {
  success: -0.2,
  hard: 0.05,
  wrong: 0.2,
};
const highCofRepetitionIncrease: ObjectWithKey<Results, number> = {
  success: 0,
  hard: -1,
  wrong: -2,
};
const highRepetitionIncrease: ObjectWithKey<Results, number> = {
  success: 0,
  hard: 0.5,
  wrong: 0.5,
};
const idealDaysDiff = [
  1,
  1,
  4,
  7,
  12,
  20,
  30,
  60,
  90,
  150,
  270,
  400,
  720,
  1000,
];

/**
 * get CoF of card
 *
 * @export
 * @param {string} lastReview Last review in format 'YYYY-MM-DD'
 * @param {number} repetitions Card repetitons
 * @param {number} [dateIncrease=0] Icrease the last review for calculation in ms
 * @returns -1 for new cards and CoF the rest
 */
export function getCoF(
  repetitions: number,
  diff: number,
  lastReview?: string,
  dateIncrease: number = 0
) {
  if (!lastReview) return -1;

  const now = Date.now() + dateIncrease;

  const dateDiff = Math.floor(
    (now - timeLimitIncrease - Date.parse(lastReview)) / (1000 * 3600 * 24)
  );

  return dateDiff > 0
    ? dateDiff / idealDaysDiff[repetitions > 13 ? 13 : repetitions]
        + clamp(diff, 0, 1) * diffRate
    : 0;
}

export function getNextDayToReview(
  repetitions: number,
  diff: number,
  lastReview?: string,
  formatDate = true,
) {
  if (!lastReview) return 'New';

  const dateDiff = clampMin(
    (1 - diff * diffRate) * idealDaysDiff[repetitions > 13 ? 13 : repetitions],
    1
  );

  const nextReview = Date.parse(lastReview) + dateDiff * 1000 * 3600 * 24;

  const interval = 1000 * 60 * 60 * 24;
  const today = Math.floor(Date.now() / interval) * interval;

  if (nextReview <= today) return 'Today';

  return formatDate ? timeToDateBr(nextReview / 1000) : nextReview;
}

export function calcCardsCoF(cards: Card[]) {
  const newCards: CardWithCoF[] = [];
  const reviewed: CardWithCoF[] = [];

  cards.forEach(card => {
    const cof = getCoF(card.repetitions, card.diff, card.lastReview);

    if (cof === -1) {
      newCards.push({
        ...card,
        cof,
      });
    } else {
      reviewed.push({
        ...card,
        cof,
      });
    }
  });

  return [reviewed, newCards];
}

export const needsReview = (cof: number) => cof >= 1;

export function getCardsToReview(numOfCards: number, onlyNew: boolean) {
  const { cards } = cardsState.getState();

  if (onlyNew) return cards.filter(card => !card.lastReview).slice(0, numOfCards);

  return shuffle(
    cards
      .reduce((acc: Card[], card) => {
        const cof = getCoF(card.repetitions, card.diff, card.lastReview);

        if (needsReview(cof)) {
          acc.push(card);
        }

        return acc;
      }, [])
      .sort((a, b) => {
        const aCoF = getCoF(a.repetitions, a.diff, a.lastReview);
        const bCoF = getCoF(b.repetitions, b.diff, b.lastReview);

        return bCoF - aCoF; // descending
      })
      .slice(0, numOfCards)
  );
}

export function processCardAnswer(
  card: Card,
  answer: Results,
  reviewsAgain: number
): Card {
  const cof = getCoF(card.repetitions, card.diff, card.lastReview);

  // add diff proportionally to wrong/hard review in a same review section
  let reviewsAgainDiffIncrease = 0;
  if (reviewsAgain > 1) {
    if (answer === 'hard') {
      reviewsAgainDiffIncrease = (reviewsAgain - 1) * reviewAgainHardIncrease;
    } else if (answer === 'wrong') {
      reviewsAgainDiffIncrease =
        (reviewsAgain - 1) ** 2 * reviewAgainWrongIncrease;
    }
  }

  // add diff proportionally to repetitions
  const highRepetDiffIncrease =
    (clampMax(card.repetitions, 10) / 10) ** 2 * highRepetitionIncrease[answer];

  if (isDev) {
    console.log({
      answer,
      diffIncrease: diffIncrease[answer],
      reviewsAgainDiffIncrease,
      highRepetDiffIncrease,
      reviewsAgain,
      cof,
      card,
    });
  }

  const oneRepetitionSuccessDiffDecrease =
    card.repetitions === 1 && answer === 'success' ? -0.6 : 0;

  return {
    ...card,
    lastReview: timeToDate(Math.round((Date.now() - timeLimitIncrease) / 1000)),
    wrongReviews:
      answer === 'wrong' ? card.wrongReviews + 1 : card.wrongReviews,
    repetitions: clampMin(
      card.repetitions
        + (cof >= highCofLimit ? highCofRepetitionIncrease : repetitionsIncrease)[
          answer
        ],
      1
    ),
    diff:
      Math.round(
        clamp(
          card.diff
            + diffIncrease[answer]
            + reviewsAgainDiffIncrease
            + oneRepetitionSuccessDiffDecrease
            + highRepetDiffIncrease,
          0,
          1
        ) * 100
      ) / 100,
  };
}

export function processReview(
  cards: Card[],
  answers: anyObject<Results>,
  startTime: number,
  reviewAgain: Card['id'][],
  ignoreInReviewAgainCount: Card['id'][]
) {
  const updatedCards = cards.map(card =>
    processCardAnswer(
      card,
      answers[card.id],
      reviewAgain.filter(id => id === card.id).length
        - ignoreInReviewAgainCount.filter(id => id === card.id).length
    )
  );

  let success = 0;
  let fails = 0;
  let hard = 0;

  Object.keys(answers).forEach(id => {
    if (answers[id] === 'hard') hard++;
    if (answers[id] === 'wrong') fails++;
    if (answers[id] === 'success') success++;
  });

  return {
    updatedCards,
    success,
    fails,
    hard,
    time: time(Date.now() - startTime),
  };
}
