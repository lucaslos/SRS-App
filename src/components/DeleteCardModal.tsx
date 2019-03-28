import React from 'react';
import styled from '@emotion/styled';
import Modal, { bottomButtonsWrapperStyle, boxStyle } from 'components/Modal';
import Button from 'components/Button';
import { colorRed } from 'style/theme';
import css from '@emotion/css';
import { ellipsis } from 'polished';

type Props = {
  show: boolean;
  cardId: string;
  onDelete: genericFunction;
  onClose: genericFunction;
};

const Description = styled.h2`
  width: 100%;
  margin-left: 8px;
  font-size: 16px;
  font-weight: 300;
  vertical-align: bottom;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

  flex-shrink: 0;
`;

const DeleteCardModal = ({ show, cardId, onDelete, onClose }: Props) => (
  <Modal active={show}>
    <div css={[boxStyle, { width: 330 }]}>
      <div css={bottomButtonsWrapperStyle}>
        <h1
          css={css`
            padding: 0 !important;
            margin: 8px 0 18px 8px !important;
          `}
        >
          Delete card?
        </h1>
        <Description title={cardId}>{cardId}</Description>
      </div>
      <div css={bottomButtonsWrapperStyle}>
        <Button color={colorRed} label="Delete" right onClick={onDelete} />
        <Button label="cancel" left onClick={onClose} />
      </div>
    </div>
  </Modal>
);

export default DeleteCardModal;
