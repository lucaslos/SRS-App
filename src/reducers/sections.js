import _ from 'lodash';

export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_SECTION_SUCCESS':
      return Object.assign({}, state, {
        active: action.sectionId,
      });

    case 'FETCH_SECTIONS_SUCCESS':
      return Object.assign({}, state, {
        items: action.sections,
      });

    case 'ADD_SECTION_SUCCESS':
      return Object.assign({}, state, {
        items: [...state.items, action.section],
      });

    case 'EDIT_SECTION_SUCCESS':
      return Object.assign({}, state, {
        items: state.items.map(section => (
          section.id === action.section.id ? {
            ...section,
            name: action.section.name,
            isLanguageSection: action.section.isLanguageSection,
          } : section
        )),
      });

    case 'DELETE_SECTION_SUCCESS':
      return Object.assign({}, state, {
        items: state.items.filter(section => section.id !== action.sectionId),
      });

    default:
      return state;
  }
};
