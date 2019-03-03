import css from '@emotion/css';
import styled from '@emotion/styled';
import Button from 'components/Button';
import CardTile, { TilesWrapper } from 'components/CardTile';
import Modal, {
  bottomButtonsWrapperStyle,
  BoxCloseButton,
  boxStyle,
} from 'components/Modal';
import AddNewCardModal from 'containers/AddNewCardModal';
import EditCardModal from 'containers/EditCardModal';
import React, { useState } from 'react';
import cardsState, { pushNewCards } from 'state/cards';
import modalsState from 'state/modals';
import { centerContent } from 'style/modifiers';
import { colorSecondary, colorYellow, fontDecorative } from 'style/theme';
import { replaceAt } from 'utils/genericUtils';
import { filterCardsFromGoogleTranslate } from 'utils/googleTranslate';

const AddCardsButtonsWrapper = styled.div`
  ${centerContent};
  padding: 8px;

  width: 100%;

  .button {
    margin: 8px;
  }
`;

const Warn = styled.div`
  margin-top: 12px;
  width: 100%;
  text-align: center;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 300;
  color: ${colorYellow};

  strong {
    font-family: ${fontDecorative};
  }
`;

const AddCardsModal = () => {
  const [show, setShow] = modalsState.useStore('addCards');
  const [cardsToAdd, setCardsToAdd] = useState<Card[]>([]);
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [showEditCard, setShowEditCard] = useState<boolean>(false);
  const [editCardId, setEditCardId] = useState<number>(0);
  const [importError, setImportError] = useState('');

  function handleSaveCards() {
    pushNewCards(cardsToAdd);
    setShow(false);
  }

  function handleAddCard(card: Card) {
    setCardsToAdd([...cardsToAdd, card]);
  }

  function handleDeleteCard(id: number) {
    setCardsToAdd(cardsToAdd.filter((v, i) => i !== id));
  }

  function handleClose() {
    setCardsToAdd([]);
    setShow(false);
  }

  function handleUpdateCard(id: string, card: Card) {
    setCardsToAdd(replaceAt(cardsToAdd, parseInt(id, 10), card));
  }

  function showEditModal(id: number) {
    setEditCardId(id);
    setShowEditCard(true);
  }

  function importFromTranslate() {
    setImportError('');

    navigator.clipboard
      .readText()
      .then(text => {
        const importedCards = filterCardsFromGoogleTranslate(text);

        if (importedCards) {
          setCardsToAdd(importedCards);
        } else {
          setImportError('Copied content is invalid');
        }
      })
      .catch(err => {
        setImportError('Failed to read clipboard contents');
        console.error('Failed to read clipboard contents: ', err);
      });
  }

  const frontIsDuplicated = cardsState
    .getState()
    .cards.filter(card =>
      cardsToAdd.some(newCard => card.front.trim() === newCard.front.trim())
    );

  const backIsDuplicated = cardsState
    .getState()
    .cards.filter(card =>
      cardsToAdd.some(newCard => card.back.trim() === newCard.back.trim())
    );

  function showCardDialog(card: Card) {
    alert(`front: ${card.front} \nback: ${card.back}`);
  }

  return (
    <>
      <Modal active={show}>
        <div css={boxStyle}>
          <h1>
            Add {cardsToAdd.length || ''} card
            {cardsToAdd.length === 1 ? '' : 's'}
          </h1>
          <BoxCloseButton onClose={handleClose} />
          <TilesWrapper>
            {cardsToAdd.map((card, i) => (
              <CardTile
                key={i}
                front={card.front}
                back={card.back}
                onClick={() => showEditModal(i)}
                onDelete={() => handleDeleteCard(i)}
              />
            ))}
          </TilesWrapper>
          {frontIsDuplicated.length > 0 && (
            <Warn>
              Duplicated front text:{' '}
              <strong>
                {frontIsDuplicated.map((card, i) => (
                  <span
                    key={i}
                    onClick={() => showCardDialog(card)}
                    css={css`
                      cursor: pointer;

                      &:after {
                        content: ", ";
                      }

                      &:last-of-type:after {
                        content: "";
                      }
                    `}
                  >
                    {card.front.length > 30
                      ? `${card.front.substr(0, 30)}...`
                      : card.front}
                  </span>
                ))}
              </strong>
            </Warn>
          )}
          {backIsDuplicated.length > 0 && (
            <Warn>
              Duplicated back text:{' '}
              <strong>
                {backIsDuplicated.map((card, i) => (
                  <span
                    key={i}
                    onClick={() => showCardDialog(card)}
                    css={css`
                      cursor: pointer;

                      &:after {
                        content: ",";
                      }

                      &:last-of-type:after {
                        content: "";
                      }
                    `}
                  >
                    {card.back.length > 30
                      ? `${card.back.substr(0, 30)}...`
                      : card.back}
                  </span>
                ))}
              </strong>
            </Warn>
          )}
          {importError && (
            <Warn>
              <strong>{importError}</strong>
            </Warn>
          )}
          <AddCardsButtonsWrapper>
            <Button
              label="add card"
              color={colorSecondary}
              smallRound
              onClick={() => setShowAddCard(true)}
            />
            <Button
              label="Paste Cards"
              color={colorSecondary}
              smallRound
              onClick={importFromTranslate}
            />
          </AddCardsButtonsWrapper>
          <div css={bottomButtonsWrapperStyle}>
            <Button
              label="add"
              right
              disabled={cardsToAdd.length === 0}
              onClick={handleSaveCards}
            />
            <Button label="cancel" right onClick={handleClose} />
          </div>
        </div>
      </Modal>
      <AddNewCardModal
        show={showAddCard}
        handleAddCard={handleAddCard}
        handleClose={() => setShowAddCard(false)}
      />
      <EditCardModal
        show={showEditCard}
        card={cardsToAdd[editCardId]}
        cardId={editCardId.toString()}
        newCard
        handleUpdateCard={handleUpdateCard}
        handleClose={() => setShowEditCard(false)}
      />
    </>
  );
};

export default AddCardsModal;
