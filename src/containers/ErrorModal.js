import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';
import Button from 'components/Button';

class ErrorModal extends React.Component {
  render() {
    const { close, errorMsg } = this.props;

    return (
      <div className="modal-box">
        {typeof errorMsg === 'object'
          ? <pre style={{ color: '#f44', fontWeight: 'bold' }}>{JSON.stringify(errorMsg, null, 2)}</pre>
          : <p style={{ color: '#f44', fontWeight: 'bold' }}>{errorMsg}</p>
        }

        <div className="bottom-buttons">
          <Button
            label="CLOSE"
            type="flat"
            alignRight
            onClick={close}
          />
        </div>
      </div>
    );
  }
}

ErrorModal.propTypes = {
  hideOthersModals: PropTypes.any,
  close: PropTypes.any,
  errorMsg: PropTypes.any,
};

const mapStateToProps = state => ({
  errorMsg: state.error,
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(setModalVisibility('ErrorModal', false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);
