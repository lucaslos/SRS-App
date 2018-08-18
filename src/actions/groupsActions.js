import Axios from 'axios';
import { showError } from 'actions/errorActions';
import { addCards, reset } from 'actions/cardsActions';
import { fetchReforceCards } from 'actions/reforceCardsActions';
import { objectToArray, genId } from '../utils';

const apiUrl = 'http://localhost:4000/api/group';
const apiUrlCard = 'http://localhost:4000/api/card';

/* fetch groups */
export const setActiveGroup = groupId => ({
  type: 'SET_ACTIVE_GROUP',
  groupId,
});

/* fetch groups */
export const toggleFilterWeakGroups = () => ({
  type: 'TOGGLE_FILTER_WEAK_GROUPS',
});

/* fetch groups */
export const fetchGroupsSuccess = groups => ({
  type: 'FETCH_GROUPS_SUCCESS',
  groups,
});

export const fetchGroupsError = () => ({
  type: 'FETCH_GROUPS_ERROR',
});

export const fetchGroups = sectionId => (dispatch) => {
  // const url = sectionId === 'ALL' ? apiUrl : `${apiUrl}?section_id=${sectionId}`;
  (sectionId === 'ALL'
    ? firebase.database().ref('/group/')
    : firebase.database().ref('/group/').orderByChild('section_id').equalTo(sectionId)
  )
  .once('value')
  .then((response) => {
    // Dispatch another action
    // to consume data
    dispatch(fetchGroupsSuccess(objectToArray(response.val() || [])));
    dispatch(fetchReforceCards());
  }, (error) => {
    if (error) {
      dispatch(fetchGroupsError());
      dispatch(showError(error));
    }
  });
};

/* add grops */
export const addGroupSuccess = group => ({
  type: 'ADD_GROUP_SUCCESS',
  group,
});

export const addGroupError = () => ({
  type: 'ADD_GROUP_ERROR',
});

export const addGroup = (sectionId, group, cards) => (dispatch) => {
  const index = genId();

  const newGroup = {
    ...group,
    id: genId(),
    originalId: index,
  };

  const updates = {};
  updates[`group/${index}`] = newGroup;

  for (let i = 0; i < cards.length; i++) {
    const cardIndex = genId();

    updates[`card/${cardIndex}`] = {
      id: genId(),
      originalId: cardIndex,
      front: cards[i].front,
      back: cards[i].back,
      group_id: newGroup.id,
      wrongViews: cards[i].wrongViews,
      difficulty: cards[i].difficulty,
      lastView: cards[i].lastView,
      createdAt: +new Date(),
      tags: cards[i].tags.map(tag => tag.text || tag),
      notes: cards[i].notes.map(tag => tag.text || tag),
    };
  }

  firebase.database().ref().update(updates,
    (error) => {
      if (!error) {
        dispatch(addGroupSuccess(newGroup));
        dispatch(fetchReforceCards());
      } else {
        dispatch(showError(error));
        dispatch(addGroupError(error));
      }
    }
  );
};

/* edit groups */
export const editGroupSuccess = group => ({
  type: 'EDIT_GROUP_SUCCESS',
  group,
});

export const editGroupFailure = () => ({
  type: 'EDIT_GROUP_FAILURE',
});

export const editGroup = group => (dispatch) => {
  const updates = {};

  if (group.id !== 'REFORCE') {
    updates[`group/${group.originalId}`] = group;
  }

  for (let i = 0; i < group.cards.length; i++) {
    const card = group.cards[i];

    if (group.deleteCards.includes(card.id)) {
      updates[`card/${card.originalId}`] = null;
      continue;
    }

    if (card.edited) {
      updates[`card/${card.originalId}`] = {
        ...card,
        tags: card.tags ? card.tags.map(tag => tag.text || tag) : [],
        notes: card.notes ? card.notes.map(tag => tag.text || tag) : [],
      };
      continue;
    }

    if (!card.group_id) {
      const id = genId();

      updates[`card/${id}`] = {
        ...card,
        id,
        originalId: id,
        createdAt: +new Date(),
        tags: card.tags ? card.tags.map(tag => tag.text || tag) : [],
        notes: card.notes ? card.notes.map(tag => tag.text || tag) : [],
      };
      continue;
    }
  }

  firebase.database().ref().update(updates,
    (error) => {
      if (!error) {
        dispatch(editGroupSuccess(group));
      } else {
        dispatch(showError(error));
        dispatch(editGroupFailure(error));
      }
    }
  );
};

/* delete section */
export const deleteGroupSuccess = id => ({
  type: 'DELETE_GROUP_SUCCESS',
  id,
});

export const deleteGroupFailure = () => ({
  type: 'DELETE_GROUP_FAILURE',
});

export const deleteGroup = (id, deleteCards) => dispatch =>
  Axios.delete(`${apiUrl}/${id}`)
  .then(() => {
    updateCards([], [], deleteCards, null, dispatch);
    dispatch(deleteGroupSuccess(id));
  }, (error) => {
    dispatch(deleteGroupFailure(error));
    dispatch(showError(error));
  });
