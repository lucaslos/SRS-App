import styled from '@emotion/styled';
import Button from 'components/Button';
import Modal from 'components/Modal';
import { useStore } from 'lib/hookstore';
import * as React from 'react';
import { colorSecondaryLigher } from 'style/theme';
import { centerContentCollum } from 'style/modifiers';
import reviewState from 'state/review';

const Box = styled.div`
  ${centerContentCollum};
  height: 220px;
  width: 320px;
  padding-bottom: 50px;

  background-color: ${colorSecondaryLigher};
  border-radius: 4px;

  text-align: center;
`;

const ButtonsWrapper = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  height: 44px;

  display: flex;
  justify-content: space-between;
`;

const ReviewDialog = () => {
  const [show, setShow] = useStore<boolean>('modals', 'reviewDialog');
  const [numOfCards] = reviewState.useStore('numOfCards');
  const [reviewingNew] = reviewState.useStore('reviewingNew');

  function handleStart() {
    reviewState.dispatch('startReview');
    setShow(false);
  }

  return (
    <Modal active={show} handleClose={() => setShow(false)}>
      <Box>
        <span css={{ fontSize: 26, fontWeight: 300, marginBottom: 8 }}>
          Review {numOfCards} {reviewingNew ? 'New ' : ''}cards
        </span>
        <span css={{ fontSize: 16, fontWeight: 300 }}>
          Estimated Time: {numOfCards * 0.5}min
        </span>

        <ButtonsWrapper>
          <Button label="cancel" onClick={() => setShow(false)} />
          <Button label="start" onClick={handleStart} />
        </ButtonsWrapper>
      </Box>
    </Modal>
  );
};

export default ReviewDialog;
