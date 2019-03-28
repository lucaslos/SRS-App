import Button from 'components/Button';
import Modal, {
  bottomButtonsWrapperStyle,
  boxStyle,
  inputsRowWrapperStyle,
} from 'components/Modal';
import React, { useState, useMemo } from 'react';
import TextField, { HandleChange } from 'components/TextField';
import Tags from 'components/Tags.js';
import InputNotes from 'components/InputNotes.js';
import cardsState from 'state/cards';
import css from '@emotion/css';
import { useOnChange } from 'utils/customHooks';
import { getCoF, getNextDayToReview } from 'utils/srsAlgo';
import { timeToDate, timeToDateBr } from 'utils/genericUtils';
import styled from '@emotion/styled';
import { colorYellow } from 'style/theme';

type Props = {
  show: boolean;
  handleClose: () => void;
  cardId: Card['id'] | false;
  card?: Card | false;
  allCards?: Card[];
  newCard?: boolean;
  handleUpdateCard: (id: Card['id'], card: Card) => void;
};

const H2 = styled.h2<{ warn: boolean }>`
  font-size: 14px;
  margin-top: -12px;
  width: 100%;
  padding: 0 24px;
  margin-bottom: 14px;
  font-weight: 300;
  color: ${props => props.warn && colorYellow}
`;

const cardEmpty: Card = {
  id: '0',
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
  allCards,
  newCard,
  card,
  handleUpdateCard,
}: Props) => {
  const [tagsSuggestion] = cardsState.useStore('mostUsedTags');
  const [cardProps, setCardProps] = useState<Card | false>(false);
  const [valid, setValid] = useState(cardFieldDefaultValid);

  const allIsValid = !Object.keys(valid).some(
    (key: keyof typeof valid) => !valid[key]
  );

  const someValueIsDiff = JSON.stringify(cardProps) !== JSON.stringify(card);

  const cof =
    cardProps &&
    getCoF(cardProps.repetitions, cardProps.diff, cardProps.lastReview);

  useOnChange(show, () => {
    if (show === true) {
      setCardProps(card as NonNullable<typeof card>);
    }
  });

  function reset() {
    setCardProps(cardEmpty);
    setValid(cardFieldDefaultValid);
  }

  function updateCard() {
    if (allIsValid && cardProps) {
      handleUpdateCard(cardId as Card['id'], cardProps);
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
    if (cardProps) {
      setCardProps({
        ...cardProps,
        [id]: value,
      });
    }
  };

  function handleInputValidChange(isValid: boolean, id: keyof Card) {
    if (cardProps) {
      setValid({
        ...valid,
        [id]: isValid,
      });
    }
  }

  function handleTagInputChange(tags: string[], id: keyof Card) {
    if (cardProps) {
      setCardProps({
        ...cardProps,
        [id]: tags,
      });
    }
  }

  const frontIsDuplicated = useMemo(
    () =>
      cardProps &&
      cardsState
        .getState()
        .cards.some(
          cardToCheck =>
            cardProps.id !== cardToCheck.id &&
            cardToCheck.front.trim() === cardProps.front.trim()
        ),
    [cardProps && cardProps.front]
  );

  const backIsDuplicated = useMemo(
    () =>
      cardProps &&
      cardsState
        .getState()
        .cards.some(
          cardToCheck =>
            cardProps.id !== cardToCheck.id &&
            cardToCheck.back.trim() === cardProps.back.trim()
        ),
    [cardProps && cardProps.back]
  );

  return (
    <Modal active={show}>
      <div css={[boxStyle, { overflowY: 'auto', display: 'block' }]}>
        <h1>Edit card</h1>
        <H2>
          {cof !== false ? `CoF: ${cof.toFixed(2)} －` : ''} Created:{' '}
          {card && card.createdAt
            ? timeToDateBr(card.createdAt / 1000)
            : 'Null'}
          {' － Next Review: '}
          {cardProps
            ? getNextDayToReview(
                cardProps.repetitions,
                cardProps.diff,
                cardProps.lastReview
              )
            : ''}
        </H2>
        {cardProps && (
          <>
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
                // required={newCard}
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
            {(frontIsDuplicated || backIsDuplicated) &&
              <H2 warn>{`${frontIsDuplicated ? 'Front is Duplicated! ' : ''}${backIsDuplicated ? 'Back is Duplicated! ' : ''}`}</H2>
            }
            <Tags
              handleChange={(any: any, tags: ReactTagInputResult) =>
                handleTagInputChange(tags.map(tag => tag.text), 'tags')
              }
              tags={
                cardProps.tags
                  ? cardProps.tags.map((note, i) => ({ id: i, text: note }))
                  : []
              }
              tagsSuggestion={tagsSuggestion}
            />
            <InputNotes
              handleChange={(key: any, tags: ReactTagInputResult) =>
                handleTagInputChange(tags.map(tag => tag.text), 'notes')
              }
              notes={
                cardProps.notes
                  ? cardProps.notes.map((note, i) => ({ id: i, text: note }))
                  : []
              }
            />
          </>
        )}
        <div css={bottomButtonsWrapperStyle}>
          <Button
            label="save"
            right
            disabled={!allIsValid || !someValueIsDiff}
            onClick={updateCard}
          />
          <Button label="cancel" right onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default EditCardModal;
