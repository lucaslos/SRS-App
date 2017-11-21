export default (state = {}, action) => {
  switch (action.type) {
    case 'START_REVISION_SUCCESS':
      return Object.assign({}, state, {
        position: 0,
        deleteCards: [],
      });

    case 'INCREASE_POSITION':
      return Object.assign({}, state, {
        position: state.position + 1,
      });

    case 'DECREASE_POSITION':
      return Object.assign({}, state, {
        position: state.position - 1,
      });

    default:
      return state;
  }
};
