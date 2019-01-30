import css from '@emotion/css';
import styled from '@emotion/styled';
import Icon from 'components/Icon';
import Notes from 'components/Notes';
import CardTags from 'components/CardTags';
import { rgba } from 'polished';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { circle } from 'style/mixins';
import { centerContent, centerContentCollum } from 'style/modifiers';
import {
  colorPrimary,
  colorRed,
  colorSecondaryDarker,
  colorSecondaryLigher,
  colorYellow,
} from 'style/theme';
import { useOnChange } from 'utils/customHooks';

type Props = {
  card: Card;
  pos: 'prev' | 'current' | 'next';
  setIsFlipped: (isFlipped: boolean) => void;
  isFlipped: boolean;
  goToNext: (anwser: Results, id: Card['id']) => void;
  handleAddNote: (note: string) => void;
  handleAddImage: (imgUrl: string) => void;
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
    ${circle(10)};
    margin-right: 5px;
    float: right;
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

const Card = ({
  card,
  pos,
  setIsFlipped,
  isFlipped,
  goToNext,
  handleAddNote,
  handleAddImage,
}: Props) => {
  const words = card.back.split(';');

  const WarnIcon = card.wrongReviews > 4 ? (
    <Icon name="warn" color={colorRed} size={24} />
    ) : (
      undefined
    );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();

    if (e.dataTransfer.types.includes('text/plain')) {
      if (
        e.dataTransfer.getData('Text').match(/(\.png|\.jpg|\.jpeg|\.gif)$/g)
      ) {
        // add img
        handleAddNote(e.dataTransfer.getData('Text'));
      } else {
        // add note
        handleAddImage(e.dataTransfer.getData('Text'));
      }
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy';
  }

  return (
    <>
      <FrontFace
        flipped={isFlipped}
        pos={pos}
        onClick={() => setIsFlipped(true)}
      >
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
        <CardTags tags={card.tags} />
      </FrontFace>

      <BackFace
        flipped={isFlipped}
        pos={pos}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <TopIcons>{WarnIcon}</TopIcons>
        <CardFaceContent>
          <ReactMarkdown source={card.back} />
        </CardFaceContent>
        {card.notes && card.notes.length > 0 && <Notes notes={card.notes} />}
        <BottomButtons>
          <div onClick={() => goToNext('wrong', card.id)}>
            <Icon name="close" color={colorRed} />
          </div>
          <div onClick={() => goToNext('hard', card.id)}>
            <Icon name="check" color={colorYellow} />
          </div>
          <div onClick={() => goToNext('success', card.id)}>
            <Icon name="double-check" color={colorPrimary} />
          </div>
        </BottomButtons>
      </BackFace>
    </>
  );
};

export default Card;
