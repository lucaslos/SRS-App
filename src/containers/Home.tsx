import * as React from 'react';
import Icon from 'components/Icon';
import styled from '@emotion/styled';
import { fillContainer, centerContent } from 'style/modifiers';
import {
  colorSecondary,
  colorPrimary,
  colorSecondaryDarker,
} from 'style/theme';
import { circle } from 'style/mixins';
import css from '@emotion/css';
import CardsGroups from 'containers/ReviewGroupContainer';
import StatsBar from 'containers/StatsBar';
import modalsState from 'state/modals';
import { mqMobile } from 'style/mediaQueries';
import { firebaseDev } from 'utils/firebase';
import { isDev } from 'utils/genericUtils';

const Container = styled.section`
  ${fillContainer};
  ${centerContent};
  background-color: ${colorSecondary};
`;

const topButton = css`
  ${centerContent};
  ${circle(52)}

  position: absolute;
  top: 38px;

  cursor: pointer;
  transition: 160ms;

  &:hover {
    background-color: ${colorSecondaryDarker};
  }

  ${mqMobile} {
    top: 10px;
  }
`;

const LogoWrapper = styled.div`
  position: absolute;
  top: 40px;

  cursor: pointer;

  ${mqMobile} {
    top: 12px;
  }
`;

const Home = () => (
  <Container>
    {isDev && (
      <div css={{ position: 'absolute', top: 2, left: 2, fontSize: 9 }}>
        Firebase {firebaseDev ? 'Dev Mode' : 'Production'}
      </div>
    )}
    <div
      css={[topButton, { left: 38, [mqMobile]: { left: 10 } }]}
      onClick={() => modalsState.setKey('cardsList', true)}
    >
      <Icon name="card-list" color={colorPrimary} />
    </div>
    <LogoWrapper onClick={() => modalsState.setKey('version', true)}>
      <Icon name="logo" color={colorPrimary} size={48} />
    </LogoWrapper>
    <div
      css={[topButton, { right: 38, [mqMobile]: { right: 10 } }]}
      onClick={() => modalsState.setKey('addCards', true)}
    >
      <Icon name="add-circle" color={colorPrimary} />
    </div>

    <CardsGroups />
    <StatsBar />
  </Container>
);

export default Home;
