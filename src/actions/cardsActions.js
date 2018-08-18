import Axios from 'axios';
import { showError } from 'actions/errorActions';
import { updateCards } from 'actions/groupsActions';
import { setModalVisibility } from 'actions/modalsActions';
import { finishRevision } from 'actions/revisionActions';

const apiUrl = 'http://localhost:4000/api/card';

export const setActiveCard = cardId => ({
  type: 'SET_ACTIVE_CARD',
  cardId,
});

export const addCard = card => ({
  type: 'ADD_CARD',
  card,
});

export const setCards = cards => ({
  type: 'SET_CARDS',
  cards,
});

export const deleteCardSuccess = cardId => ({
  type: 'DELETE_CARD',
  cardId,
});

export const addCardToDeletion = cardId => ({
  type: 'ADD_CARD_TO_DELETION',
  cardId,
});

export const deleteCard = cardId => (dispatch, getState) => {
  const modalsVisibility = getState().modalsVisibility;

  if (modalsVisibility.SearchModal) {
    dispatch(deleteCardSuccess(cardId));
    updateCards([], [], [cardId], null, dispatch);
  } else {
    dispatch(deleteCardSuccess(cardId));
    dispatch(addCardToDeletion(cardId));

    if (modalsVisibility.Revision && getState().cards.items.length === getState().revision.position + 1) {
      const state = getState();
      const activeGroup = state.groups.active === 'REFORCE'
        ? { id: 'REFORCE', name: 'Reforce Cards', repetitions: 0 }
        : state.groups.items.find(group => group.id === state.groups.active);

      dispatch(setModalVisibility('Revision', false));
      dispatch(finishRevision(activeGroup));
    }
  }
};

export const editCardCache = card => ({
  type: 'EDIT_CARD_CACHE',
  card,
});

export const editCard = card => (dispatch, getState) => {
  const directEdit = getState().modalsVisibility.SearchModal;

  if (directEdit) {
    dispatch(editCardCache(card));

    updateCards([card], [], [], null, dispatch);
  } else {
    dispatch(editCardCache(card));
  }
};

export const reset = () => ({
  type: 'RESET',
});

export const riffle = () => ({
  type: 'RIFFLE',
});

export const fetchCardsRequest = () => ({
  type: 'FETCH_CARDS_REQUEST',
});

export const fetchCardsSuccess = cards => ({
  type: 'FETCH_CARDS_SUCCESS',
  cards,
});

export const fetchCardsFailure = () => ({
  type: 'FETCH_CARDS_FAILURE',
});


export const fetchCards = groupId => (dispatch) => {
  dispatch(fetchCardsRequest());

  // firebase.database().ref('/card/').once('value')
  // .then((response) => {
  //   dispatch(fetchCardsSuccess(response.val()));
  //   dispatch(riffle());
  // }, (error) => {
  //   dispatch(showError(error));
  //   dispatch(fetchCardsFailure(error));
  // });
};

export const searchCard = query => (dispatch, getState) => {
  dispatch(fetchCardsSuccess(getState().reforceCards.items.filter(card =>
    (RegExp(query, 'i').test(card.front) || RegExp(query, 'i').test(card.back))
  )));
};

export const moveToEnd = (cardId, position) => ({
  type: 'MOVE_TO_END',
  cardId,
  position,
});

export const removeLast = () => ({
  type: 'REMOVE_LAST',
});

export const removeDuplicates = () => ({
  type: 'REMOVE_DUPLICATES',
});

export const registerCardAnswer = (id, answer) => ({
  type: 'REGISTER_CARD_ANSWER',
  id,
  answer,
});

export const addTag = (tag, cardId) => ({
  type: 'ADD_TAG',
  tag,
  cardId,
});

export const addNote = (note, cardId) => ({
  type: 'ADD_NOTE',
  note,
  cardId,
});

export const addImg = (img, cardId) => ({
  type: 'ADD_IMG',
  img,
  cardId,
});
