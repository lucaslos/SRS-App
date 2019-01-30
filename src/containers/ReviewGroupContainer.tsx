import styled from '@emotion/styled';
import ReviewGroup from 'components/ReviewGroup';
import * as React from 'react';
import cardsState from 'state/cards';
import { showReviewDialog } from 'state/review';
import { centerContent } from 'style/modifiers';
import { calcCardsCoF, needsReview } from 'utils/srsAlgo';
import { mqMobile } from 'style/mediaQueries';

const Container = styled.div`
  position: absolute;
  top: 108px;
  left: 0;
  right: 0;
  bottom: 0;

  overflow-y: auto;

  padding-bottom: 72px;

  ${mqMobile} {
    top: 76px;
  }
`;

const GroupsContainer = styled.div`
  ${centerContent};
  align-content: center;
  flex-wrap: wrap;
`;

const CardsGroups = () => {
  const [cards] = cardsState.useStore('cards');

  const [reviewedCards, newCards] = calcCardsCoF(cards);

  const cardsNeedsReview = reviewedCards.filter(card => needsReview(card.cof));

  return (
    <Container>
      <GroupsContainer>
        {cardsNeedsReview.length > 10 && (
          <ReviewGroup
            label="Review 10"
            warn
            handleClick={() => showReviewDialog(10)}
          />
        )}
        {cardsNeedsReview.length > 20 && (
          <ReviewGroup
            label="Review 20"
            warn
            handleClick={() => showReviewDialog(20)}
          />
        )}
        {cardsNeedsReview.length > 30 && (
          <ReviewGroup
            label="Review 30"
            warn
            handleClick={() => showReviewDialog(30)}
          />
        )}
        {cardsNeedsReview.length > 0 && (
          <ReviewGroup
            label={`Review All (${cardsNeedsReview.length})`}
            warn
            handleClick={() => showReviewDialog(cardsNeedsReview.length)}
          />
        )}
        {/* new cards */}
        {newCards.length > 10 && (
          <ReviewGroup
            label="Review 10 New"
            handleClick={() => showReviewDialog(10, true)}
          />
        )}
        {newCards.length > 20 && (
          <ReviewGroup
            label="Review 20 New"
            handleClick={() => showReviewDialog(20, true)}
          />
        )}
        {newCards.length > 30 && (
          <ReviewGroup
            label="Review 30 New"
            handleClick={() => showReviewDialog(30, true)}
          />
        )}
        {newCards.length > 0 && (
          <ReviewGroup
            label={`Review All New (${newCards.length})`}
            handleClick={() => showReviewDialog(newCards.length, true)}
          />
        )}
      </GroupsContainer>
    </Container>
  );
};

export default CardsGroups;
