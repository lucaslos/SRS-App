import React, { useState } from 'react';
import styled from '@emotion/styled';
import Modal from 'components/Modal';
import Card from 'components/Card';
import { useStore } from 'lib/hookstore';
import { fillContainer, centerContent } from 'style/modifiers';
import ReviewStepper from 'containers/ReviewStepper';
import cardsState from 'state/cards';
import reviewState from 'state/review';
import modalsState from 'state/modals';
import { all } from 'q';

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

  const reviewAgainCards = reviewAgain.map(id => cards.find(card => id === card.id)) as Card[];

  const allCards = [...cards, ...reviewAgainCards];

  return (
    <Modal active={reviewPos >= 0 && !reviewEnded} handleClose={() => setReviewPos(-1)}>
      <CardsContainer>
        {(reviewDialog || reviewPos > -1) &&
          allCards.map((card, i) =>
            (i === reviewPos ? (
              <Card key={card.id} card={card} pos="current" />
            ) : i === reviewPos - 1 ? (
              <Card key={card.id} card={card} pos="prev" />
            ) : i === reviewPos + 1 ? (
              <Card key={card.id} card={card} pos="next" />
            ) : (
              undefined
            ))
          )}
      </CardsContainer>
      <ReviewStepper numOfCards={allCards.length} pos={reviewPos + 1} />
    </Modal>
  );
};

export default Review;
