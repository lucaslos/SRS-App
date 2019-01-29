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
  cardId: number;
  card?: Card;
  newCard?: boolean;
  handleUpdateCard: (id: number, card: Card) => void;
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
  back: true,
  front: true,
  notes: true,
  createdAt: true,
  lastReview: true,
  tags: true,
  diff: true,
  lang: true,
  wrongReviews: true,
  repetitions: true,
};

const EditCardModal = ({
  show,
  handleClose,
  cardId,
  newCard,
  card,
  handleUpdateCard,
}: Props) => {
  const [tagsSuggestion] = cardsState.useStore('mostUsedTags');
  const [cardProps, setCardProps] = useState<Card>(cardEmpty);
  const [valid, setValid] = useState(cardFieldDefaultValid);

  const allIsValid = !Object.keys(valid).some(
    (key: keyof typeof valid) => !valid[key]
  );

  const someValueIsDiff = JSON.stringify(cardProps) !== JSON.stringify(card);

  useOnChange(show, () => {
    if (show === true) {
      setCardProps(card as NonNullable<typeof card>);
    }
  });

  function reset() {
    setCardProps(cardEmpty);
    setValid(cardFieldDefaultValid);
  }

  function addCard() {
    if (allIsValid) {
      handleUpdateCard(cardId, cardProps);
      reset();
      handleClose();
    }
  }

  function onClose() {
    setCardProps(cardEmpty);
    setValid(cardFieldDefaultValid);
    reset();
    handleClose();
  }

  const handleInputChange: HandleChange = (value, id: keyof Card) => {
    setCardProps({
      ...cardProps,
      [id]: value,
    });
  };

  function handleInputValidChange(isValid: boolean, id: keyof Card) {
    setValid({
      ...valid,
      [id]: isValid,
    });
  }

  function handleTagInputChange(tags: string[], id: keyof Card) {
    setCardProps({
      ...cardProps,
      [id]: tags,
    });
  }

  return (
    <Modal active={show}>
      <div css={boxStyle}>
        <h1>Edit card</h1>
        <div css={inputsRowWrapperStyle}>
          <TextField
            id="wrongReviews"
            value={cardProps.wrongReviews}
            required
            step={1}
            type="number"
            handleChange={handleInputChange}
            handleIsValidChange={handleInputValidChange}
            label="Wrong Views"
          />
          <TextField
            id="repetitions"
            value={cardProps.repetitions}
            step={1}
            required
            type="number"
            handleChange={handleInputChange}
            handleIsValidChange={handleInputValidChange}
            label="Repetitions"
          />
          <TextField
            id="diff"
            value={cardProps.diff}
            required
            step={0.1}
            type="number"
            handleChange={handleInputChange}
            handleIsValidChange={handleInputValidChange}
            label="Difficulty"
          />
          <TextField
            id="lastReview"
            value={cardProps.lastReview as NonNullable<Card['lastReview']>}
            required={newCard}
            type="date"
            width="170px"
            handleChange={handleInputChange}
            handleIsValidChange={handleInputValidChange}
            label="Last Review"
          />
        </div>
        <div css={inputsRowWrapperStyle}>
          <TextField
            id="front"
            value={cardProps.front}
            required
            multiLine
            lines={3}
            handleChange={handleInputChange}
            handleIsValidChange={handleInputValidChange}
            label="Front"
          />
          <TextField
            id="back"
            value={cardProps.back}
            lines={3}
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
            cardProps.tags &&
            cardProps.tags.map((note, i) => ({ id: i, text: note }))
          }
          tagsSuggestion={tagsSuggestion}
        />
        <InputNotes
          handleChange={(key: any, tags: ReactTagInputResult) =>
            handleTagInputChange(tags.map(tag => tag.text), 'notes')
          }
          notes={
            cardProps.notes &&
            cardProps.notes.map((note, i) => ({ id: i, text: note }))
          }
        />
        <div css={bottomButtonsWrapperStyle}>
          <Button label="save" right disabled={!allIsValid || !someValueIsDiff} onClick={addCard} />
          <Button label="cancel" right onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default EditCardModal;
