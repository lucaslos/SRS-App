import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';
import Button from 'components/Button';
import Icon from 'components/Icon';

class DictionaryModal extends React.Component {
  render() {
    const { close, word } = this.props;

    return (
      <div className="modal-box">
        <div className="close-button" onClick={close}><Icon name="close" /></div>

        <div className="iframe">
          <iframe title="Dictionary" src={`https://en.oxforddictionaries.com/definition/${word}`} target="_parent" allowFullScreen />
        </div>

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

DictionaryModal.propTypes = {
  word: PropTypes.any,
  close: PropTypes.any,
};

const mapStateToProps = state => ({
  word: state.cards.items[state.revision.position].front,
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(setModalVisibility('DictionaryModal', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['DictionaryModal'])),
});

export default connect(mapStateToProps, mapDispatchToProps)(DictionaryModal);
