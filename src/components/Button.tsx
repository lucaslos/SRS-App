import styled from '@emotion/styled';
import * as React from 'react';
import { colorPrimary, colorSecondary } from 'style/theme';
import { rgba } from 'polished';

interface Button {
  label: string;
  onClick: () => any;
}

export const ButtonWrapper = styled.div`
  font-size: 20px;
  font-weight: 300;
  height: 44px;
  line-height: 44px;
  padding: 0 16px;

  color: ${colorPrimary};
  text-transform: uppercase;

  border-radius: 4px;
  cursor: pointer;
  transition: 160ms;
  background-color: ${rgba(colorSecondary, 0.5)};

  &:hover {
    background-color: ${rgba(colorSecondary, 0.8)};
  }
`;

const Button = ({ label, onClick }: Button) => (
  <ButtonWrapper onClick={onClick}>{label}</ButtonWrapper>
);

export default Button;
