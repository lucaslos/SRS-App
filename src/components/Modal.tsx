import React, { SFC } from 'react';
import styled from '@emotion/styled';
import { fillContainer, hide, show, centerContent } from 'style/modifiers';
import { rgba } from 'polished';
import { colorSecondaryDarker, colorPrimary, colorSecondary } from 'style/theme';
import Icon from 'components/Icon';
import { circle } from 'style/mixins';

interface Container {
  active: boolean;
}

interface Modal extends Container {
  handleClose: genericFunction;
}

const Container = styled.div`
  ${fillContainer};
  ${centerContent};
  ${(props: Container) => (props.active ? show : hide)};

  transition: 240ms ease-out;
  background-color: ${rgba(colorSecondaryDarker, 0.9)};
`;

const CloseButton = styled.div`
  ${centerContent};
  ${circle(52)}
  z-index: 1;

  position: absolute;
  top: 38px;
  right: 38px;

  cursor: pointer;
  transition: 160ms;
  background-color: ${colorSecondary};

  &:hover {
    background-color: ${colorSecondaryDarker};
  }
`;

const Modal: SFC<Modal> = ({ children, active, handleClose }) => (
  <Container active={active}>
    <CloseButton onClick={handleClose}>
      <Icon name="close" color={colorPrimary} />
    </CloseButton>
    {children}
  </Container>
);

export default Modal;
