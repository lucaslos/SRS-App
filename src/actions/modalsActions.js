export const setModalVisibilitySuccess = (modal, visibility) => ({
  type: 'SET_MODAL_VISIBILITY_SUCCESS',
  modal,
  visibility,
});

export const hideOthersModals = modals => ({
  type: 'HIDE_OTHERS_MODALS',
  modals,
});

export const setModalVisibility = (modal, visibility) => (dispatch, getState) => {
  const state = getState();
  if (Object.keys(state.modalsVisibility).includes(modal)) {
    dispatch(setModalVisibilitySuccess(modal, visibility));
  } else {
    console.error(`Modal ${modal} is invalid`);
  }
};
