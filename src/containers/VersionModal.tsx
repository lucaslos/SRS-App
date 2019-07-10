import React, { useState } from 'react';
import styled from '@emotion/styled';
import Modal, { bottomButtonsWrapperStyle, boxStyle } from 'components/Modal';
import Button from 'components/Button';
import { version } from '../../package.json';
import modalsState from 'state/modals';
import { copyCardsJSON } from 'state/cards';

const CopyCardsButton = styled.button`
  border: 0;
  background: transparent;
  margin: 16px 0;
  color: #fff;
  text-decoration: underline;
  cursor: pointer;
  outline: none;
`;

const VersionModal = () => {
  const [active, setActve] = modalsState.useStore('version');
  const [showSuccessCopyMessage, setShowSuccessCopyMessage] = useState(
    false
  );

  function onClickCopyCardsJSON() {
    copyCardsJSON().then(() => {
      setShowSuccessCopyMessage(true);
      setTimeout(() => setShowSuccessCopyMessage(false), 2000);
    });
  }

  return (
    <Modal active={active}>
      <div css={[boxStyle, { width: 200 }]}>
        <p css={{ padding: '20px 0 0' }}>SRS App v{version}</p>
        <CopyCardsButton type="button" onClick={onClickCopyCardsJSON}>
          {showSuccessCopyMessage ? 'JSON Copied!' : 'Copy cards JSON'}
        </CopyCardsButton>
        <div css={bottomButtonsWrapperStyle}>
          <Button label="Close" onClick={() => setActve(false)} right />
        </div>
      </div>
    </Modal>
  );
};

export default VersionModal;
