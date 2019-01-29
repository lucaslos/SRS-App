import React from 'react';
import styled from '@emotion/styled';
import reviewState from 'state/review';
import css from '@emotion/css';
import { rectSize, circle } from 'style/mixins';
import { centerContent } from 'style/modifiers';
import Icon from 'components/Icon';
import { colorSecondaryDarker, colorPrimary } from 'style/theme';

type ReviewStepper = {
  numOfCards: number;
  pos: number;
  onBack: genericFunction;
  showBackButton: boolean;
};

const Button = styled.div`
  ${circle(54)};
  ${centerContent};

  cursor: pointer;

  &:hover {
    background-color: ${colorSecondaryDarker};
  }
`;

const Container = styled.div`
  ${centerContent};

  position: absolute;
  bottom: 24px;
  font-size: 24px;
  letter-spacing: 6px;

  span {
    margin: 0 24px;
    font-family: 'Source Code Pro';
    color: ${colorPrimary};
  }
`;

const ReviewStepper = ({ numOfCards, pos, onBack, showBackButton }: ReviewStepper) => (
  <Container>
    <Button onClick={onBack}>
      {showBackButton && (
        <Icon name="arrow-back" />
      )}
    </Button>
    <span>
      {pos}/{numOfCards}
    </span>
    <Button>
      <Icon name="sound" />
    </Button>
  </Container>
);

export default ReviewStepper;
