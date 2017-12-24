import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { timeToDate } from 'utils';

import Button from 'components/Button';
import TextField from 'components/TextField';
import Icon from 'components/Icon';
import CardTile from 'components/CardTile';

import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';
import * as cardsActions from 'actions/cardsActions';
import { editGroup } from 'actions/groupsActions';

class SearchModal extends React.Component {
  componentWillMount() {
    this.cardsChange = 0;
    this.props.hideOthersModals();

    this.setState({
      allIsValid: false,
      cardsIsValid: false,
      query: { value: '', isValid: false },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.cardsChange === 1) {
      this.setState({
        cardsIsValid: nextProps.cards.length > 0,
        initialCards: nextProps.cards,
      });
    } else {
      this.setState({
        cardsIsValid: nextProps.cards.length > 0,
      });
    }

    this.cardsChange++;
  }

  handleChange = (name, value, isValid) => {
    this.setState({
      [name]: {
        value,
        isValid,
      },
    });

    clearTimeout(this.timeOut);

    this.timeOut = setTimeout(() => {
      if (value !== '') this.props.searchCards(value);
    }, 500);
  }

  close = () => {
    this.props.close();
    this.props.resetCards();
  }

  render() {
    const { cards } = this.props;
    const { query } = this.state;

    return (
      <div
        className={'modal-box'}
        style={{ width: '500px' }}
      >
        <div className="close-button" onClick={this.close}><Icon name="close" /></div>

        <div className="group-props">
          <TextField
            label="Search cards"
            name="query"
            value={query.value}
            maxlength="100"
            width="430px"
            handleChange={this.handleChange}
          />
        </div>

        <div className="cards-container">
          <div className="divider"><span>Search results: {cards.length}</span></div>
          <div className="cards-tile-container" style={{ minHeight: '300px' }}>
            {cards.length === 0 && query.value !== ''
              ? <div style={{ width: '100%', textAlign: 'center' }}>No results found for {query.value}</div>
              : cards.map(card => (
                <CardTile key={card.id} card={card} />
              ))
            }
          </div>
        </div>

        <div className="bottom-buttons">
          <Button
            label="CLOSE"
            type="flat"
            alignRight
            onClick={this.close}
          />
        </div>
        {/* {this.props.cardsIsFetching &&
          <div className="loading-overlay">
            <div style={{ height: '40px' }}>LOADING...</div>
          </div>
        } */}
      </div>
    );
  }
}

SearchModal.propTypes = {
  hideOthersModals: PropTypes.any,
  close: PropTypes.any,
  cards: PropTypes.any,
  modal: PropTypes.any,
  showAddCard: PropTypes.any,
  setActiveCard: PropTypes.any,
  editGroup: PropTypes.any,
  resetCards: PropTypes.any,
  cardsIsFetching: PropTypes.any,
};

const mapStateToProps = state => ({
  cards: state.cards.items,
  modal: state.modalsVisibility,
  cardsIsFetching: state.cards.isFetching,
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(setModalVisibility('SearchModal', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['SearchModal'])),
  setActiveCard: cardId => dispatch(cardsActions.setActiveCard(cardId)),
  resetCards: () => dispatch(cardsActions.reset()),
  searchCards: query => dispatch(cardsActions.searchCard(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchModal);
