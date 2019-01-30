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

const DeleteCardModal = ({ show, cardId, onDelete, onClose }: Props) => (
  <Modal active={show}>
    <div css={[boxStyle, { width: 330 }]}>
      <div css={bottomButtonsWrapperStyle}>
        <h1
          css={css`
            padding: 0 !important;
            margin: 8px 0 30px 8px !important;
          `}
        >
          Delete card - <span css={[ellipsis(140), { verticalAlign: 'bottom' }]}>{cardId}</span>?
        </h1>
        <Button color={colorRed} label="Delete" right onClick={onDelete} />
        <Button label="cancel" left onClick={onClose} />
      </div>
    </div>
  </Modal>
);

export default DeleteCardModal;
