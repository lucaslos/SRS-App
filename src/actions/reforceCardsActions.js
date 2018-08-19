
import { showError } from 'actions/errorActions';
import { setTagsSuggestion } from 'actions/tagsSuggestionActions';
import { objectToArray } from '../utils';

const apiUrl = 'http://localhost:4000/api/card';


export const fetchReforceCardsRequest = () => ({
  type: 'FETCH_REFORCE_CARDS_REQUEST',
});

export const fetchReforceCardsSuccess = cards => ({
  type: 'FETCH_REFORCE_CARDS_SUCCESS',
  cards,
});

export const fetchReforceCardsFailure = () => ({
  type: 'FETCH_REFORCE_CARDS_FAILURE',
});

export const reset = () => ({
  type: 'RESET_REFORCE_CARDS',
});

export const sortByFrequencyAndRemoveDuplicates = (array) => {
  const frequency = {};
  let value;

  // compute frequencies of each value
  for (let i = 0; i < array.length; i++) {
    value = array[i];
    if (value in frequency) {
      frequency[value]++;
    } else {
      frequency[value] = 1;
    }
  }

  // make array from the frequency object to de-duplicate
  const uniques = [];
  for (value in frequency) {
    uniques.push(value);
  }

  // sort the uniques array in descending order by frequency
  function compareFrequency(a, b) {
    return frequency[b] - frequency[a];
  }

  return uniques.sort(compareFrequency);
};

export const populateTagsSuggestion = (cards, dispatch) => {
  // get a list of all suggestions
  let suggestions = [];

  for (let i = 0, len = cards.length; i < len; i++) {
    if (cards[i].tags && cards[i].tags.length !== 0) suggestions = suggestions.concat(cards[i].tags);
  }

  // console.log(sortByFrequencyAndRemoveDuplicates(suggestions));
  dispatch(setTagsSuggestion(sortByFrequencyAndRemoveDuplicates(suggestions)));
};

export const fetchReforceCards = () => (dispatch, getState) => {
  dispatch(fetchReforceCardsRequest());

  firebase.database().ref('/card/').once('value')
  .then((response) => {
    // filter groups to section
    const groups = getState().groups.items.map(group => group.id);
    const cards = objectToArray(response.val()).filter((card => groups.includes(card.group_id)));

    dispatch(fetchReforceCardsSuccess(cards));
    populateTagsSuggestion(cards, dispatch);
    console.log('RefCardsFetched');

    // let suggestions = [];
    //
    // for (let i = 0, len = response.data.length; i < len; i++) {
    //   if (response.data[i].tags) suggestions = [...suggestions, response.data[i].tags];
    // }
    //
    // dispatch(setTagsSuggestion(suggestions.filter((el, i, a) => i === a.indexOf(el))));
  }, (error) => {
    if (error) {
      dispatch(showError(error));
      dispatch(fetchReforceCardsFailure(error));
    }
  });
};
