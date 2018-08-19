import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Axios from 'axios';

import Button from 'components/Button';
import TextField from 'components/TextField';
import Icon from 'components/Icon';
import CardTile from 'components/CardTile';

import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';
import * as cardsActions from 'actions/cardsActions';
import { addGroup } from 'actions/groupsActions';
import { showError } from 'actions/errorActions';

class AddGroupModal extends React.Component {
  constructor() {
    super();

    this.state = {
      allIsValid: false,
      cardsIsValid: false,
      isWaitingForPaste: false,
      name: {
        value: '',
        isValid: false,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      cardsIsValid: nextProps.cards.length > 0,
    }, this.checkFullValidity);
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
    const allIsValid = this.state.name.isValid && this.state.cardsIsValid;

    this.setState({ allIsValid });
  }

  showAddCard = () => {
    this.props.setActiveCard(false);
    this.props.showAddCard();
  }

  confirmAddGroup() {
    this.props.close();

    if (this.state.allIsValid) {
      this.props.addGroup(this.props.activeSection.id, {
        name: this.state.name.value,
        repetitions: '0',
        section_id: this.props.activeSection.id,
        lastview: '',
      }, this.props.cards);

      this.props.resetCardsCache();
    }
    // this.props.confirmDeleteSection(this.props.activeSection.id);
  }

  close = () => {
    this.props.close();
    if (this.props.cards.length > 0) this.props.resetCardsCache();
  }

  importFromGT = () => {
    this.setState({ isWaitingForPaste: true });
    this.hidden.style.display = 'block';

    this.hidden.addEventListener('paste', this.processPaste, false);
    this.hidden.focus();
  }

  processPaste = (e) => {
    this.setState({ isWaitingForPaste: false });
    this.hidden.removeEventListener('paste', this.processPaste, false);

    const paste = e.clipboardData && e.clipboardData.getData ?
    e.clipboardData.getData('text/plain') : // Standard
    window.clipboardData && window.clipboardData.getData ?
    window.clipboardData.getData('Text') : // MS
    false;

    if (paste) {
      try {
        const translations = JSON.parse(paste);

        firebase.database().ref('/card/').once('value')
        .then(({ data }) => {
          for (let i = 0; i < translations.length; i++) {
            if (!data.val().find(
              card => card.front === translations[i][0].toLowerCase()
            )) {
              this.props.addCard({
                id: _.uniqueId('card-'),
                front: translations[i][0],
                back: translations[i][1],
                wrongViews: 0,
                difficulty: 0,
                lastView: '',
                tags: [],
                notes: [],
              });
            } else {
              break;
            }
          }
        }, (error) => {
          this.props.throwError(error);
          console.error(error);
        });
      } catch (error) {
        this.props.throwError(error);
        console.error(error);
      }
    }

    this.hidden.style.display = 'none';
  }

  render() {
    const { activeSection, cards, modal, cardsCache, defaultNameGroup } = this.props;
    const { allIsValid, isWaitingForPaste } = this.state;

    return (
      <div
        className={`modal-box ${modal.AddCardModal || modal.EditCardModal ? 'hide' : ''}`}
        style={{ width: '500px' }}
      >
        <h1>Add Group in {activeSection.name}</h1>
        <div className="close-button" onClick={this.close}><Icon name="close" /></div>

        <div className="group-props">
          <TextField
            label="Group name"
            name="name"
            max="100"
            width="260px"
            value={defaultNameGroup}
            handleChange={this.handleChange}
            required
          />
        </div>

        <div className="cards-container">
          <div className="divider"><span>Cards: {cards.length}</span></div>
          <div className="cards-tile-container">
            {cards.map(card => (
              <CardTile
                key={card.id}
                card={card}
                duplicatedFront={cardsCache.filter(cardCache => cardCache.front === card.front).length > 0}
                duplicatedBack={cardsCache.filter(cardCache => cardCache.back === card.back).length > 0}
              />
            ))}
          </div>

          <Button
            label="ADD CARD"
            rounded
            alignRight
            size="small"
            onClick={() => this.showAddCard()}
          />
          <Button
            label={isWaitingForPaste ? 'PRESS CTRL + V' : 'IMPORT FROM GOOGLE TRANSLATE'}
            rounded
            size="small"
            alignRight
            onClick={() => this.importFromGT()}
          />
        </div>

        <div className="bottom-buttons">
          <Button
            label="ADD"
            type="flat"
            alignRight
            onClick={() => this.confirmAddGroup()}
            disabled={!allIsValid}
          />
          <Button
            label="CANCEL"
            type="flat"
            alignRight
            onClick={this.close}
          />
        </div>
        <input ref={(i) => { this.hidden = i; }} style={{ position: 'absolute', opacity: '0' }}/>
      </div>
    );
  }
}

AddGroupModal.propTypes = {
  activeSection: PropTypes.any,
  confirmDeleteSection: PropTypes.any,
  hideOthersModals: PropTypes.any,
  close: PropTypes.any,
  cards: PropTypes.any,
  modal: PropTypes.any,
  showAddCard: PropTypes.any,
  setActiveCard: PropTypes.any,
  addGroup: PropTypes.any,
};

const mapStateToProps = state => ({
  activeSection: state.sections.items.find(section => section.id === state.sections.active),
  cards: state.cards.items,
  defaultNameGroup: `Group ${state.groups.items.length + 1}`,
  cardsCache: state.reforceCards.items,
  modal: state.modalsVisibility,
});

const mapDispatchToProps = dispatch => ({
  addGroup: (sectionId, group, cards) => dispatch(addGroup(sectionId, group, cards)),
  close: () => dispatch(setModalVisibility('AddGroupModal', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['AddGroupModal', 'AddCardModal'])),
  showAddCard: () => dispatch(setModalVisibility('AddCardModal', true)),
  setActiveCard: cardId => dispatch(cardsActions.setActiveCard(cardId)),
  resetCardsCache: () => dispatch(cardsActions.reset()),
  throwError: error => dispatch(showError(error), true),
  addCard: card => dispatch(cardsActions.addCard(card)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGroupModal);
