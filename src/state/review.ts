import { createStore } from 'lib/hookstore';
import { getCardsToReview, processReview } from 'utils/srsAlgo';
import modalsState from 'state/modals';
import { addUniqueToArray, getLastElem, shuffle } from 'utils/genericUtils';
import { number } from 'prop-types';
import { pushCards } from 'state/cards';

export type ReviewState = {
  numOfCards: number;
  reviewingNew: boolean;
  reviewCards: Card[];
  reviewPos: number;
  results: anyObject<Results>;
  reviewAgain: Card['id'][];
  cardsToDelete: Card['id'][];
  ended: boolean;
  startTime: number;
  endReport: {
    total: number;
    success: number;
    fails: number;
    hard: number;
    time: string;
  };
};

type Actions = 'goToNext' | 'goToPrev' | 'showDialog' | 'startReview';

const reviewState = createStore<ReviewState, Actions>('review', {
  state: {
    numOfCards: 0,
    reviewingNew: false,
    reviewCards: [],
    reviewPos: -1,
    results: {},
    cardsToDelete: [],
    reviewAgain: [],
    startTime: 0,
    ended: false,
    endReport: {
      total: 0,
      success: 0,
      fails: 0,
      hard: 0,
      time: '',
    },
  },
  reducers: {
    startReview: state => ({
      ...state,
      reviewPos: 0,
      results: {},
      cardsToDelete: [],
      reviewAgain: [],
      startTime: Date.now(),
      ended: false,
    }),
    goToNext: (
      state,
      {
        results,
        reviewAgain,
      }: { results: anyObject<Results>; reviewAgain: Card['id'][] }
    ) => ({
      ...state,
      results,
      reviewAgain,
      reviewPos: state.reviewPos + 1,
    }),
    goToPrev: state => {
      const allCards = [
        ...state.reviewCards,
        ...state.reviewAgain.map(id =>
          state.reviewCards.find(card => id === card.id)
        ),
      ] as Card[];

      return {
        ...state,
        reviewAgain:
          getLastElem(state.reviewAgain) === allCards[state.reviewPos - 1].id
            ? state.reviewAgain.slice(0, -1)
            : state.reviewAgain,
        reviewPos: state.reviewPos - 1,
      };
    },
    showDialog: (
      state,
      payload: {
        numOfCards: number;
        reviewingNew: boolean;
        reviewCards: Card[];
      }
    ) => ({
      ...state,
      numOfCards: payload.numOfCards,
      reviewingNew: payload.reviewingNew,
      reviewCards: payload.reviewCards,
    }),
  },
});

export function showReviewDialog(
  numOfCards: number,
  reviewingNew: boolean = false
) {
  const reviewCards = getCardsToReview(numOfCards, reviewingNew);

  reviewState.dispatch('showDialog', { numOfCards, reviewingNew, reviewCards });

  modalsState.setKey('reviewDialog', true);
}

export function GoToNextCard(result: Results, id: string) {
  const {
    reviewPos,
    results,
    reviewCards,
    reviewAgain,
  } = reviewState.getState();

  const reviewEnd = reviewPos + 1 === reviewCards.length + reviewAgain.length;

  let addResults: typeof results = {};
  let addReviewAgain: typeof reviewAgain = [];

  const lastResult = results[id];
  const resultIsWorst = !lastResult
    || (lastResult === 'success' && (result === 'hard' || result === 'wrong'))
    || (lastResult === 'hard' && result === 'wrong');

  if (reviewPos !== -1 && resultIsWorst) {
    addResults = {
      [id]: result,
    };
  }

  if (['wrong', 'hard'].includes(result)) {
    if (reviewEnd && reviewCards.length > 2) {
      const randomCards = shuffle(reviewCards.filter(card => card.id !== id));

      addReviewAgain = [randomCards[0].id, randomCards[1].id, id];
    } else if (reviewEnd && reviewCards.length > 1) {
      const randomCards = shuffle(reviewCards.filter(card => card.id !== id));

      addReviewAgain = [randomCards[0].id, id];
    } else {
      addReviewAgain = [id];
    }
  }

  reviewState.dispatch('goToNext', {
    results: { ...results, ...addResults },
    reviewAgain: [...reviewAgain, ...addReviewAgain],
  });

  if (result === 'success' && reviewEnd) {
    endReview();
  }
}

export function endReview() {
  const {
    results,
    reviewCards,
    startTime,
    cardsToDelete,
    reviewAgain,
  } = reviewState.getState();

  const { updatedCards, fails, hard, success, time } = processReview(
    reviewCards,
    results,
    startTime,
    reviewAgain,
  );

  pushCards(updatedCards, [], cardsToDelete);

  reviewState.setKey('ended', true);
  reviewState.setKey('endReport', {
    total: updatedCards.length,
    fails,
    hard,
    success,
    time,
  });
}

export default reviewState;
