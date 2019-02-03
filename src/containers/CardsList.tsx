import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import Modal, {
  boxStyle,
  BoxCloseButton,
  inputsRowWrapperStyle,
} from 'components/Modal';
import modalsState from 'state/modals';
import CardTile, { TilesWrapper } from 'components/CardTile';
import cardsState, {
  pushUpdateCard,
  getCardById,
  pushDeleteCard,
} from 'state/cards';
import EditCardModal from 'containers/EditCardModal';
import { useOnChange, useThrottle } from 'utils/customHooks';
import { centerContent } from 'style/modifiers';
import { colorPrimary, fontDecorative } from 'style/theme';
import { rgba } from 'polished';
import TextField from 'components/TextField';
import DeleteCardModal from 'components/DeleteCardModal';
import css from '@emotion/css';

type Props = {};

const defaultQuery = '@sort-last @all';

const CardsList = () => {
  const [show, setShow] = modalsState.useStore('cardsList');
  const [cards] = cardsState.useStore('cards');
  const [showEditCard, setShowEditCard] = useState(false);
  const [editCardId, setEditCardId] = useState<Card['id'] | false>(false);
  const [searchLimit, setSearchLimit] = useState(30);
  const [deleteCardId, setDeleteCardId] = useState<Card['id'] | false>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [query, setQuery] = useState<string>(defaultQuery);

  useOnChange(show, () => {
    if (!show) {
      setSearchLimit(30);
      setQuery(defaultQuery);
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
    console.log(getCardById(id, cards));
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

  const throttledQuery = useThrottle(query, 1000);

  const queryString = throttledQuery
    .replace(/@new|@sort-last|@showBack|@dupli-front|@dupli-back|@not-new/g, '')
    .trim();
  const queryRegex = new RegExp(queryString, 'i');
  const sortByLast = throttledQuery.match('@sort-last');
  const showAll = throttledQuery.match('@all');
  const newOnly = throttledQuery.match('@new');
  const notNew = throttledQuery.match('@not-new');
  const showBack = throttledQuery.match('@show-back');
  const filterDuplicatedFront = throttledQuery.match('@dupli-front');
  const filterDuplicatedBack = throttledQuery.match('@dupli-back');
  const searchTags = '@all @new @show-back @sort-last @dupli-front @dupli-back @not-new';

  const cardsResult = useMemo(
    () =>
      (show
        ? cards
            .filter(card => {
              const isNotNew = notNew ? card.lastReview : true;

              const isNew = newOnly ? !card.lastReview : true;

              const frontIsDuplicated = filterDuplicatedFront
                ? cards.some(
                    cardToCheck =>
                      card.id !== cardToCheck.id &&
                      cardToCheck.front.trim() === card.front.trim()
                  )
                : true;

              const backIsDuplicated = filterDuplicatedBack
                ? cards.some(
                    cardToCheck =>
                      card.id !== cardToCheck.id &&
                      cardToCheck.back.trim() === card.back.trim()
                  )
                : true;

              return (
                (showAll
                  || (throttledQuery &&
                    `-f=${card.front}-b=${card.back}-r=${card.repetitions}-lr=${
                      card.lastReview
                    }-t=${card.tags ? card.tags.join(',') : ''}-`.match(queryRegex))) &&
                isNew &&
                frontIsDuplicated &&
                backIsDuplicated &&
                isNotNew
              );
            })
            .sort((a, b) => {
              const aCreatedAt = a.createdAt || -1;
              const bCreatedAt = b.createdAt || -1;

              if (sortByLast) {
                return bCreatedAt - aCreatedAt;
              }

              return 0;
            })
        : []),
    [throttledQuery, cards, show, searchLimit]
  );

  return (
    <>
      <Modal active={show} handleClose={() => setShow(false)}>
        <div css={boxStyle}>
          <h1>
            Search Cards{' '}
            {cardsResult.length > 0
              ? `－ Results: ${cardsResult.length}`
              : undefined}
          </h1>
          <div
            css={css`
              padding: 0 24px;
              font-size: 12px;
              letter-spacing: 0.5px;
              width: 100%;
              font-weight: 300;
              margin-bottom: 8px;
              margin-top: -16px;
              color: #ddd;
            `}
          >
            Search Tags: {searchTags}
          </div>
          <div css={inputsRowWrapperStyle}>
            <TextField
              value={query}
              label="Type to search"
              usePlaceholder
              handleChange={value => setQuery(value as string)}
            />
          </div>
          <TilesWrapper css={{ marginBottom: 16 }}>
            {cardsResult.slice(0, searchLimit).map((card, i) => (
              <CardTile
                key={i}
                front={card.front}
                back={showBack ? card.back : '---'}
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
        card={
          show &&
          editCardId !== false &&
          cards.find(card => card.id === editCardId)
        }
        cardId={editCardId}
        newCard
        handleUpdateCard={handleUpdateCard}
        handleClose={() => setShowEditCard(false)}
      />
      <DeleteCardModal
        cardId={
          deleteCardId !== false ? getCardById(deleteCardId, cards).front : ''
        }
        onClose={() => setShowDeleteDialog(false)}
        onDelete={handleDeleteCard}
        show={show && showDeleteDialog}
      />
    </>
  );
};

export default CardsList;
