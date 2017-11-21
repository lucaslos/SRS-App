import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';
import * as cardsActions from 'actions/cardsActions';
import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';

class DeleteCardDialog extends React.Component {
  confirmDeleteCard() {
    this.props.close();
    this.props.confirmDeleteCard(this.props.activeCard.id);
  }

  render() {
    const { close } = this.props;

    return (
      <div className="modal-box">
        <p>Delete card?</p>

        <div className="bottom-buttons">
          <Button
            label="DELETE"
            type="flat"
            textColor="#f44"
            alignRight
            onClick={() => this.confirmDeleteCard()}
          />
          <Button
            label="CANCEL"
            type="flat"
            alignRight
            onClick={close}
          />
        </div>
      </div>
    );
  }
}

DeleteCardDialog.propTypes = {
  activeCard: PropTypes.any,
  confirmDeleteCard: PropTypes.any,
  hideOthersModals: PropTypes.any,
  close: PropTypes.any,
};

const mapStateToProps = state => ({
  activeCard: (!state.modalsVisibility.Revision)
    ? state.cards.items.find(card => card.id === state.cards.active)
    : state.cards.items[state.revision.position],
});

const mapDispatchToProps = dispatch => ({
  confirmDeleteCard: id => dispatch(cardsActions.deleteCard(id)),
  close: () => dispatch(setModalVisibility('DeleteCardDialog', false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteCardDialog);
