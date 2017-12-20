import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { connect } from 'react-redux';

import { setModalVisibility } from 'actions/modalsActions';
import * as cards from 'actions/cardsActions';

const CardTile = ({ card, confirmDeleteCard, showEditCard, setActiveCard, duplicatedFront, duplicatedBack }) => (
  <div
    className="card-tile"
    onClick={() => {
      setActiveCard(card.id);
      showEditCard();
    }}
  >
    <div className="faces">
      <div className="front" style={{ color: duplicatedFront ? '#f44' : null }}>{card.front}</div>
      <div className="back" style={{ color: duplicatedBack ? '#f44' : null }}>{card.back}</div>
    </div>

    <div
      className="delete-card"
      onClick={(e) => {
        e.stopPropagation();
        setActiveCard(card.id);
        confirmDeleteCard(card.id);
      }}
    ><Icon name="delete" /></div>
  </div>
);

CardTile.propTypes = {
  card: PropTypes.object.isRequired,
  deleteCardDialog: PropTypes.func,
  showEditCard: PropTypes.func.isRequired,
  setActiveCard: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setActiveCard: cardId => dispatch(cards.setActiveCard(cardId)),
  confirmDeleteCard: id => dispatch(cards.deleteCard(id)),
  showEditCard: () => dispatch(setModalVisibility('EditCardModal', true)),
});

export default connect(null, mapDispatchToProps)(CardTile);
