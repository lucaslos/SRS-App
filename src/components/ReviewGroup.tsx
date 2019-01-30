import * as React from 'react';
import styled from '@emotion/styled';
import { centerContent, fillContainer } from 'style/modifiers';
import { colorPrimary, colorRed, colorSecondary } from 'style/theme';
import { rgba, cover } from 'polished';
import css from '@emotion/css';
import { mqMobile } from 'style/mediaQueries';

type ContainerColors = 'red' | 'primary';

interface ReviewGroup {
  label: string;
  warn?: boolean;
  handleClick: () => any;
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

  ${mqMobile} {
    height: 100px;
    margin: 8px;
    width: calc(100% - 18px * 2);
  }
`;

const bgGradient = ({ red }: { red: boolean }) => css`
  background: linear-gradient(
      130deg,
      ${red ? colorRed : colorPrimary} 0%,
      ${rgba(red ? colorRed : colorPrimary, 0)} 110%
    ),
    ${colorSecondary};
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

const ReviewGroup = ({ label, warn = false, handleClick }: ReviewGroup) => {
  return (
    <Container onClick={handleClick}>
      <Bg red={warn} />
      <span>
        {label}
      </span>
    </Container>
  );
};

export default ReviewGroup;
