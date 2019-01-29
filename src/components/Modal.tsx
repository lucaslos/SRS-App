import css from '@emotion/css';
import styled from '@emotion/styled';
import Icon from 'components/Icon';
import { rgba } from 'polished';
import React, { SFC } from 'react';
import { circle } from 'style/mixins';
import { centerContent, centerContentCollum, fillContainer, hide, show } from 'style/modifiers';
import { colorPrimary, colorSecondary, colorSecondaryDarker, colorSecondaryLigher } from 'style/theme';

interface Container {
  active: boolean;
}

interface Modal extends Container {
  handleClose?: genericFunction;
}

export const BoxCloseButtonStyle = styled.div`
  ${circle(42)};
  ${centerContent};
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;

  &:hover {
    background-color: ${rgba(colorSecondary, 0.8)};
  }
`;

export const BoxCloseButton = ({ onClose }: { onClose: genericFunction }) => (
  <BoxCloseButtonStyle onClick={onClose}>
    <Icon name="close" size={26} />
  </BoxCloseButtonStyle>
);

export const boxStyle = css`
  ${centerContentCollum};
  /* height: 220px; */
  max-height: calc(100% - 12px * 2);
  width: 560px;
  /* overflow-y: auto; */

  background-color: ${colorSecondaryLigher};
  border-radius: 4px;
`;

export const bottomButtonsWrapperStyle = css`
  /* height: 44px; */
  padding: 16px;

  width: 100%;

  .button.right {
    margin-left: 16px;
  }

  .button.left {
    margin-right: 16px;
  }
`;

const Container = styled.div`
  ${fillContainer};
  ${centerContent};
  ${(props: Container) => (props.active ? show : hide)};

  transition: 240ms ease-out;
  background-color: ${rgba(colorSecondaryDarker, 0.9)};

  h1 {
    width: 100%;
    padding: 24px 32px;
    font-size: 20px;
    font-weight: 400;

    flex-shrink: 0;
  }
`;

const CloseButton = styled.div`
  ${centerContent};
  ${circle(52)}
  z-index: 1;

  position: absolute;
  top: 20px;
  right: 20px;

  cursor: pointer;
  transition: 240ms;
  background-color: ${colorSecondary};

  &:hover {
    background-color: ${colorSecondaryDarker};
  }
`;

export const inputsRowWrapperStyle = css`
  display: flex;
  justify-content: stretch;
  width: 100%;
  flex-shrink: 0;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 4px;
  padding-left: 16px;

  > * {
    margin-right: 18px;
  }
`;

const Modal: SFC<Modal> = ({ children, active, handleClose }) => (
  <Container active={active}>
    {handleClose && (
      <CloseButton onClick={handleClose}>
        <Icon name="close" color={colorPrimary} />
      </CloseButton>
    )}
    {children}
  </Container>
);

export default Modal;
