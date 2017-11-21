import { setModalVisibility } from 'actions/modalsActions';

export const setErrorMsg = error => ({
  type: 'SET_ERROR_MSG',
  error,
});

export const showError = error => (dispatch) => {
  if (typeof error === 'string') {
    console.warn(error); // eslint-disable-line
    dispatch(setErrorMsg(error));
  } else {
    dispatch(setErrorMsg('Error: check console for further details'));
  }

  dispatch(setModalVisibility('ErrorModal', true));
};
