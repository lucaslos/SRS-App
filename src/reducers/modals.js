export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_MODAL_VISIBILITY_SUCCESS':
      return Object.assign({}, state, {
        [action.modal]: action.visibility === 'toggle' ? !state[action.modal] : action.visibility,
      });

    case 'HIDE_OTHERS_MODALS':
      return Object.assign(
        ...Object.entries(state).map(([key, value]) => (
          { [key]: action.modals.includes(key) ? value : false }
        )));

    default:
      return state;
  }
};
