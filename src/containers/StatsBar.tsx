import * as React from 'react';
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

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const Container = styled.div`
  ${centerContent};
  position: absolute;
  height: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: ${fontDecorative};
  font-size: 18px;
  font-weight: 300;
  color: ${colorPrimary};

  background: ${rgba(colorSecondaryLigher, 0.9)};

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
      margin: 0 6px;
    }
  }
`;

const StatsBar = () => {
  const [cards] = cardsState.useStore('cards');

  let cardsPrevisionNextDay = 0;
  let cardsPrevisionNext2Days = 0;
  cards.forEach(card => {
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
  });

  const oneMonthBeforeTimestamp = Date.now() - 2592000000;
  const cardsAddPerWeek = Math.round(
    cards.filter(
      card =>
        card.createdAt &&
        card.repetitions &&
        card.createdAt > oneMonthBeforeTimestamp
    ).length / 4.34
  );

  const today = new Date();

  return (
    <Container>
      <span>
        Cards <b>{cards.length}</b>
      </span>
      <div />
      <span>
        Add per week <b>{cardsAddPerWeek}</b>
      </span>
      <div />
      <span>
        {daysOfWeek[(today.getDay() + 1) % 7]} <b>{cardsPrevisionNextDay}</b>{' '}
        {daysOfWeek[(today.getDay() + 2) % 7]} <b>{cardsPrevisionNext2Days}</b>
      </span>
    </Container>
  );
};

export default StatsBar;
