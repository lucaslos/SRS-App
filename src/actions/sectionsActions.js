
import { fetchGroups } from 'actions/groupsActions';
import { setModalVisibility } from 'actions/modalsActions';
import { showError } from 'actions/errorActions';
import { objectToArray, getById } from '../utils';


const apiUrl = 'http://localhost:4000/api/section';

/* set active section */

export const setActiveSectionSuccess = sectionId => ({
  type: 'SET_ACTIVE_SECTION_SUCCESS',
  sectionId,
});

export const setActiveSection = sectionId => (dispatch, getState) => {
  const state = getState();
  if (state.modalsVisibility.Menu) dispatch(setModalVisibility('Menu', false));
  const sectionMatch = state.sections.items.filter(section => section.id === sectionId);

  if (sectionId === 'ALL') {
    document.title = 'SRS';
    window.location.hash = '';

    dispatch(setActiveSectionSuccess(sectionId));
    dispatch(fetchGroups(sectionId));
  } else if (sectionMatch.length > 0) {
    document.title = `SRS - ${sectionMatch[0].name}`;
    window.location.hash = `/section/${sectionId}`;

    dispatch(setActiveSectionSuccess(sectionId));
    dispatch(fetchGroups(sectionId));
  } else {
    dispatch(showError(`Section with id:${sectionId} don't exist.`));
  }
};

/* fetch section */
export const fetchSectionsSuccess = sections => ({
  type: 'FETCH_SECTIONS_SUCCESS',
  sections,
});

export const fetchSections = () => dispatch =>
  firebase.database().ref('/section/').once('value').then((snapshot) => {
    dispatch(fetchSectionsSuccess(objectToArray(snapshot.val())));
  });

/* add section */
export const addSectionSuccess = section => ({
  type: 'ADD_SECTION_SUCCESS',
  section,
});

export const addSectionError = () => ({
  type: 'ADD_SECTION_ERROR',
});

export const addSection = name => (dispatch) => {
  const index = Math.random().toString(36).substr(2, 9);

  const newSection = {
    id: Math.random().toString(36).substr(2, 9), // remember it!
    name,
    isLanguageSection: true,
    originalId: index, // remember it!
  };

  firebase.database().ref(`section/${index}`).set(
    newSection,
    (error) => {
      if (!error) {
        dispatch(addSectionSuccess(newSection));
        dispatch(setActiveSection(newSection.id));
      } else {
        dispatch(addSectionError(error));
        dispatch(showError(error));
      }
    }
  );
};

/* edit section */
export const editSectionSuccess = section => ({
  type: 'EDIT_SECTION_SUCCESS',
  section,
});

export const editSectionError = () => ({
  type: 'EDIT_SECTION_ERROR',
});

export const editSection = (id, name) => (dispatch, getState) => {
  const section = getById(getState().sections.items, id);

  const newSection = {
    ...section,
    name,
    isLanguageSection: true,
  };

  firebase.database().ref(`section/${section.originalId}`).set(
    newSection,
    (error) => {
      if (error) {
        dispatch(editSectionError(error));
        dispatch(showError(error));
      } else {
        dispatch(editSectionSuccess(newSection));
      }
    }
  );
};

/* delete section */
export const deleteSectionSuccess = sectionId => ({
  type: 'DELETE_SECTION_SUCCESS',
  sectionId,
});

export const deleteSectionError = () => ({
  type: 'DELETE_SECTION_ERROR',
});

export const deleteSection = id => (dispatch, getState) => {
  const section = getById(getState().sections.items, id);

  firebase.database().ref(`section/${section.originalId}`).remove(
    (error) => {
      if (!error) {
        dispatch(setActiveSection('ALL'));
        dispatch(deleteSectionSuccess(id));
      } else {
        dispatch(deleteSectionError(error));
        dispatch(showError(error));
      }
    }
  );
};
