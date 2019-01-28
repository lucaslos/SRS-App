import cardsState from 'state/cards';
import { shuffle, timeToDate, time } from 'utils/genericUtils';

/**
 * SRS Algorithm
 *
 * calcs the CoF (chance of forggeting) of cards
 */

type CardWithCoF = Card & {
  cof: number;
};

const timeLimitIncrease = 3600 * (3 + 6) * 1000;
const idealDaysDiff = [
  0,
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
const diffRate = 4;
const repetitionsIncrease: ObjectWithKey<Results, number> = {
  success: 1,
  hard: 0,
  wrong: -1,
};
const diffIncrease: ObjectWithKey<Results, number> = {
  success: -0.1,
  hard: 0.05,
  wrong: 0.2,
};

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
  if (repetitions === 0 || !lastReview) return -1;

  const now = Date.now() + dateIncrease;

  const dateDiff = Math.floor(
    (now - timeLimitIncrease - Date.parse(lastReview)) / (1000 * 3600 * 24)
  );

  return (
    dateDiff / idealDaysDiff[repetitions > 13 ? 13 : repetitions]
    + diff * diffRate
  );
}

export function calcCardsCoF(cards: Card[]) {
  const newCards: CardWithCoF[] = [];
  const reviewed: CardWithCoF[] = [];

  cards.forEach((card) => {
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
      .reduce((acc: CardWithCoF[], card) => {
        const cof = getCoF(card.repetitions, card.diff, card.lastReview);

        if (needsReview(cof)) {
          acc.push({
            ...card,
            cof,
          });
        }

        return acc;
      }, [])
      .sort((a, b) => b.cof - a.cof) // descending
      .slice(0, numOfCards)
  );
}

export function processCardAnswer(card: Card, answer: Results): Card {
  return {
    ...card,
    lastReview: timeToDate(Math.round((Date.now() - timeLimitIncrease) / 1000)),
    wrongReviews:
      answer === 'wrong' ? card.wrongReviews + 1 : card.wrongReviews,
    repetitions: card.repetitions + repetitionsIncrease[answer],
    diff: card.diff + diffIncrease[answer],
  };
}

export function processReview(
  cards: Card[],
  answers: anyObject<Results>,
  startTime: number
) {
  const updatedCards = cards.map(card =>
    processCardAnswer(card, answers[card.id])
  );

  let success = 0;
  let fails = 0;
  let hard = 0;

  Object.keys(answers).forEach((id) => {
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

// export function processGroupReview(cards, repetitions, deleteCards, group, revisionDuration) {
//   let wrongCardsCounter = 0;
//   let newRepetitions = parseInt(repetitions, 10);

//   // processa dificuldade dos cards
//   const newCards = cards.map((card) => {
//     let difficulty = card.difficulty;
//     let wrongViews = card.wrongViews;
//     const answer = card.answer;

//     // precessa nova dificuldade
//     if (answer === 0) {
//       wrongViews++;
//       wrongCardsCounter++;

//       if (difficulty !== 0 || wrongViews <= 2) {
//         difficulty += 0.25;

//         // se erros do card forrem +2 e difficulty == 0
//       } else {
//         difficulty += 0.75;
//       }
//       // se card for acertado
//     } else if (answer === 1) {
//       difficulty -= 0.25;
//       // se for meio acerto
//     } else {
//       difficulty = difficulty <= 0.25 ? 0.25 : difficulty - 0.25;
//     }

//     difficulty = limitRange(difficulty, 0, 1);

//     return Object.assign({}, card, {
//       difficulty,
//       wrongViews,
//       lastView: timeToDate(Math.round((+new Date() - srsAlgo.timeLimitIncrease) / 1000)),
//       edited: true,
//       tags: card.tags,
//       notes: card.notes,
//     });
//   });

//   // calcula novas repetições
//   const wrongRate = wrongCardsCounter / cards.length;

//   if (wrongRate === 1) {
//     newRepetitions = 1;
//   } else if (wrongRate > 0.7) {
//     newRepetitions -= 4;
//   } else if (wrongRate > 0.4) {
//     newRepetitions -= 3;
//   } else if (wrongRate > 0.3) {
//     newRepetitions -= 2;
//   } else if (wrongRate <= 0.18) {
//     newRepetitions += 1;
//   }

//   newRepetitions = newRepetitions < 1 ? 1 : newRepetitions;

//   // log
//   logReview.add(group, wrongRate, wrongCardsCounter, repetitions, cards.length, revisionDuration);

//   return {
//     cards: newCards,
//     repetitions: newRepetitions,
//     lastview: timeToDate(Math.round((+new Date() - srsAlgo.timeLimitIncrease) / 1000)),
//     deleteCards,
//   };
// }
