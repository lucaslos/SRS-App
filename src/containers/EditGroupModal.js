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

class EditGroupModal extends React.Component {
  componentWillMount() {
    this.cardsChange = 0;
    this.props.hideOthersModals();

    this.setState({
      allIsValid: false,
      cardsIsValid: false,
      name: { value: this.props.activeGroup.name, isValid: false },
      repetitions: { value: this.props.activeGroup.repetitions, isValid: false },
      lastview: { value: this.props.activeGroup.lastview, isValid: true },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.cardsChange === 1) {
      this.setState({
        cardsIsValid: nextProps.cards.length > 0,
        initialCards: nextProps.cards,
      }, this.checkFullValidity);
    } else {
      this.setState({
        cardsIsValid: nextProps.cards.length > 0,
      }, this.checkFullValidity);
    }

    this.cardsChange++;
  }

  handleChange = (name, value, isValid) => {
    this.setState({
      [name]: {
        value,
        isValid,
      },
    }, this.checkFullValidity);
  }

  checkFullValidity = () => {
    const allIsValid = this.state.name.isValid
      && this.state.repetitions.isValid
      && this.state.lastview.isValid
      && this.state.cardsIsValid
      && this.checkIfIsDifferent();

    this.setState({ allIsValid });
  }

  showAddCard = () => {
    this.props.setActiveCard(false);
    this.props.showAddCard();
  }

  checkIfIsDifferent = () => (
    this.props.activeGroup.name !== this.state.name.value
    || this.props.activeGroup.repetitions !== this.state.repetitions.value
    || this.props.activeGroup.lastview !== this.state.lastview.value
    || this.state.initialCards !== this.props.cards
  );

  confirmEditGroup = () => {
    this.props.close();

    if (this.state.allIsValid) {
      this.props.editGroup({
        ...this.props.activeGroup,
        name: this.state.name.value,
        repetitions: this.state.repetitions.value,
        lastview: this.state.lastview.value,
        section_id: this.props.activeGroup.section_id,
        cards: this.props.cards,
        deleteCards: this.props.deleteCards,
      });

      this.props.resetCards();
    }
  }

  close = () => {
    this.props.close();
    this.props.resetCards();
  }

  render() {
    const { activeGroup, cards, modal, deleteGroupDialog, cardsCache } = this.props;
    const { allIsValid, name, repetitions, lastview } = this.state;

    return (
      <div
        className={`modal-box ${modal.AddCardModal || modal.EditCardModal ? 'hide' : ''}`}
        style={{ width: '500px' }}
      >
        <h1>Edit Group {activeGroup.name}</h1>
        <div className="close-button" onClick={this.close}><Icon name="close" /></div>

        <div className="group-props">
          <TextField
            label="Group name"
            name="name"
            value={name.value}
            maxlength="100"
            width="152px"
            handleChange={this.handleChange}
            required
          />

          <TextField
            label="Repetitions"
            name="repetitions"
            value={repetitions.value}
            min="0"
            type="number"
            width="106px"
            handleChange={this.handleChange}
            required
          />

          <TextField
            label="Last View"
            name="lastview"
            value={lastview.value}
            type="date"
            width="174px"
            placeholder={false}
            handleChange={this.handleChange}
          />
        </div>

        <div className="cards-container">
          <div className="divider"><span>Cards: {cards.length}</span></div>
          <div className="cards-tile-container">
            {cards.map(card => (
              <CardTile
                key={card.id}
                card={card}
                duplicatedFront={cardsCache.filter(cardCache => cardCache.front === card.front).length > 1}
                duplicatedBack={cardsCache.filter(cardCache => cardCache.back === card.back).length > 1}
              />
            ))}
          </div>

          <Button
            label="ADD CARD"
            rounded
            alignRight
            size="small"
            onClick={this.showAddCard}
          />
        </div>

        <div className="bottom-buttons">
          <Button
            label="SAVE"
            type="flat"
            alignRight
            onClick={this.confirmEditGroup}
            disabled={!allIsValid}
          />
          <Button
            label="CANCEL"
            type="flat"
            alignRight
            onClick={this.close}
          />

          <Button
            label="DELETE GROUP"
            type="flat"
            alignLeft
            textColor="#888"
            onClick={deleteGroupDialog}
          />
        </div>
        {this.props.cardsIsFetching &&
          <div className="loading-overlay">
            <div style={{ height: '40px' }}>LOADING...</div>
          </div>
        }
      </div>
    );
  }
}

EditGroupModal.propTypes = {
  activeGroup: PropTypes.any,
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
  activeGroup: state.groups.items.find(group => group.id === state.groups.active),
  cards: state.cards.items,
  deleteCards: state.cards.deleteCards,
  modal: state.modalsVisibility,
  cardsCache: state.reforceCards.items,
  cardsIsFetching: state.cards.isFetching,
});

const mapDispatchToProps = dispatch => ({
  editGroup: group => dispatch(editGroup(group)),
  close: () => dispatch(setModalVisibility('EditGroupModal', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['EditGroupModal', 'AddCardModal'])),
  showAddCard: () => dispatch(setModalVisibility('AddCardModal', true)),
  setActiveCard: cardId => dispatch(cardsActions.setActiveCard(cardId)),
  deleteGroupDialog: () => dispatch(setModalVisibility('DeleteGroupDialog', true)),
  resetCards: () => dispatch(cardsActions.reset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupModal);
