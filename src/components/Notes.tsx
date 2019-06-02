import React from 'react';
import styled from '@emotion/styled';
import { colorPrimary, colorSecondary } from 'style/theme';
import { rgba } from 'polished';
import { centerContent } from 'style/modifiers';
import textToSpeech from 'utils/textToSpeech';
import Icon from 'components/Icon';

type Notes = {
  notes?: string[];
};

const Container = styled.div`
  width: 100%;
  padding: 0 16px;
`;

const Note = styled.div`
  ${centerContent};
  text-align: center;
  margin-bottom: 6px;
  border-radius: 50px;
  padding: 8px;

  font-family: 'Source Sans Pro';
  font-style: italic;
  font-size: 14px;
  color: ${colorPrimary};
  background-color: ${rgba(colorSecondary, 0.6)};

  &:last-of-type {
    margin-bottom: 0;
  }

  span {
    user-select: text;
  }

  .tts-button {
    cursor: pointer;
    height: 24px;
    width: 24px;
    margin-right: 4px;
    opacity: 0.5;
    transition: ease-out 0.16s;

    &:hover {
      opacity: 1;
    }
  }
`;

const Notes = ({ notes = [] }: Notes) => (
  <Container>
    {notes.map(note => (
      <Note key={note}>
        <span>{note}</span>
        <div className="tts-button" onClick={() => textToSpeech(note)}>
          <Icon name="sound" size={24} />
        </div>
      </Note>
    ))}
  </Container>
);

export default Notes;
