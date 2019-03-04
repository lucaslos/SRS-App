import React from 'react';
import styled from '@emotion/styled';
import { getCoF, getNextDayToReview } from 'utils/srsAlgo';
import { timeToDate, timeToDateBr } from 'utils/genericUtils';
import { colorPrimary, fontPrimary, colorSecondary } from 'style/theme';
import { centerContent } from 'style/modifiers';
import { css } from '@emotion/core';

type Props = {
  cards: Card[];
};

const Container = styled.div`
  ${centerContent};
  position: absolute;
  top: 66px;
  left: 16px;
  right: 16px;
  bottom: 0;
`;

const BarContainer = styled.div`
  height: 100%;
  flex-shrink: 0;
  width: 8px;
  position: relative;
  margin: 0 5px;
  /* float: left; */
  display: inline-block;

  font-size: 8px;
  font-weight: 400;
  letter-spacing: 1px;
  font-family: ${fontPrimary};
`;

const BarWrapper = styled.div`
  position: absolute;
  top: 24px;
  bottom: 44px;
  width: 100%;
  padding-bottom: 24px;
`;

const Bar = styled.div`
  ${centerContent};
  position: absolute;
  bottom: 0;
  width: 100%;
  background: ${colorPrimary};
  border-radius: 2px;
  border: 1px solid ${colorPrimary};

  /* color: #000; */
  text-align: center;
  letter-spacing: 0;
`;

const DateLabel = styled.div`
  position: absolute;
  bottom: 24px;
  left: -2px;
  transform: rotate(45deg);
`;

const NextDaysGraph = ({ cards }: Props) => {
  const daysLimit = 50;

  const days: { date: string; cards: number }[] = Array(daysLimit).fill(0);
  let maxCardInADay = 0;
  let cardsBefore = 0;

  for (let i = 0; i < daysLimit; i++) {
    const now = Date.now();

    const cardsInTheDay = cards.filter(card => getCoF(card.repetitions, card.diff, card.lastReview, 3600 * 24 * (i + 1) * 1000) >= 1)
      .length - cardsBefore;

    cardsBefore += cardsInTheDay;

    if (maxCardInADay < cardsInTheDay) maxCardInADay = cardsInTheDay;

    days[i] = {
      date: timeToDateBr(now / 1000 + i * 60 * 60 * 24),
      cards: cardsInTheDay,
    };
  }

  return (
    <Container>
      <div
        css={css`
          position: absolute;
          height: 100%;
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
        `}
      >
        {days.map((day, i) => (
          <BarContainer key={day.date}>
            <BarWrapper>
              <Bar
                title={`${day.date} - ${day.cards}`}
                style={{ height: `${(day.cards / maxCardInADay) * 100}%` }}
              >
                <span style={{ position: 'absolute', top: '-12px' }}>
                  {day.cards || ''}
                </span>
              </Bar>
            </BarWrapper>
            {i % 2 === 0 && <DateLabel>{day.date.substr(0, 5)}</DateLabel>}
          </BarContainer>
        ))}
      </div>
    </Container>
  );
};

export default NextDaysGraph;
