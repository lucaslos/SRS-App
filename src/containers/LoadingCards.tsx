import React from 'react';
import styled from '@emotion/styled';
import cardsState from 'state/cards';
import { fillContainer, centerContent } from 'style/modifiers';
import { colorSecondary, fontDecorative, colorPrimary } from 'style/theme';
import { rgba } from 'polished';

const Loading = styled.div<{ show: boolean }>`
  ${fillContainer};
  ${centerContent};
  background-color: ${rgba(colorSecondary, 0.8)};
  text-align: center;
  padding-top: 24px;
  font-size: 24px;

  font-family: ${fontDecorative};
  color: ${colorPrimary};

  transition: 240ms;

  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
`;

const LoadingCards = () => {
  const [isLoading] = cardsState.useStore('waitingForUpdate');

  return (
    <Loading show={isLoading}>
      <span>Loading Cards...</span>
    </Loading>
  );
};

export default LoadingCards;
