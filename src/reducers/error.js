export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_ERROR_MSG':
      return action.error;

    default:
      return state;
  }
};
