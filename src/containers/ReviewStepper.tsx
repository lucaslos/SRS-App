import React from 'react';
import styled from '@emotion/styled';
import reviewState from 'state/review';
import css from '@emotion/css';
import { rectSize, circle } from 'style/mixins';
import { centerContent } from 'style/modifiers';
import Icon from 'components/Icon';
import { colorSecondaryDarker, colorPrimary } from 'style/theme';
import { mqMobile } from 'style/mediaQueries';

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
  msg.voice = voices.find(
    voice => voice.voiceURI.includes('Google') && voice.lang === lang
  ) as SpeechSynthesisVoice; // Note: some voices don't support altering params
  msg.volume = 1; // 0 to 1

  msg.pitch = 1; // 0 to 2
  msg.text = text;
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
  <Container>
    <Button onClick={onBack}>
      {showBackButton && <Icon name="arrow-back" />}
    </Button>
    <span>
      {pos}/{numOfCards}
    </span>
    <Button onClick={() => textToSpeech(front)}>
      <Icon name="sound" />
    </Button>
  </Container>
);

export default ReviewStepper;
