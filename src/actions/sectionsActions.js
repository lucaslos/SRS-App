import Axios from 'axios';
import { fetchGroups } from 'actions/groupsActions';
import { setModalVisibility } from 'actions/modalsActions';
import { showError } from 'actions/errorActions';


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
    history.pushState(null, null, '/');

    dispatch(setActiveSectionSuccess(sectionId));
    dispatch(fetchGroups(sectionId));
  } else if (sectionMatch.length > 0) {
    document.title = `SRS - ${sectionMatch[0].name}`;
    history.pushState(null, null, `/section/${sectionId}`);

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
  Axios.get(apiUrl)
  .then((response) => {
    dispatch(fetchSectionsSuccess(response.data));
  })
  .catch((error) => {
    throw (error);
  });

/* add section */
export const addSectionSuccess = section => ({
  type: 'ADD_SECTION_SUCCESS',
  section,
});

export const addSectionError = () => ({
  type: 'ADD_SECTION_ERROR',
});

export const addSection = name => dispatch =>
  Axios.post(`${apiUrl}`, {
    name,
    isLanguageSection: true,
  })
  .then((response) => {
    dispatch(addSectionSuccess(response.data));
    dispatch(setActiveSection(response.data.id));
  })
  .catch((error) => {
    dispatch(addSectionError(error));
    dispatch(showError(error));
  });


/* edit section */
export const editSectionSuccess = section => ({
  type: 'EDIT_SECTION_SUCCESS',
  section,
});

export const editSectionError = () => ({
  type: 'EDIT_SECTION_ERROR',
});

export const editSection = (id, name) => dispatch =>
  Axios.put(`${apiUrl}/${id}`, {
    name,
    isLanguageSection: true,
  })
  .then((response) => {
    dispatch(editSectionSuccess(response.data));
  })
  .catch((error) => {
    dispatch(editSectionError(error));
    dispatch(showError(error));
  });

/* delete section */
export const deleteSectionSuccess = sectionId => ({
  type: 'DELETE_SECTION_SUCCESS',
  sectionId,
});

export const deleteSectionError = () => ({
  type: 'DELETE_SECTION_ERROR',
});

export const deleteSection = id => dispatch =>
  Axios.delete(`${apiUrl}/${id}`)
  .then((response) => {
    dispatch(setActiveSection('ALL'));
    dispatch(deleteSectionSuccess(id));
  })
  .catch((error) => {
    dispatch(deleteSectionError(error));
    dispatch(showError(error));
  });
