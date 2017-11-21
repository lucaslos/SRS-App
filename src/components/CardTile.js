import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { connect } from 'react-redux';

import { setModalVisibility } from 'actions/modalsActions';
import * as cards from 'actions/cardsActions';

const CardTile = ({ card, deleteCardDialog, showEditCard, setActiveCard, duplicated }) => (
  <div
    className="card-tile"
    onClick={() => {
      setActiveCard(card.id);
      showEditCard();
    }}
  >
    <div className="faces">
      <div className="front" style={{ color: duplicated ? '#f44' : null }}>{card.front}</div>
      <div className="back">{card.back}</div>
    </div>

    <div
      className="delete-card"
      onClick={(e) => {
        e.stopPropagation();
        setActiveCard(card.id);
        deleteCardDialog();
      }}
    ><Icon name="delete" /></div>
  </div>
);

CardTile.propTypes = {
  card: PropTypes.object.isRequired,
  deleteCardDialog: PropTypes.func.isRequired,
  showEditCard: PropTypes.func.isRequired,
  setActiveCard: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setActiveCard: cardId => dispatch(cards.setActiveCard(cardId)),
  deleteCardDialog: () => dispatch(setModalVisibility('DeleteCardDialog', true)),
  showEditCard: () => dispatch(setModalVisibility('EditCardModal', true)),
});

export default connect(null, mapDispatchToProps)(CardTile);
