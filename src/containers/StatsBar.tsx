import styled from '@emotion/styled';
import {
  colorSecondaryLigher,
  fontDecorative,
  colorPrimary,
  fontSecondary,
} from 'style/theme';
import { rgba } from 'polished';
import cardsState from 'state/cards';
import { centerContent } from 'style/modifiers';
import { calcCardsCoF, getCoF, needsReview } from 'utils/srsAlgo';
import { mqMobile } from 'style/mediaQueries';
import NextDaysGraph from 'components/NextDaysGraph';
import React, { useState } from 'react';

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const Container = styled.div`
  position: absolute;
  height: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: ${fontDecorative};
  font-size: 18px;
  font-weight: 300;
  color: ${colorPrimary};

  transition: 240ms ease-out;

  background: ${rgba(colorSecondaryLigher, 0.9)};
`;

const StatsWrapper = styled.div`
  ${centerContent};
  width: 100%;
  height: 60px;

  ${mqMobile} {
    font-size: 14px;
    font-family: ${fontSecondary};
    letter-spacing: 1px;
  }

  div {
    width: 1.5px;
    height: 24px;

    display: inline-block;
    background-color: ${colorPrimary};
    margin: 0 20px;
    opacity: 0.5;

    ${mqMobile} {
      margin: 0 10px;
    }
  }
`;

const StatsBar = () => {
  const [cards] = cardsState.useStore('cards');

  let cardsPrevisionNextDay = 0;
  let cardsPrevisionNext2Days = 0;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    const cofToday = getCoF(
      card.repetitions,
      card.diff,
      card.lastReview,
    );

    if (cofToday >= 1) continue;

    const cofTom = getCoF(
      card.repetitions,
      card.diff,
      card.lastReview,
      3600 * 24 * 1 * 1000
    );

    if (cofTom >= 1) {
      cardsPrevisionNextDay++;
    } else {
      const cofAfterTom = getCoF(
        card.repetitions,
        card.diff,
        card.lastReview,
        3600 * 24 * 2 * 1000
      );

      if (cofAfterTom >= 1) {
        cardsPrevisionNext2Days++;
      }
    }
  }

  const oneMonthBeforeTimestamp = Date.now() - 2592000000;
  const cardsAddPerWeek = cards.filter(
    card =>
      card.createdAt &&
      card.repetitions &&
      card.createdAt > oneMonthBeforeTimestamp
  ).length;

  const today = new Date();

  const [showGraph, setShowGraph] = useState(false);

  return (
    <Container css={{ height: showGraph ? 320 : undefined }}>
      <StatsWrapper>
        <span>
          Cards <b>{cards.length}</b>
        </span>
        <div />
        <span title={cardsAddPerWeek.toFixed(2)}>
          Add per week <b>{Math.round(cardsAddPerWeek / 4.34)}</b>
        </span>
        <div />
        <span css={{ cursor: 'pointer' }} onClick={() => setShowGraph(!showGraph)}>
          {daysOfWeek[(today.getDay() + 1) % 7]} <b>{cardsPrevisionNextDay}</b>{' '}
          {daysOfWeek[(today.getDay() + 2) % 7]} <b>{cardsPrevisionNext2Days}</b>
        </span>
      </StatsWrapper>
      {showGraph && <NextDaysGraph cards={cards} />}
    </Container>
  );
};

export default StatsBar;
