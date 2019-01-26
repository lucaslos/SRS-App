/**
 * SRS Algorithm
 *
 * calcs the CoF (chance of forggeting) of cards
 */

export type Card = {
  id: number;
  front: string;
  back: string;
  tags: string[];
  lastReview: string;
  wrongReviews: number;
  repetitions: number;
  lang: string;
};

export type ArrayOfCards = Card[];

const timeLimitIncrease = 3600 * (3 + 6) * 1000;
const idealDaysDiff = [0, 1, 4, 7, 12, 20, 30, 60, 90, 150, 270, 400, 720, 1000];

/**
 * get CoF of card
 *
 * @export
 * @param {string} lastReview Last review in format 'YYYY-MM-DD'
 * @param {number} repetitions Card repetitons
 * @param {number} [dateIncrease=0] Icrease the last review for calculation in ms
 * @returns -1 for new cards and CoF the rest
 */
export function getCoF(lastReview: string, repetitions: number, dateIncrease: number = 0) {
  if (repetitions === 0) return -1;

  const now = Date.now() + dateIncrease;

  const dateDiff = Math.floor(
    (now - timeLimitIncrease - Date.parse(lastReview)) / (1000 * 3600 * 24)
  );

  return dateDiff / idealDaysDiff[repetitions > 13 ? 13 : repetitions];
}

export function calcCardsCoF(cards: ArrayOfCards) {
  type CardWithCoF = { cof: number } & Card;

  const newCards: CardWithCoF[] = [];
  const reviewed: CardWithCoF[] = [];

  cards.forEach((card) => {
    const cof = getCoF(card.lastReview, card.repetitions);

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

export function processGroupReview(cards, repetitions, deleteCards, group, revisionDuration) {
  let wrongCardsCounter = 0;
  let newRepetitions = parseInt(repetitions, 10);

  // processa dificuldade dos cards
  const newCards = cards.map((card) => {
    let difficulty = card.difficulty;
    let wrongViews = card.wrongViews;
    const answer = card.answer;

    // precessa nova dificuldade
    if (answer === 0) {
      wrongViews++;
      wrongCardsCounter++;

      if (difficulty !== 0 || wrongViews <= 2) {
        difficulty += 0.25;

        // se erros do card forrem +2 e difficulty == 0
      } else {
        difficulty += 0.75;
      }
      // se card for acertado
    } else if (answer === 1) {
      difficulty -= 0.25;
      // se for meio acerto
    } else {
      difficulty = difficulty <= 0.25 ? 0.25 : difficulty - 0.25;
    }

    difficulty = limitRange(difficulty, 0, 1);

    return Object.assign({}, card, {
      difficulty,
      wrongViews,
      lastView: timeToDate(Math.round((+new Date() - srsAlgo.timeLimitIncrease) / 1000)),
      edited: true,
      tags: card.tags,
      notes: card.notes,
    });
  });

  // calcula novas repetições
  const wrongRate = wrongCardsCounter / cards.length;

  if (wrongRate === 1) {
    newRepetitions = 1;
  } else if (wrongRate > 0.7) {
    newRepetitions -= 4;
  } else if (wrongRate > 0.4) {
    newRepetitions -= 3;
  } else if (wrongRate > 0.3) {
    newRepetitions -= 2;
  } else if (wrongRate <= 0.18) {
    newRepetitions += 1;
  }

  newRepetitions = newRepetitions < 1 ? 1 : newRepetitions;

  // log
  logReview.add(group, wrongRate, wrongCardsCounter, repetitions, cards.length, revisionDuration);

  return {
    cards: newCards,
    repetitions: newRepetitions,
    lastview: timeToDate(Math.round((+new Date() - srsAlgo.timeLimitIncrease) / 1000)),
    deleteCards,
  };
}
