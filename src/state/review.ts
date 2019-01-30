import { createStore } from 'lib/hookstore';
import { getCardsToReview, processReview } from 'utils/srsAlgo';
import modalsState from 'state/modals';
import { addUniqueToArray, getLastElem } from 'utils/genericUtils';
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
    goToNext: (state, { id, result }: { result: Results; id: string }) => ({
      ...state,
      results:
        state.reviewPos !== -1 && !state.reviewAgain.includes(id)
          ? {
              ...state.results,
              [id]: result,
            }
          : state.results,
      reviewAgain: ['wrong', 'hard'].includes(result)
        ? [...state.reviewAgain, id]
        : state.reviewAgain,
      reviewPos: state.reviewPos + 1,
    }),
    goToPrev: (state) => {
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

export function GoToNextCard(result: Results, id: string | number) {
  const { reviewPos, reviewCards, reviewAgain } = reviewState.getState();

  reviewState.dispatch('goToNext', { result, id });

  if (result === 'success' && reviewPos + 1 === reviewCards.length + reviewAgain.length) {
    endReview();
  }
}

export function endReview() {
  const { results, reviewCards, startTime, cardsToDelete } = reviewState.getState();

  const { updatedCards, fails, hard, success, time } = processReview(
    reviewCards,
    results,
    startTime
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
