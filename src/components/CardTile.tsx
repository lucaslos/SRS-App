import styled from '@emotion/styled';
import Icon from 'components/Icon';
import { rgba, ellipsis } from 'polished';
import React from 'react';
import { circle } from 'style/mixins';
import { centerContent, centerContentCollum } from 'style/modifiers';
import {
  colorPrimary,
  colorSecondary,
  fontDecorative,
  colorSecondaryDarker,
  colorRed,
} from 'style/theme';

type CardTile = {
  onClick: genericFunction;
  onDelete: genericFunction;
  front: string;
  back: string;
};

export const TilesWrapper = styled.div`
  ${centerContent};
  width: calc(100% - 12px * 2);
  border-radius: 8px;
  min-height: 80px;
  padding: 12px;

  background-color: ${colorSecondary};

  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 12px;
  row-gap: 12px;

  overflow-y: auto;
`;

const Container = styled.div`
  ${centerContent};
  background: ${rgba(colorPrimary, 0.6)};
  border-radius: 4px;
  height: 55px;

  .faces {
    ${centerContentCollum};
    height: 100%;
    font-size: 12px;
    position: absolute;
    top: 0;
    left: 0;
    right: 46px;
    bottom: 0;
    padding-left: 8px;
    font-weight: 600;
    letter-spacing: 1px;
    font-family: ${fontDecorative};
    color: ${colorSecondaryDarker};
    cursor: pointer;

    div {
      ${ellipsis()}
    }
  }

  .front {
    margin-bottom: 4px;
    padding-bottom: 4px;
    border-bottom: 1px solid ${rgba(colorSecondary, 0.3)};
    width: 100%;
    text-align: center;
  }

  .delete-card {
    ${centerContent};
    ${circle(36)};
    position: absolute;
    right: 6px;

    cursor: pointer;
    transition: 240ms;

    &:hover {
      background-color: ${rgba(colorSecondary, 0.1)};

      .icon {
        fill: ${colorRed};
      }
    }
  }
`;

const CardTile = ({ onClick, onDelete, front, back }: CardTile) => (
  <Container>
    <div className="faces" onClick={onClick}>
      <div className="front">{front}</div>
      <div className="back">{back}</div>
    </div>
    <div className="delete-card" onClick={onDelete}>
      <Icon name="delete" color={colorSecondary} size={28} />
    </div>
  </Container>
  );

export default CardTile;
