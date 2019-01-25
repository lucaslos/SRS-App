import * as React from 'react';
import styled from '@emotion/styled';
import { centerContent, fillContainer } from 'style/modifiers';
import { primary, redColor, secondary } from 'style/colors';
import { rgba, cover } from 'polished';
import css from '@emotion/css';

type ContainerColors = 'red' | 'primary';

type ReviewGroup = {
  label: string;
  warn?: boolean;
}

const Container = styled.div`
  ${centerContent}

  width: 290px;
  height: 177px;

  font-weight: 300;
  font-size: 26px;
  margin: 12px;
  overflow: hidden;

  cursor: pointer;

  border-radius: 4px;
`;

const bgGradient = ({ red }: { red: boolean }) => css`
  background: linear-gradient(
      130deg,
      ${red ? redColor : primary} 0%,
      ${rgba(red ? redColor : primary, 0)} 110%
    ),
    ${secondary};
`;

const Bg = styled.div`
  ${fillContainer};
  ${bgGradient};

  transition: 240ms;
  opacity: 0.64;

  ${Container}:hover & {
    opacity: 0.8;
  }
`;

const ReviewGroup = ({ label, warn = false }: ReviewGroup) => {
  return (
    <Container>
      <Bg red={warn} />
      <span>
        {label}
      </span>
    </Container>
  );
};

export default ReviewGroup;
