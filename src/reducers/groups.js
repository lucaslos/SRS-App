export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_GROUP':
      return Object.assign({}, state, {
        active: action.groupId,
      });

    case 'TOGGLE_FILTER_WEAK_GROUPS':
      return Object.assign({}, state, {
        filterWeakGroups: !state.filterWeakGroups,
      });

    case 'FETCH_GROUP_SUCCESS':
      return Object.assign({}, state, {
        items: action.groups,
      });

    case 'FETCH_GROUPS_SUCCESS':
      return Object.assign({}, state, {
        items: action.groups,
      });

    case 'FETCH_GROUPS_ERROR':
      return Object.assign({}, state, {
        items: [],
      });

    case 'ADD_GROUP_SUCCESS':
      return Object.assign({}, state, {
        items: [...state.items, action.group],
      });

    case 'EDIT_GROUP_SUCCESS':
      return Object.assign({}, state, {
        items: state.items.map(group => (
          group.id === action.group.id
            ? action.group
            : group
        )),
      });

    case 'DELETE_GROUP_SUCCESS':
      return Object.assign({}, state, {
        items: state.items.filter(group => group.id !== action.id),
      });

    default:
      return state;
  }
};
