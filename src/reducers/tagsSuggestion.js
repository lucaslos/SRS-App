export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_TAGS_SUGGESTION':
      return action.tagsSuggestion;

    default:
      return state;
  }
};
