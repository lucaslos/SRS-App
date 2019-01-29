import styled from '@emotion/styled';
import Button from 'components/Button';
import Modal, {
  bottomButtonsWrapperStyle,
  BoxCloseButton,
  boxStyle,
} from 'components/Modal';
import AddNewCardModal from 'containers/AddNewCardModal';
import React, { useState } from 'react';
import modalsState from 'state/modals';
import reviewState from 'state/review';
import { centerContent } from 'style/modifiers';
import { colorSecondary } from 'style/theme';
import CardTile, { TilesWrapper } from 'components/CardTile';
import EditCardModal from 'containers/EditCardModal';
import { replaceAt } from 'utils/genericUtils';
import cardsState, { pushNewCards } from 'state/cards';

const AddCardsButtonsWrapper = styled.div`
  ${centerContent};
  padding: 8px;

  width: 100%;

  .button {
    margin: 8px;
  }
`;

const AddCardsModal = () => {
  const [show, setShow] = modalsState.useStore('addCards');
  const [cardsToAdd, setCardsToAdd] = useState<Card[]>([]);
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const [showEditCard, setShowEditCard] = useState<boolean>(false);
  const [editCardId, setEditCardId] = useState<number>(0);

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

  return (
    <>
      <Modal active={show}>
        <div css={boxStyle}>
          <h1>Add {cardsToAdd.length || ''} card{cardsToAdd.length === 1 ? '' : 's'}</h1>
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
          <AddCardsButtonsWrapper>
            <Button
              label="add card"
              smallRound
              onClick={() => setShowAddCard(true)}
            />
            <Button label="paste cards" smallRound onClick={handleClose} />
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
