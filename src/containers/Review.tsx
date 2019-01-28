import styled from '@emotion/styled';
import Card from 'components/Card';
import Modal from 'components/Modal';
import ReviewStepper from 'containers/ReviewStepper';
import React, { useState } from 'react';
import modalsState from 'state/modals';
import reviewState from 'state/review';
import { centerContent } from 'style/modifiers';
import { replaceAt } from 'utils/genericUtils';
import { useOnChange } from 'utils/customHooks';

const CardsContainer = styled.div`
  ${centerContent};

  position: absolute;
  top: 0;
  bottom: 82px;
  right: 0;
  left: 0;

  perspective: 500px;
  /* transform-style: preserve-3d; */
  overflow: hidden;
`;

const Review = () => {
  const [reviewDialog] = modalsState.useStore('reviewDialog');
  const [cards] = reviewState.useStore('reviewCards');
  const [reviewAgain] = reviewState.useStore('reviewAgain');
  const [reviewEnded] = reviewState.useStore('ended');
  const [reviewPos, setReviewPos] = reviewState.useStore('reviewPos');
  const [cardsIsFlipped, setCardsIsFlipped] = useState<boolean[]>([]);

  const reviewAgainCards = reviewAgain.map(id =>
    cards.find(card => id === card.id)
  ) as Card[];

  const allCards = [...cards, ...reviewAgainCards];

  function setIsFlipped(pos: typeof reviewPos, isFlipped: boolean) {
    setCardsIsFlipped(replaceAt(cardsIsFlipped, pos, isFlipped));
  }

  function handleBack() {
    if (cardsIsFlipped[reviewPos]) {
      setIsFlipped(reviewPos, false);
    } else {
      setIsFlipped(reviewPos - 1, false);
      setIsFlipped(reviewPos + 1, false);
      reviewState.dispatch('goToPrev');
    }
  }

  useOnChange(reviewPos, () => {
    if (reviewPos === 0) {
      setCardsIsFlipped([false]);
    }
  });

  return (
    <Modal
      active={reviewPos >= 0 && !reviewEnded}
      handleClose={() => setReviewPos(-1)}
    >
      <CardsContainer>
        {(reviewDialog || reviewPos > -1) &&
          allCards.map((card, i) => {
            const props = {
              key: card.id,
              card,
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
      />
    </Modal>
  );
};

export default Review;
