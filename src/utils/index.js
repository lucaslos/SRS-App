import Axios from 'axios';

const apiUrl = 'http://localhost:4000/api/log';

export const timeToDate = (timeStamp) => {
  const date = new Date(timeStamp * 1000);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();

  if (dd < 10) dd = `0${dd}`;

  if (mm < 10) mm = `0${mm}`;

  return `${yyyy}-${mm}-${dd}`;
};

const limitRange = (val, min, max) => {
  if (val > min) {
    if (val < max) {
      return val;
    } return max;
  } return min;
};

export const logReview = {
  add: async (group, failureRate, failures, repetitionsBeforeReview, cardsLength) => {
    const groupDomain = srsAlgo.calcGroupDomain(group.lastview, parseInt(group.repetitions, 10)); // eslint-disable-line

    delete group.cards;
    delete group.deleteCards;

    const item = {
      group,
      failureRate,
      failures,
      repetitionsBeforeReview,
      cardsLength,
      groupDomain,
      created: +new Date(),
    };

    Axios.post(`${apiUrl}`, item)
    .catch((error) => {
      console.log(error);
    });
  },
};

export const srsAlgo = {
  timeLimitIncrease: 3600 * (3 + 6) * 1000,

  calcGroupDomain: (lastView, repetitions, dateIncrease = 0) => {
    const idealDaysDiff = [0, 1, 4, 7, 12, 20, 30, 60, 90, 150, 270, 400, 720, 1000];
    const now = Date.now() + dateIncrease;
    const dateDiff = Math.floor((now - srsAlgo.timeLimitIncrease - Date.parse(lastView)) / (1000 * 3600 * 24));

    if (repetitions === 0) return 'new';

    return dateDiff / idealDaysDiff[repetitions > 13 ? 13 : repetitions];
  },

  processGroupReview: (cards, repetitions, deleteCards, group) => {
    let wrongCardsCounter = 0;
    let newRepetitions = repetitions;

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
      } else {
        difficulty += difficulty === 0 ? 0.25 : 0;
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
    } else if (wrongRate > 0.8) {
      newRepetitions -= 3;
    } else if (wrongRate > 0.6) {
      newRepetitions -= 2;
    } else if (wrongRate > 0.4) {
      newRepetitions -= 1;
    } else if (wrongRate <= 0.23) {
      newRepetitions += 1;
    }

    newRepetitions = newRepetitions < 1 ? 1 : newRepetitions;

    // log
    logReview.add(group, wrongRate, wrongCardsCounter, repetitions, cards.length);

    return {
      cards: newCards,
      repetitions: newRepetitions,
      lastview: timeToDate(Math.round((+new Date() - srsAlgo.timeLimitIncrease) / 1000)),
      deleteCards,
    };
  },
};
