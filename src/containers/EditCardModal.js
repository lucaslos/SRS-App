import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { timeToDate } from 'utils';

import Button from 'components/Button';
import TextField from 'components/TextField';
import TagsInput from 'components/Tags';
import Icon from 'components/Icon';
import Notes from 'components/Notes';

import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';
import * as cards from 'actions/cardsActions';

class EditCardModal extends React.Component {
  componentWillMount() {
    this.setState({
      initialValues: this.props.activeCard,
      allIsValid: false,
      id: this.props.activeCard.id,
      front: { value: this.props.activeCard.front, isValid: false },
      back: { value: this.props.activeCard.back, isValid: false },
      wrongViews: { value: this.props.activeCard.wrongViews, isValid: false },
      difficulty: { value: this.props.activeCard.difficulty, isValid: false },
      lastView: { value: this.props.activeCard.lastView, isValid: true },
      tags: this.props.activeCard.tags ? this.props.activeCard.tags.map(item => ({ id: _.uniqueId(), text: item.text || item })) : [],
      notes: this.props.activeCard.notes ? this.props.activeCard.notes.map(item => ({ id: _.uniqueId(), text: item.text || item })) : [],
    });
  }

  hangleArrChange = (name, items) => {
    this.setState({
      [name]: items,
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
    let allIsValid;
    if (this.props.isInAddGroup) {
      allIsValid = this.state.front.isValid &&
      this.state.back.isValid &&
      this.checkIfIsDifferent();
    } else {
      allIsValid = this.state.front.isValid &&
      this.state.back.isValid &&
      this.state.wrongViews.isValid &&
      this.state.difficulty.isValid &&
      this.state.lastView.isValid &&
      this.checkIfIsDifferent();
    }

    this.setState({ allIsValid });
  }

  checkIfIsDifferent = () => {
    const current = this.state;
    const initial = this.state.initialValues; // TODO: remove it
    let tagsIsDif = true;
    let notesIsDif = true;

    if (initial.tags) {
      if (current.tags.length === initial.tags.length) {
        tagsIsDif = !current.tags.every((tags, i) => tags.text === initial.tags[i].text);
      }
    } else {
      tagsIsDif = current.tags.length > 0;
    }

    if (initial.notes) {
      if (current.notes.length === initial.notes.length) {
        notesIsDif = !current.notes.every((notes, i) => notes.text === initial.notes[i].text);
      }
    } else {
      notesIsDif = current.notes.length > 0;
    }

    return (
      current.front.value !== initial.front
      || current.back.value !== initial.back
      || current.wrongViews.value !== initial.wrongViews
      || current.difficulty.value !== initial.difficulty
      || current.lastView.value !== initial.lastView
      || tagsIsDif
      || notesIsDif
    );
  }

  swapFacesValue = () => {
    this.front.setValue(this.state.back.value);
    this.back.setValue(this.state.front.value);
  }

  showDictionary = () => {
    const url = `http://dictionary.cambridge.org/us/search/english/direct/?q=${this.props.activeCard.front}`;
    const title = 'Dictonary';
    const w = 500;
    const h = 600;

    // Fixes dual-screen position Most browsers Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width; // eslint-disable-line
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height; // eslint-disable-line

    const left = dualScreenLeft;
    const top = ((height / 2) - (h / 2)) + dualScreenTop;
    const newWindow = window.open(url, title, `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`);

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }
  }

  showDictionary = (dictionaryUrl) => {
    const url = `${dictionaryUrl}${this.state.front.value}`;
    const title = 'Dictonary';
    const w = 500;
    const h = 600;

    // Fixes dual-screen position Most browsers Firefox
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width; // eslint-disable-line
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height; // eslint-disable-line

    const left = dualScreenLeft;
    const top = ((height / 2) - (h / 2)) + dualScreenTop;
    const newWindow = window.open(url, title, `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`);

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }
  }

  confirmEditCard = () => {
    this.props.close();

    if (this.state.allIsValid) {
      this.props.edtitCard({
        addCard: true,
        id: this.props.activeCard.id,
        front: this.state.front.value,
        back: this.state.back.value,
        createdAt: this.props.activeCard.createdAt || null,
        group_id: this.props.activeCard.group_id || false,
        wrongViews: this.state.wrongViews.value,
        difficulty: this.state.difficulty.value,
        lastView: this.state.lastView.value,
        tags: this.state.tags,
        notes: this.state.notes,
        edited: true,
      });
    }
  }

  render() {
    const { close, activeCard, isInAddGroup, cardGroup } = this.props;
    const { allIsValid, newFrontValue, newBackValue, tags, notes } = this.state;

    return (
      <div className="modal-box" style={{ width: '500px' }}>
        <h1>Edit Card from <span>{cardGroup}</span></h1>
        <div className="close-button" onClick={close}><Icon name="close" /></div>

        {activeCard &&
          <div className="cards-props">
            <TextField
              label="Wrong Views"
              name="wrongViews"
              value={activeCard.wrongViews}
              type="number"
              width="130px"
              min="0"
              handleChange={this.handleChange}
              required={!isInAddGroup}
            />

            <TextField
              label="Difficulty"
              name="difficulty"
              value={activeCard.difficulty}
              width="128px"
              type="number"
              max="1"
              min="0"
              step="0.25"
              handleChange={this.handleChange}
              required={!isInAddGroup}
            />

            <TextField
              label="Last View"
              name="lastView"
              value={activeCard.lastView}
              type="date"
              width="174px"
              placeholder={false}
              handleChange={this.handleChange}
            />
          </div>
        }

        <div className="card-faces-fields">
          <div className="front">
            <TextField
              label="Front"
              name="front"
              value={activeCard.front}
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
              value={activeCard.back}
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
          <TagsInput tags={tags} handleChange={this.hangleArrChange} />
        </div>

        <div className="notes-container">
          <div className="divider"><span>Notes</span></div>
          <Notes notes={notes} handleChange={this.hangleArrChange} />
        </div>

        <div className="bottom-buttons">
          <Button
            label="CAMBRIDGE"
            type="flat"
            alignLeft
            onClick={() => this.showDictionary('http://dictionary.cambridge.org/us/search/english/direct/?q=')}
          />
          <Button
            label="REVERSO"
            type="flat"
            alignLeft
            onClick={() => this.showDictionary('http://context.reverso.net/traducao/ingles-portugues/')}
          />

          <Button
            label="SAVE"
            type="flat"
            alignRight
            onClick={() => this.confirmEditCard()}
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

EditCardModal.propTypes = {
  activeSection: PropTypes.any,
  confirmDeleteSection: PropTypes.any,
  hideOthersModals: PropTypes.any,
  close: PropTypes.any,
  cards: PropTypes.any,
  activeCard: PropTypes.any,
  edtitCard: PropTypes.any,
  isInAddGroup: PropTypes.any,
};

const mapStateToProps = state => ({
  activeCard: state.cards.items.find(card => card.id === state.cards.active),
  cardGroup: state.groups.items.find(group =>
    group.id === state.cards.items.find(card => card.id === state.cards.active).group_id
  ).name,
  isInAddGroup: state.modalsVisibility.AddGroupModal,
});

const mapDispatchToProps = dispatch => ({
  edtitCard: card => dispatch(cards.editCard(card)),
  close: () => dispatch(setModalVisibility('EditCardModal', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['EditCardModal'])),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCardModal);
