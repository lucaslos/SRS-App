import React from 'react';
import styled from '@emotion/styled';
import Modal, { bottomButtonsWrapperStyle, boxStyle } from 'components/Modal';
import Button from 'components/Button';
import { version } from '../../package.json';
import modalsState from 'state/modals';

const VersionModal = () => {
  const [active, setActve] = modalsState.useStore('version');

  return (
    <Modal active={active}>
      <div css={[boxStyle, { width: 200 }]}>
        <p css={{ padding: '20px 0 0' }}>SRS App v{version}</p>
        <div css={bottomButtonsWrapperStyle}>
          <Button label="Close" onClick={() => setActve(false)} right />
        </div>
      </div>
    </Modal>
  );
};

export default VersionModal;
