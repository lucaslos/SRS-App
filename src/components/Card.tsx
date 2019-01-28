import css from '@emotion/css';
import styled from '@emotion/styled';
import Icon from 'components/Icon';
import Notes from 'components/Notes';
import Tags from 'components/Tags';
import { rgba } from 'polished';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoToNextCard } from 'state/review';
import { circle } from 'style/mixins';
import { centerContent, centerContentCollum } from 'style/modifiers';
import { colorPrimary, colorRed, colorSecondaryDarker, colorSecondaryLigher, colorYellow } from 'style/theme';
import { useOnChange } from 'utils/customHooks';

type Props = {
  card: Card;
  pos: 'prev' | 'current' | 'next';
  setIsFlipped: (isFlipped: boolean) => void;
  isFlipped: boolean;
};

const zPos = {
  prev: '-500px',
  current: 0,
  next: '500px',
};

const faceStyle = css`
  ${centerContentCollum};

  position: absolute;
  width: 430px;
  max-height: 100%;
  backface-visibility: hidden;

  background-color: ${colorSecondaryLigher};
  transform-style: preserve-3d;
  border-radius: 4px;

  transition: 360ms;

  cursor: pointer;

  * {
    backface-visibility: hidden;
  }
`;

const FrontFace = styled.div<{ flipped: boolean; pos: Props['pos'] }>`
  ${faceStyle}

  transform: translate3d(0, 0, ${props => zPos[props.pos]})
    rotateX(${props => (props.flipped ? 180 : 0)}deg);
  opacity: ${props => (zPos[props.pos] === 0 ? 1 : 0)};
`;

const BackFace = styled.div<{ flipped: boolean; pos: Props['pos'] }>`
  ${faceStyle};

  transform: translate3d(0, 0, ${props => zPos[props.pos]})
    rotateX(${props => (props.flipped ? 0 : -180)}deg);
  opacity: ${props => (props.flipped && zPos[props.pos] === 0 ? 1 : 0)};
  visibility: ${props => (props.flipped ? 'visible' : 'hidden')};
  cursor: auto;
`;

const CardFaceContent = styled.div`
  ${centerContentCollum};

  width: 100%;

  font-size: 36px;
  font-weight: 300;
  min-height: 150px;
  text-align: center;
  margin-bottom: 12px;

  img {
    width: 100%;
  }

  p {
    width: 100%;
    margin: 0;
    padding: 8px;
  }
`;

const NumOfAnswers = styled.div`
  margin-right: -5px;
  height: 10px;

  div {
    margin-right: 5px;
    ${circle(10)};
    border: 2px solid ${colorRed};
  }
`;

const TopIcons = styled.div`
  ${centerContent};
  height: 24px;
  margin-top: 12px;
  margin-bottom: 8px;
  margin-left: -16px;

  > * {
    margin-left: 16px;
  }
`;

const BottomButtons = styled.div`
  width: 100%;
  height: 60px;
  margin-top: 8px;
  margin-bottom: 8px;
  /* padding: 8px; */
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  div {
    height: 60px;
    ${centerContent};
    flex-grow: 3;
    margin: 0 8px;
    border-radius: 4px;

    cursor: pointer;
    transition: 240ms ease-out;

    svg {
      transition: 240ms ease-out;
    }

    &:hover {
      background-color: ${rgba(colorSecondaryDarker, 0.25)};
    }

    &:hover svg {
      transform: scale(1.16);
    }
  }
`;

const Card = ({ card, pos, setIsFlipped, isFlipped }: Props) => {
  const words = card.back.split(';');

  const WarnIcon = card.wrongReviews > 4 ? (
    <Icon name="warn" color={colorRed} size={24} />
    ) : (
      undefined
    );

  return (
    <>
      <FrontFace flipped={isFlipped} pos={pos} onClick={() => setIsFlipped(true)}>
        <TopIcons>
          {words.length > 1 && (
            <NumOfAnswers>
              {words.map((word, i) => (
                <div key={i} />
              ))}
            </NumOfAnswers>
          )}
          {WarnIcon}
        </TopIcons>
        <CardFaceContent>
          <ReactMarkdown source={card.front} />
        </CardFaceContent>
        <Tags tags={card.tags} />
      </FrontFace>

      <BackFace flipped={isFlipped} pos={pos} onClick={() => {}}>
        <TopIcons>{WarnIcon}</TopIcons>
        <CardFaceContent>
          <ReactMarkdown source={card.back} />
        </CardFaceContent>
        {card.notes && card.notes.length > 0 && <Notes notes={card.notes} />}
        <BottomButtons>
          <div onClick={() => GoToNextCard('wrong', card.id)}>
            <Icon name="close" color={colorRed} />
          </div>
          <div onClick={() => GoToNextCard('hard', card.id)}>
            <Icon name="check" color={colorYellow} />
          </div>
          <div onClick={() => GoToNextCard('success', card.id)}>
            <Icon name="double-check" color={colorPrimary} />
          </div>
        </BottomButtons>
      </BackFace>
    </>
  );
};

export default Card;
