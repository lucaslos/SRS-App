import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import Modal, { boxStyle, BoxCloseButton, inputsRowWrapperStyle } from 'components/Modal';
import modalsState from 'state/modals';
import CardTile, { TilesWrapper } from 'components/CardTile';
import cardsState, { pushUpdateCard, getCardById, pushDeleteCard } from 'state/cards';
import EditCardModal from 'containers/EditCardModal';
import { useOnChange } from 'utils/customHooks';
import { centerContent } from 'style/modifiers';
import { colorPrimary } from 'style/theme';
import { rgba } from 'polished';
import TextField from 'components/TextField';
import DeleteCardModal from 'components/DeleteCardModal';

type Props = {};

const CardsList = () => {
  const [show, setShow] = modalsState.useStore('cardsList');
  const [cards] = cardsState.useStore('cards');
  const [showEditCard, setShowEditCard] = useState(false);
  const [editCardId, setEditCardId] = useState<Card['id'] | false>(false);
  const [searchLimit, setSearchLimit] = useState(30);
  const [deleteCardId, setDeleteCardId] = useState<Card['id'] | false>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [query, setQuery] = useState<string>('@all');

  useOnChange(show, () => {
    if (!show) {
      setSearchLimit(30);
      setQuery('@all');
    }
  });

  function handleUpdateCard(id: string, card: Card) {
    setEditCardId(false);
    setShowEditCard(false);
    pushUpdateCard(card);
  }

  function handleDeleteCard() {
    if (deleteCardId !== false) {
      setDeleteCardId(false);
      setShowDeleteDialog(false);
      pushDeleteCard(deleteCardId);
    }
  }

  function showEditModal(id: Card['id']) {
    setEditCardId(id);
    setShowEditCard(true);
  }

  function showDeleteConfimationDialog(id: Card['id']) {
    setDeleteCardId(id);
    setShowDeleteDialog(true);
  }

  const LoadMoreButton = styled.div`
    padding: 12px 0;
    ${centerContent};

    border: 1px solid ${colorPrimary};
    border-radius: 4px;
    color: ${colorPrimary};
    font-weight: 300;

    cursor: pointer;
    transition: 240ms;

    &:hover {
      background: ${rgba(colorPrimary, 0.1)};
    }
  `;

  const queryRegex = new RegExp(query);

  const cardsResult = useMemo(
    () =>
      cards
        .filter(
          card =>
            show &&
            (query === '@all'
              || JSON.stringify([
                card.front,
                card.back,
              ]).match(queryRegex))
        ),
    [query, cards, show, searchLimit, queryRegex]
  );

  return (
    <>
      <Modal active={show} handleClose={() => setShow(false)}>
        <div css={boxStyle}>
          <h1>Search Cards</h1>
          <div css={inputsRowWrapperStyle}>
            <TextField
              value={query}
              label="Search"
              usePlaceholder
              handleChange={(value) => setQuery(value as string)}
            />
          </div>
          <TilesWrapper css={{ marginBottom: 16 }}>
            {cardsResult.slice(0, searchLimit).map((card, i) => (
              <CardTile
                key={i}
                front={card.front}
                back={card.back}
                onClick={() => showEditModal(card.id)}
                onDelete={() => showDeleteConfimationDialog(card.id)}
              />
            ))}
            {cardsResult.length > 0 && cardsResult.length > searchLimit && (
              <LoadMoreButton onClick={() => setSearchLimit(searchLimit + 30)}>
                Load more 30
              </LoadMoreButton>
            )}
          </TilesWrapper>
        </div>
      </Modal>
      <EditCardModal
        show={showEditCard}
        card={show && editCardId !== false && cards.find(card => card.id === editCardId)}
        cardId={editCardId}
        newCard
        handleUpdateCard={handleUpdateCard}
        handleClose={() => setShowEditCard(false)}
      />
      <DeleteCardModal
        cardId={deleteCardId !== false ? getCardById(deleteCardId, cards).front : ''}
        onClose={() => setShowDeleteDialog(false)}
        onDelete={handleDeleteCard}
        show={show && showDeleteDialog}
      />
    </>
  );
};

export default CardsList;
