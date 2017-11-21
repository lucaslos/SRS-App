export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_REFORCE_CARDS_SUCCESS':
      return Object.assign({}, state, {
        items: action.cards,
      });

    case 'RESET_REFORCE_CARDS':
      return Object.assign({}, state, {
        items: [],
      });

    default:
      return state;
  }
};
