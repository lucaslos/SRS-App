import * as React from 'react';
import styled from '@emotion/styled';
import ReviewGroup from 'components/ReviewGroup';
import { centerContent } from 'style/modifiers';
import { useStore } from 'lib/hookstore';
import { calcCardsCoF } from 'utils/srsAlgo';

const Container = styled.div`
  position: absolute;
  top: 108px;
  left: 0;
  right: 0;
  bottom: 0;

  overflow-y: auto;

  padding-bottom: 72px;
`;

const GroupsContainer = styled.div`
  ${centerContent};
  align-content: center;
  flex-wrap: wrap;
`;

const CardsGroups = () => {
  const [cards] = useStore('cards', 'cards');

  const [reviewedCards, newCards] = calcCardsCoF(cards);

  const needsReview = reviewedCards.filter(card => card.cof >= 1);

  return (
    <Container>
      <GroupsContainer>
        {needsReview.length > 10 && <ReviewGroup label="Review 10" warn />}
        {needsReview.length > 20 && <ReviewGroup label="Review 20" warn />}
        {needsReview.length > 30 && <ReviewGroup label="Review 30" warn />}
        {needsReview.length > 0 && (
          <ReviewGroup label={`Review All (${needsReview.length})`} warn />
        )}
        {newCards.length > 10 && <ReviewGroup label="Review 10 New" />}
        {newCards.length > 20 && <ReviewGroup label="Review 20 New" />}
        {newCards.length > 30 && <ReviewGroup label="Review 30 New" />}
        {newCards.length > 0 && (
          <ReviewGroup label={`Review All New (${newCards.length})`} />
        )}
      </GroupsContainer>
    </Container>
  );
};

export default CardsGroups;
