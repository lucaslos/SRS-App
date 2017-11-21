import { combineReducers } from 'redux';

import modalsVisibility from 'reducers/modals';
import sections from 'reducers/sections';
import groups from 'reducers/groups';
import error from 'reducers/error';
import cards from 'reducers/cards';
import revision from 'reducers/revision';
import reforceCards from 'reducers/reforceCards';
import tagsSuggestion from 'reducers/tagsSuggestion';

export default combineReducers({
  modalsVisibility,
  sections,
  groups,
  error,
  cards,
  revision,
  reforceCards,
  tagsSuggestion,
});
