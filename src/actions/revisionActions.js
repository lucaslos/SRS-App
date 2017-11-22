import * as cardActions from 'actions/cardsActions';
import * as groupActions from 'actions/groupsActions';
import { showError } from 'actions/errorActions';
import { setModalVisibility } from 'actions/modalsActions';
import { srsAlgo } from 'utils';
import Axios from 'axios';

const apiUrl = 'http://5976c690312bc3001190bf6e.mockapi.io/sections';

export const startRevisionSuccess = () => ({
  type: 'START_REVISION_SUCCESS',
});

export const startRevision = groupId => (dispatch) => {
  if (groupId !== 'REFORCE') dispatch(cardActions.fetchCards(groupId));
  dispatch(startRevisionSuccess());
  dispatch(setModalVisibility('Revision', true));
};

export const increasePosition = () => ({
  type: 'INCREASE_POSITION',
});

export const decreasePosition = () => ({
  type: 'DECREASE_POSITION',
});

export const goBack = pos => (dispatch, getState) => {
  const state = getState().cards;
  if (state.items[state.items.length - 1].id === state.items[pos - 1].id) {
    dispatch(cardActions.removeLast());
    dispatch(cardActions.registerCardAnswer(state.items[pos - 1].id, true));
  }

  dispatch(decreasePosition());
};

export const processCardAnswer = (cardId, isRight, pos, isEnd = false) => (dispatch) => {
  if (isRight) {
    if (!isEnd) dispatch(increasePosition());
  } else {
    dispatch(cardActions.registerCardAnswer(cardId, isRight));
    if (!isEnd) dispatch(cardActions.moveToEnd(cardId, pos));
    if (!isEnd) dispatch(increasePosition());
  }
};

export const finishRevision = group => (dispatch, getState) => {
  dispatch(cardActions.removeDuplicates());

  const state = getState();
  dispatch(groupActions.editGroup(Object.assign({}, group,
    srsAlgo.processGroupReview(state.cards.items, group.repetitions, state.cards.deleteCards, group)
  )));
};
