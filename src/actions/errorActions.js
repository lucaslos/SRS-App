import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';

export const setErrorMsg = error => ({
  type: 'SET_ERROR_MSG',
  error,
});

export const showError = (error, dontHideOtherModals = false) => (dispatch) => {
  if (typeof error === 'string') {
    console.warn(error); // eslint-disable-line
    dispatch(setErrorMsg(error));
  } else {
    dispatch(setErrorMsg(error.toString()));
  }

  dispatch(setModalVisibility('ErrorModal', true));
  if (dontHideOtherModals) dispatch(hideOthersModals(['ErrorModal']));
};
