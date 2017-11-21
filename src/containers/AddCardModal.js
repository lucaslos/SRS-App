import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';
import TextField from 'components/TextField';
import TagsInput from 'components/Tags';
import Icon from 'components/Icon';
import Notes from 'components/Notes';

import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';
import * as cards from 'actions/cardsActions';

class AddCardModal extends React.Component {
  constructor() {
    super();

    this.state = {
      allIsValid: false,
      front: { value: '', isValid: false },
      back: { value: '', isValid: false },
      tags: [],
      notes: [],
    };
  }

  hangleArrChange = (name, items) => {
    this.setState({
      [name]: items,
    });
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
    const allIsValid = this.state.front.isValid && this.state.back.isValid;

    this.setState({ allIsValid });
  }

  swapFacesValue = () => {
    this.front.setValue(this.state.back.value);
    this.back.setValue(this.state.front.value);
  }

  confirmAddCard() {
    this.props.close();

    if (this.state.allIsValid) {
      this.props.addCard({
        id: _.uniqueId('card-'),
        front: this.state.front.value,
        back: this.state.back.value,
        wrongViews: 0,
        difficulty: 0,
        lastView: '',
        tags: this.state.tags,
        notes: this.state.notes,
      });
    }
  }

  render() {
    const { close } = this.props;
    const { allIsValid, newFrontValue, newBackValue } = this.state;

    return (
      <div className="modal-box" style={{ width: '500px' }}>
        <h1>Add Card</h1>
        <div className="close-button" onClick={close}><Icon name="close" /></div>

        <div className="card-faces-fields">
          <div className="front">
            <TextField
              label="Front"
              name="front"
              maxlength="500"
              ref={(i) => { this.front = i; }}
              changeValue={newFrontValue}
              handleChange={this.handleChange}
              multiLine
              required
            />
          </div>

          <div className="back">
            <TextField
              label="Back"
              name="back"
              maxlength="500"
              ref={(i) => { this.back = i; }}
              changeValue={newBackValue}
              handleChange={this.handleChange}
              multiLine
              required
            />
          </div>

          <div className="swap-fields-btn" onClick={() => this.swapFacesValue()}><Icon name="swap_horiz" /></div>
        </div>

        <div className="tags-container">
          <div className="divider"><span>Tags</span></div>
          <TagsInput handleChange={this.hangleArrChange} />
        </div>

        <div className="notes-container">
          <div className="divider"><span>Notes</span></div>
          <Notes handleChange={this.hangleArrChange} />
        </div>

        <div className="bottom-buttons">
          <Button
            label="ADD"
            type="flat"
            alignRight
            onClick={() => this.confirmAddCard()}
            disabled={!allIsValid}
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

AddCardModal.propTypes = {
  activeSection: PropTypes.any,
  confirmDeleteSection: PropTypes.any,
  hideOthersModals: PropTypes.any,
  close: PropTypes.any,
  cards: PropTypes.any,
  activeCard: PropTypes.any,
  addCard: PropTypes.any,
};

const mapStateToProps = state => ({
  activeSection: state.sections.items.find(section => section.id === state.sections.active),
  cards: state.cards,
  activeCard: state.cards.active,
});

const mapDispatchToProps = dispatch => ({
  addCard: card => dispatch(cards.addCard(card)),
  close: () => dispatch(setModalVisibility('AddCardModal', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['AddCardModal'])),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCardModal);
