import styled from '@emotion/styled';
import Card from 'components/Card';
import DeleteCardModal from 'components/DeleteCardModal';
import Icon from 'components/Icon';
import Modal, { TopButton } from 'components/Modal';
import ReviewMenu from 'components/ReviewMenu';
import EditCardModal from 'containers/EditCardModal';
import ReviewStepper from 'containers/ReviewStepper';
import React, { useState } from 'react';
import { getCardById } from 'state/cards';
import modalsState from 'state/modals';
import reviewState, { GoToNextCard } from 'state/review';
import { centerContent } from 'style/modifiers';
import { colorPrimary } from 'style/theme';
import { useOnChange } from 'utils/customHooks';
import { replaceAt } from 'utils/genericUtils';
import { mqMobile } from 'style/mediaQueries';

const CardsContainer = styled.div`
  ${centerContent};

  position: absolute;
  top: 50px;
  bottom: 82px;
  right: 0;
  left: 0;

  transition: opacity 240ms;

  ${mqMobile} {
    bottom: 62px;
  }

  perspective: 500px;
  /* transform-style: preserve-3d; */
  overflow: hidden;
`;

const Review = () => {
  const [reviewDialog] = modalsState.useStore('reviewDialog');
  const [cards, setReviewCards] = reviewState.useStore('reviewCards');
  const [reviewAgain, setCardsToReviewAgain] = reviewState.useStore('reviewAgain');
  const [reviewEnded] = reviewState.useStore('ended');
  const [cardsToDelete, setCardsToDelete] = reviewState.useStore('cardsToDelete');
  const [reviewPos, setReviewPos] = reviewState.useStore('reviewPos');
  const [cardsIsFlipped, setCardsIsFlipped] = useState<boolean[]>([]);
  const [showEditCard, setShowEditCard] = useState(false);
  const [editCardId, setEditCardId] = useState<Card['id'] | false>(false);
  const [deleteCardId, setDeleteCardId] = useState<Card['id'] | false>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const reviewAgainCards = reviewAgain.map(id =>
    cards.find(card => id === card.id)
  ) as Card[];

  const allCards = [...cards, ...reviewAgainCards];

  function setIsFlipped(pos: typeof reviewPos, isFlipped: boolean) {
    setCardsIsFlipped(replaceAt(cardsIsFlipped, pos, isFlipped));
  }

  function handleBack() {
    if (!(reviewPos === 0 && !cardsIsFlipped[0])) {
      if (cardsIsFlipped[reviewPos]) {
        setIsFlipped(reviewPos, false);
      } else {
        reviewState.dispatch('goToPrev');
      }
    }
  }

  function showEditModal() {
    setShowMenu(false);
    setEditCardId(allCards[reviewPos].id);
    setShowEditCard(true);
  }

  function showDeleteConfimationDialog() {
    setShowMenu(false);
    setDeleteCardId(allCards[reviewPos].id);
    setShowDeleteDialog(true);
  }

  function handleUpdateCard(id: Card['id'], updatedCard: Card) {
    setEditCardId(false);
    setShowEditCard(false);
    setReviewCards(cards.map(card => (card.id === id ? updatedCard : card)));
  }

  function handleDeleteCard() {
    if (deleteCardId !== false) {
      setDeleteCardId(false);
      setShowDeleteDialog(false);
      setReviewCards(cards.filter(card => card.id !== deleteCardId));

      setCardsToDelete([...cardsToDelete, deleteCardId]);
      setCardsToReviewAgain(reviewAgain.filter(id => id !== deleteCardId));
    }
  }

  function goToNext(answer: Results, id: Card['id']) {
    GoToNextCard(answer, id);
    setCardsIsFlipped(Array(allCards.length).fill(false));
  }

  function handleAddTag(tag: string) {
    const cardId = allCards[reviewPos].id;
    const card = getCardById(cardId, cards);
    const cardPos = cards.findIndex(revCard => revCard.id === cardId);
    const newTags = [...(card.tags ? card.tags : []), tag];

    setReviewCards(
      replaceAt(cards, cardPos, {
        ...card,
        tags: newTags,
      })
    );
  }

  function handleRemoveTag(tag: string) {
    const cardId = allCards[reviewPos].id;
    const card = getCardById(cardId, cards);
    const cardPos = cards.findIndex(revCard => revCard.id === cardId);
    const newTags = card.tags!.filter(cardTag => cardTag !== tag);

    setReviewCards(
      replaceAt(cards, cardPos, {
        ...card,
        tags: newTags,
      })
    );
  }

  function handleAddNote(note: string) {
    const cardId = allCards[reviewPos].id;
    const card = getCardById(cardId, cards);
    const cardPos = cards.findIndex(revCard => revCard.id === cardId);
    const newNotes = [...(card.notes ? card.notes : []), note];

    setReviewCards(
      replaceAt(cards, cardPos, {
        ...card,
        notes: newNotes,
      })
    );
  }

  function handleAddImage(imgUrl: string) {
    const cardId = allCards[reviewPos].id;
    const card = getCardById(cardId, cards);
    const cardPos = cards.findIndex(revCard => revCard.id === cardId);

    setReviewCards(
      replaceAt(cards, cardPos, {
        ...card,
        back: `![](${imgUrl})\n${card.back}`,
      })
    );
  }

  const show = reviewPos >= 0 && !reviewEnded;

  useOnChange(show, () => {
    if (!show) {
      setCardsIsFlipped([]);
      setCardsToDelete([]);
      window.onbeforeunload = null;
    } else {
      window.onbeforeunload = () => ('Are you sure?');
    }
  });

  return (
    <>
      <Modal active={show} onClick={() => setShowMenu(false)}>
        <TopButton onClick={() => setReviewPos(-1)}>
          <Icon name="close" color={colorPrimary} />
        </TopButton>
        <CardsContainer>
          {(reviewDialog || reviewPos > -1) &&
            allCards.map((card, i) => {
              const props = {
                key: i,
                card,
                goToNext,
                handleAddNote,
                handleAddImage,
                setIsFlipped: (flipped: boolean) => setIsFlipped(i, flipped),
                isFlipped: cardsIsFlipped[i],
              };

              return i === reviewPos ? (
                <Card pos="current" {...props} />
              ) : i === reviewPos - 1 ? (
                <Card pos="prev" {...props} />
              ) : i === reviewPos + 1 ? (
                <Card pos="next" {...props} />
              ) : (
                undefined
              );
            })}
        </CardsContainer>
        <ReviewStepper
          numOfCards={allCards.length}
          pos={reviewPos + 1}
          showBackButton={cardsIsFlipped[reviewPos] || reviewPos > 0}
          onBack={handleBack}
          front={allCards[reviewPos] && allCards[reviewPos].front}
        />
      </Modal>
      {show && (
        <>
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
          <ReviewMenu
            show={showMenu}
            card={allCards[reviewPos]}
            flipped={cardsIsFlipped[reviewPos]}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            onClickEdit={showEditModal}
            onClickDelete={showDeleteConfimationDialog}
          />
          <TopButton
            css={{ right: 'auto', left: 20, backgroundColor: 'transparent', [mqMobile]: { left: 10 } }}
            onClick={() => setShowMenu(!showMenu)}
          >
            <Icon
              name={showMenu ? 'keyboard-arrow-up' : 'more-vert'}
              color={colorPrimary}
            />
          </TopButton>
          <DeleteCardModal
            cardId={
              deleteCardId !== false
                ? getCardById(deleteCardId, cards).front
                : ''
            }
            onClose={() => setShowDeleteDialog(false)}
            onDelete={handleDeleteCard}
            show={show && showDeleteDialog}
          />
        </>
      )}
    </>
  );
};

export default Review;
