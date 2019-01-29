import Button from 'components/Button';
import Modal, {
  bottomButtonsWrapperStyle,
  boxStyle,
  inputsRowWrapperStyle,
} from 'components/Modal';
import React, { useState } from 'react';
import TextField, { HandleChange } from 'components/TextField';
import Tags from 'components/Tags.js';
import InputNotes from 'components/InputNotes.js';
import cardsState from 'state/cards';
import css from '@emotion/css';
import { useOnChange } from 'utils/customHooks';

type Props = {
  show: boolean;
  handleClose: () => void;
  handleAddCard: (value: CardToAdd) => void;
};

const cardEmpty: Card = {
  id: 0,
  back: '',
  front: '',
  notes: [],
  tags: [],
  diff: 0,
  lang: 'en',
  wrongReviews: 0,
  repetitions: 0,
};

const cardFieldDefaultValid: ObjectWithKey<keyof Card, boolean> = {
  id: true,
  back: false,
  front: false,
  notes: true,
  lastReview: true,
  tags: true,
  createdAt: true,
  diff: true,
  lang: true,
  wrongReviews: true,
  repetitions: true,
};

const AddNewCardModal = ({ show, handleClose, handleAddCard }: Props) => {
  const [tagsSuggestion] = cardsState.useStore('mostUsedTags');
  const [card, setCard] = useState<Card>(cardEmpty);
  const [valid, setValid] = useState(cardFieldDefaultValid);
  const [hideErrors, setHideErrors] = useState(false);

  const allIsValid = !Object.keys(valid).some(
    (key: keyof typeof valid) => !valid[key]
  );

  function reset() {
    setCard(cardEmpty);
    setValid(cardFieldDefaultValid);
  }

  function addCard() {
    if (allIsValid) {
      handleAddCard(card);
      reset();
      handleClose();
    }
  }

  function onClose() {
    setCard(cardEmpty);
    setValid(cardFieldDefaultValid);
    reset();
    handleClose();
  }

  const handleInputChange: HandleChange = (value, id: keyof Card) => {
    setCard({
      ...card,
      [id]: value,
    });
  };

  function handleInputValidChange(isValid: boolean, id: keyof Card) {
    setValid({
      ...valid,
      [id]: isValid,
    });
    if (hideErrors) setHideErrors(false);
  }

  function handleTagInputChange(tags: string[], id: keyof Card) {
    setCard({
      ...card,
      [id]: tags,
    });
  }

  useOnChange(show, () => {
    if (show) {
      setHideErrors(true);
    }
  });

  return (
    <Modal active={show}>
      <div css={boxStyle}>
        <h1>Add card</h1>
        <div css={inputsRowWrapperStyle}>
          <TextField
            id="front"
            value={card.front}
            required
            multiLine
            hideErrors={hideErrors}
            lines={3}
            handleChange={handleInputChange}
            handleIsValidChange={handleInputValidChange}
            label="Front"
          />
          <TextField
            id="back"
            value={card.back}
            lines={3}
            hideErrors={hideErrors}
            required
            multiLine
            handleChange={handleInputChange}
            handleIsValidChange={handleInputValidChange}
            label="Back"
          />
        </div>
        <Tags
          handleChange={(any: any, tags: ReactTagInputResult) =>
            handleTagInputChange(tags.map(tag => tag.text), 'tags')
          }
          tags={
            card.tags && card.tags.map((note, i) => ({ id: i, text: note }))
          }
          tagsSuggestion={tagsSuggestion}
        />
        <InputNotes
          handleChange={(key: any, tags: ReactTagInputResult) =>
            handleTagInputChange(tags.map(tag => tag.text), 'notes')
          }
          notes={
            card.notes && card.notes.map((note, i) => ({ id: i, text: note }))
          }
        />
        <div css={bottomButtonsWrapperStyle}>
          <Button label="add" right disabled={!allIsValid} onClick={addCard} />
          <Button label="cancel" right onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default AddNewCardModal;
