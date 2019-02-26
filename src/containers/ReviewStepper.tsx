import React from 'react';
import styled from '@emotion/styled';
import reviewState from 'state/review';
import css from '@emotion/css';
import { rectSize, circle } from 'style/mixins';
import { centerContent } from 'style/modifiers';
import Icon from 'components/Icon';
import { colorSecondaryDarker, colorPrimary } from 'style/theme';
import { mqMobile } from 'style/mediaQueries';
import { rgba } from 'polished';
import removeMd from 'remove-markdown';

type ReviewStepper = {
  numOfCards: number;
  pos: number;
  onBack: genericFunction;
  showBackButton: boolean;
  front: string;
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

  ${mqMobile} {
    bottom: 10px;
  }

  span {
    margin: 0 24px;
    font-family: 'Source Code Pro';
    color: ${colorPrimary};
  }
`;

function textToSpeech(text: string, lang = 'en-US') {
  const msg = new SpeechSynthesisUtterance();

  const voices = window.speechSynthesis.getVoices();
  const googleVoice = voices.find(
    voice => voice.voiceURI.includes('Google') && voice.lang === lang
  );

  if (googleVoice) msg.voice = googleVoice;
  msg.volume = 1; // 0 to 1
  msg.pitch = 1; // 0 to 2
  msg.text = removeMd(text);
  msg.lang = lang;

  speechSynthesis.speak(msg);
}

const ReviewStepper = ({
  numOfCards,
  pos,
  onBack,
  showBackButton,
  front,
}: ReviewStepper) => (
  <>
    <Container>
      <Button
        onClick={onBack}
        css={{ visibility: showBackButton ? 'visible' : 'hidden' }}
      >
        <Icon name="arrow-back" />
      </Button>
      <span>
        {pos}/{numOfCards}
      </span>
      <Button onClick={() => textToSpeech(front)}>
        <Icon name="sound" />
      </Button>
    </Container>
    <div
      css={css`
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        height: 4px;

        overflow: hidden;
      `}
    >
      <div
        css={css`
          position: absolute;
          height: 100%;
          width: 100%;
          left: -100%;
          background: ${rgba(colorPrimary, 0.5)};
          transition: 240ms;
        `}
        style={{ transform: `translate3d(${(pos / numOfCards) * 100}%, 0, 0)` }}
      />
    </div>
  </>
);

export default ReviewStepper;
