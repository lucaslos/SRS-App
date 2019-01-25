import * as React from 'react';
import styled from '@emotion/styled';
import ReviewGroup from 'components/ReviewGroup';
import { centerContent } from 'style/modifiers';

const Container = styled.div`
  ${centerContent}
  align-content: center;

  position: absolute;
  top: 108px;
  left: 0;
  right: 0;
  bottom: 0;

  flex-wrap: wrap;
  overflow-y: auto;

  padding-bottom: 72px;
`;

const CardsGroups = () => {


  return (
    <Container>
      <ReviewGroup label="Review 10" warn/>
      <ReviewGroup label="Review 20" warn/>
      <ReviewGroup label="Review All (x)" warn/>
      <ReviewGroup label="Review 10 New" />
      <ReviewGroup label="Review 20 New" />
      <ReviewGroup label="Review All New (x)" />
    </Container>
  );
};

export default CardsGroups;
