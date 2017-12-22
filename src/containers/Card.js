import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { connect } from 'react-redux';
import Markdown from 'react-markdown';

import { setModalVisibility } from 'actions/modalsActions';
import * as cardsActions from 'actions/cardsActions';
import * as revisionActions from 'actions/revisionActions';

import QuickAddTag from 'components/QuickAddTag';

class Card extends React.Component {
  componentWillMount() {
    this.setState({
      frontIsVisible: true,
      card: this.props.card,
      dropDownIsActive: false,
    });

    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mounted) {
      this.setState({
        card: nextProps.card,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  goForward = () => {
    if (this.state.frontIsVisible) {
      this.setState({ frontIsVisible: false });
    }
  }

  goBack = (e) => {
    e.stopPropagation();

    if (!this.state.frontIsVisible) {
      this.setState({ frontIsVisible: true });
    } else {
      this.props.goBack(this.props.position);
    }
  }

  textToSpeech = (e, text, lang = 'en-US') => {
    e.stopPropagation();

    const msg = new SpeechSynthesisUtterance();
    const voices = window.speechSynthesis.getVoices();
    msg.voice = voices.find(voice => voice.voiceURI.includes('Google') && voice.lang === lang); // Note: some voices don't support altering params
    msg.volume = 1; // 0 to 1

    msg.pitch = 1; // 0 to 2
    msg.text = text;
    msg.lang = lang;

    speechSynthesis.speak(msg);
  }

  toggleMoreOptions = () => {
    this.setState({
      dropDownIsActive: !this.state.dropDownIsActive,
    });
  }

  handleClickOutside = (e) => {
    if (this.state.dropDownIsActive &&
      (!this.container.contains(e.target) && !this.dropDownBtn.contains(e.target))
    ) {
      this.toggleMoreOptions();
    }
  }

  processCardAnswer = (answer) => {
    if (this.props.cardsLength === 1) {
      this.props.close();
      this.props.processCardAnswer(this.props.card.id, answer, this.props.position, true);
      this.props.finishRevision(this.props.activeGroup);
    } else if (this.props.cardsLength === this.props.position + 1 && answer > 0) {
      this.props.close();
      this.props.finishRevision(this.props.activeGroup);
      this.props.processCardAnswer(this.props.card.id, answer, this.props.position, true);
    } else {
      this.props.processCardAnswer(this.props.card.id, answer, this.props.position);
    }
  }

  showEditCard = () => {
    this.toggleMoreOptions();
    this.props.setActiveCard(this.props.card.id);
    this.props.showEditCard();
  }

  showDictionary = (dictionaryUrl) => {
    this.toggleMoreOptions();

    const url = `${dictionaryUrl}${this.props.card.front}`;
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

  showDeleteCard = () => {
    if (this.props.cardsLength > 1) {
      this.toggleMoreOptions();
      this.setState({ frontIsVisible: true });
      this.props.setActiveCard(this.props.card.id);
      this.props.showDeleteCard();
    }
  }

  addNote = (e) => {
    if (e.dataTransfer.types.includes('text/plain')) {
      this.props.addNote(e.dataTransfer.getData('Text'), this.props.card.id);
    }
  }

  onDragOver = (e) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy';
  }

  render() {
    const { position, cardsLength } = this.props;
    const { frontIsVisible, card, dropDownIsActive } = this.state;

    if (!card) return null;

    const tags = card.tags ? card.tags.map(item => item.text || item) : [];
    const notes = card.notes ? card.notes.map(item => item.text || item) : [];

    return (
      <div className={`card-container ${!frontIsVisible ? 'flipped' : ''}`}>
        <div className="front" onClick={this.goForward} >
          <div className="actions">
            <div className="align-left">
              {position !== 0 &&
                <div className="button" onClick={(e) => { this.goBack(e); }}><Icon name="undo" /></div>
              }
              <div className="button" onClick={(e) => { this.textToSpeech(e, this.contentFront.innerText, (this.props.activeSection === '57522bf113391' ? 'en-US' : 'de-DE')); }}><Icon name="volume_up" /></div>
            </div>
            <div className="align-right">
              <div className="num-of-answers">
                { card.back.match(/,/g) ? [...card.back.match(/,/g), 'ok'].map((item, i) => (
                  <div key={i} className="dot" />
                )) : <div className="dot" />}
              </div>
              {(card.wrongViews > 4 || card.difficulty >= 0.5) && <Icon name="warning" color="#eb5757" />}
            </div>
          </div>
          <div className="content" ref={(i) => { this.contentFront = i; }}><Markdown source={card.front} /></div>
          <div className="tags">
            {tags.length !== 0 && <div className="border-top" />}
            {tags.map((tag, i) => (
              <div key={i} className="tag">{tag}</div>
            ))}
          </div>
        </div>

        <div className="back" onClick={this.goForward} onDrop={this.addNote} onDragOver={this.onDragOver}>
          <div className="actions">
            <div className="align-left">
              <div className="button" onClick={(e) => { this.goBack(e); }}><Icon name="undo" /></div>
              <div
                className="button"
                onClick={(e) => {
                  this.textToSpeech(e, (this.props.activeSection === '57522bf113391' ? this.contentFront.innerText : this.contentBack.innerText), (this.props.activeSection === '57522bf113391' ? 'en-US' : 'de-DE'));
                }}
              ><Icon name="volume_up" /></div>
            </div>
            <div className="align-right">
              <div className="button" ref={(i) => { this.dropDownBtn = i; }} onClick={this.toggleMoreOptions}>
                <Icon name="more_vert" />
              </div>
              <div
                ref={(i) => { this.container = i; }}
                className={`drop-down ${dropDownIsActive ? 'active' : ''}`}
              >
                <ul>
                  <li>
                    <div
                      className="item"
                      onClick={() => this.showDictionary('http://dictionary.cambridge.org/us/search/english-portuguese/direct/?q=')}
                    >Cambridge Translation</div>
                  </li>
                  <li>
                    <div
                      className="item"
                      onClick={() => this.showDictionary('http://dictionary.cambridge.org/pt/buscar/english/direct/?q=')}
                    >Cambridge Definition</div>
                  </li>
                  <li>
                    <div
                      className="item"
                      onClick={() => this.showDictionary('http://pt.bab.la/dicionario/ingles-portugues/')}
                    >bab.la</div>
                  </li>
                  <li>
                    <div
                      className="item"
                      onClick={() => this.showDictionary('https://en.oxforddictionaries.com/definition/us/')}
                    >Oxford</div>
                  </li>
                  <li>
                    <div
                      className="item"
                      onClick={() => this.showDictionary('http://context.reverso.net/traducao/ingles-portugues/')}
                    >Context Reverso</div>
                  </li>
                  <li>
                    <div
                      className="item"
                      onClick={() => this.showDictionary('https://translate.google.com/?source=gtx_m#en/pt/')}
                    >Google Translate</div>
                  </li>
                  <li>
                    <div
                      className="item"
                      onClick={() => this.showDictionary('https://www.merriam-webster.com/dictionary/')}
                    >Merriam Webster</div>
                  </li>

                  <li><div className="item" onClick={this.showEditCard}>Edit card</div></li>
                  {cardsLength > 1 &&
                    <li><div className="item" onClick={this.showDeleteCard}>Delete card</div></li>
                  }
                </ul>

                <QuickAddTag />
              </div>
            </div>
          </div>
          <div className="content" ref={(i) => { this.contentBack = i; }}><Markdown source={card.back} /></div>
          {notes.length > 0 &&
            <div className="notes">
              {notes.map((note, i) => (
                <div key={i} className="note" onDoubleClick={(e) => { this.textToSpeech(e, note, (this.props.activeSection === '57522bf113391' ? 'en-US' : 'de-DE')); }}>{note}</div>
              ))}
            </div>
          }
          <div className="bottom-buttons">
            <div className="wrong-btn" onClick={() => this.processCardAnswer(0)}>
              <Icon name="close" color="#eb5757" />
            </div>
            <div className="not-so-right-btn" onClick={() => this.processCardAnswer(2)}>
              <Icon name="check" color="#e4b71b" />
            </div>
            <div className="right-btn" onClick={() => this.processCardAnswer(1)}>
              <Icon name="check" color="#219653" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  card: PropTypes.any,
  deleteCard: PropTypes.any,
  processCardAnswer: PropTypes.any,
  card: PropTypes.any,
  cardsLength: PropTypes.any,
  position: PropTypes.any,
  close: PropTypes.any,
  finishRevision: PropTypes.any,
  goBack: PropTypes.any,
  activeGroupId: PropTypes.any,
  showDictionary: PropTypes.any,
};

const mapStateToProps = state => ({
  card: state.cards.items[state.revision.position],
  cardsLength: state.cards.items.length,
  position: state.revision.position,
  modals: state.modalsVisibility,
  activeSection: state.sections.active,
  activeGroup: state.groups.active === 'REFORCE'
    ? { id: 'REFORCE', name: 'Reforce Cards', repetitions: 0 }
    : state.groups.items.find(group => group.id === state.groups.active),
});

const mapDispatchToProps = dispatch => ({
  setActiveCard: cardId => dispatch(cardsActions.setActiveCard(cardId)),
  addNote: (note, cardId) => dispatch(cardsActions.addNote(note, cardId)),
  deleteCard: cardId => dispatch(cardsActions.deleteCard(cardId)),
  processCardAnswer: (cardId, isRight, position, isEnd = false) => dispatch(revisionActions.processCardAnswer(cardId, isRight, position, isEnd)),
  showEditCard: () => dispatch(setModalVisibility('EditCardModal', true)),
  showDeleteCard: () => dispatch(setModalVisibility('DeleteCardDialog', true)),
  close: () => dispatch(setModalVisibility('Revision', false)),
  goBack: position => dispatch(revisionActions.goBack(position)),
  finishRevision: activeGroup => dispatch(revisionActions.finishRevision(activeGroup)),
  // addCardToDeletion: cardId => dispatch(revisionActions.addCardToDeletion(cardId)),
  // showDictionary: () => dispatch(setModalVisibility('DictionaryModal', true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);
