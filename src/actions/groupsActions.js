import Axios from 'axios';
import { showError } from 'actions/errorActions';
import { addCards, reset } from 'actions/cardsActions';
import { fetchReforceCards } from 'actions/reforceCardsActions';

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
  const url = sectionId === 'ALL' ? apiUrl : `${apiUrl}?section_id=${sectionId}`;

  Axios.get(url)
  .then((response) => {
    // Dispatch another action
    // to consume data
    dispatch(fetchGroupsSuccess(response.data));
    dispatch(fetchReforceCards());
  })
  .catch((error) => {
    dispatch(fetchGroupsError());
    dispatch(showError(error));
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
  Axios.post(apiUrl, Object.assign({}, group))
  .then((response) => {
    for (let i = 0; i < cards.length; i++) {
      Axios.post(apiUrlCard, Object.assign({}, {
        front: cards[i].front,
        back: cards[i].back,
        group_id: response.data.id,
        wrongViews: cards[i].wrongViews,
        difficulty: cards[i].difficulty,
        lastView: cards[i].lastView,
        createdAt: +new Date(),
        tags: cards[i].tags.map(tag => tag.text || tag),
        notes: cards[i].notes.map(tag => tag.text || tag),
      }))
      .then(() => {
        console.log('add card Ok!');
      }, (error) => {
        console.error(error);
        dispatch(addGroupError(error));
      });
    }

    dispatch(addGroupSuccess(response.data));
    dispatch(fetchReforceCards());
  }, (error) => {
    dispatch(showError(error));
    dispatch(addGroupError(error));
  });
};

/* edit groups */
export const editGroupSuccess = group => ({
  type: 'EDIT_GROUP_SUCCESS',
  group,
});

export const editGroupFailure = () => ({
  type: 'EDIT_GROUP_FAILURE',
});

export const updateCards = (editCard, addCard, deleteCards, groupId, dispatch) => {
  let completeIterations = 0;

  for (let i = 0; i < editCard.length; i++) {
    Axios.put(`${apiUrlCard}/${editCard[i].id}`, Object.assign({}, {
      front: editCard[i].front,
      back: editCard[i].back,
      group_id: editCard[i].group_id,
      wrongViews: editCard[i].wrongViews,
      difficulty: editCard[i].difficulty,
      lastView: editCard[i].lastView,
      createdAt: editCard[i].createdAt,
      tags: editCard[i].tags ? editCard[i].tags.map(tag => tag.text || tag) : [],
      notes: editCard[i].tags ? editCard[i].notes.map(tag => tag.text || tag) : [],
    }))
    .then(() => {
      console.log('edit card Ok!');
      completeIterations++;

      if (completeIterations === editCard.length + deleteCards.length) {
        dispatch(fetchReforceCards());
      }
    }, (error) => {
      console.error(error);
      dispatch(addGroupError(error));
    });
  }

  for (let i = 0; i < addCard.length; i++) {
    Axios.post(apiUrlCard, Object.assign({}, {
      front: addCard[i].front,
      back: addCard[i].back,
      group_id: groupId,
      wrongViews: addCard[i].wrongViews,
      difficulty: addCard[i].difficulty,
      lastView: addCard[i].lastView,
      createdAt: +new Date(),
      tags: addCard[i].tags.map(tag => tag.text || tag),
      notes: addCard[i].notes.map(tag => tag.text || tag),
    }))
    .then(() => {
      console.log('add card Ok!');
    }, (error) => {
      console.error(error);
      dispatch(addGroupError(error));
    });
  }

  for (let i = 0; i < deleteCards.length; i++) {
    Axios.delete(`${apiUrlCard}/${deleteCards[i]}`)
    .then(() => {
      console.log('delete card Ok!');
      completeIterations++;

      if (completeIterations === editCard.length + deleteCards.length) {
        dispatch(fetchReforceCards());
      }
    }, (error) => {
      console.error(error);
      dispatch(addGroupError(error));
    });
  }
};

export const editGroup = group => (dispatch) => {
  const editCard = group.cards.filter(card => card.edited);
  const addCard = group.cards.filter(card => !card.group_id);

  if (group.id !== 'REFORCE') {
    Axios.put(`${apiUrl}/${group.id}`, Object.assign({}, {
      name: group.name,
      section_id: group.section_id,
      repetitions: group.repetitions,
      lastview: group.lastview,
    }))
    .then(() => {
      updateCards(editCard, addCard, group.deleteCards, group.id, dispatch);

      dispatch(editGroupSuccess(Object.assign({}, group)));
    }, (error) => {
      dispatch(showError(error));
      dispatch(editGroupFailure(error));
    });
  } else {
    updateCards(editCard, addCard, group.deleteCards, group.id, dispatch);
  }
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
