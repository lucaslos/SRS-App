import styled from '@emotion/styled';
import * as React from 'react';
import { colorPrimary, colorSecondary } from 'style/theme';
import { rgba, clearFix } from 'polished';
import css from '@emotion/css';
import { cx } from 'utils/cx';

interface Button {
  label: string;
  onClick: () => any;
  right?: boolean;
  left?: boolean;
  smallRound?: boolean;
  disabled?: boolean;
  color?: string;
}

type StyleProps = Omit<Button, 'onClick' | 'label'>;

const style = css`
  font-size: 20px;
  font-weight: 300;
  height: 44px;
  line-height: 44px;
  padding: 0 16px;

  text-transform: uppercase;

  border-radius: 4px;
  cursor: pointer;
  transition: 160ms;
  background-color: ${rgba(colorSecondary, 0.5)};

  &:hover {
    background-color: ${rgba(colorSecondary, 0.8)};
  }
`;

const roundStyle = css`
  height: 28px;
  font-size: 14px;
  line-height: 28px;
  border-radius: 28px;
  color: ${colorSecondary};
  font-weight: 400;

  background-color: ${rgba(colorPrimary, 0.8)};

  &:hover {
    background-color: ${rgba(colorPrimary, 1)};
  }
`;

const dynamicStyle = (props: StyleProps) =>
  css`
    float: ${props.right ? 'right' : props.left ? 'left' : undefined};
    opacity: ${props.disabled && 0.4};
    pointer-events: ${props.disabled && 'none'};
    color: ${props.color};
  `;

export const ButtonWrapper = styled.div<StyleProps>`
  ${style};

  ${props => props.smallRound && roundStyle};
  ${dynamicStyle};
`;

const Button = ({
  disabled,
  label,
  onClick,
  right,
  left,
  smallRound,
  color = colorPrimary,
}: Button) => (
  <ButtonWrapper
    onClick={onClick}
    right={right}
    left={left}
    disabled={disabled}
    color={color}
    smallRound={smallRound}
    className={cx('button', { left, right })}
  >
    {label}
  </ButtonWrapper>
);

export default Button;
