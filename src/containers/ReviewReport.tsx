import styled from '@emotion/styled';
import Button from 'components/Button';
import Modal from 'components/Modal';
import { useStore } from 'lib/hookstore';
import * as React from 'react';
import { colorSecondaryLigher, colorPrimary, fontDecorative, colorRed, colorYellow } from 'style/theme';
import { centerContentCollum } from 'style/modifiers';
import reviewState from 'state/review';

const Box = styled.div`
  ${centerContentCollum};
  /* height: 250px; */
  width: 320px;

  background-color: ${colorSecondaryLigher};
  border-radius: 4px;

  text-align: center;

  h1 {
    font-size: 16px;
    /* color: ${colorPrimary}; */
    font-weight: 300;
    margin-top: 18px;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 16px;
  }
`;

const ButtonsWrapper = styled.div`
  /* position: absolute; */
  margin-bottom: 16px;
  padding: 0 16px;
  height: 44px;
  margin-top: 28px;
  width: 100%;

  display: flex;
  justify-content: flex-end;
`;

const Stat = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin-top: 12px;

  font-family: ${fontDecorative};
`;

const ReviewReport = () => {
  const [reviewPos, setReviewPos] = reviewState.useStore('reviewPos');
  const [{ total, success, fails, hard, time }] = reviewState.useStore('endReport');
  const [reviewEnded] = reviewState.useStore('ended');

  function handleClose() {
    setReviewPos(-1);
  }

  return (
    <Modal active={reviewEnded && reviewPos >= 1} handleClose={handleClose}>
      <Box>
        <h1>Revision Ended</h1>
        <Stat css={{ color: colorPrimary }}>{`Success -> ${success} (${Math.round(success / total * 100)}%)`}</Stat>
        <Stat css={{ color: colorYellow }}>{`So-so -> ${hard} (${Math.round(hard / total * 100)}%)`}</Stat>
        <Stat css={{ color: colorRed }}>{`Misses -> ${fails} (${Math.round(fails / total * 100)}%)`}</Stat>
        <Stat>{`Time: ${time}`}</Stat>

        <ButtonsWrapper>
          <Button label="All Right!" onClick={handleClose} />
        </ButtonsWrapper>
      </Box>
    </Modal>
  );
};

export default ReviewReport;
