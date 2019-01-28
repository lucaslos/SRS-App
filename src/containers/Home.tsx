import * as React from 'react';
import Icon from 'components/Icon';
import styled from '@emotion/styled';
import { fillContainer, centerContent } from 'style/modifiers';
import { colorSecondary, colorPrimary, colorSecondaryDarker } from 'style/theme';
import { circle } from 'style/mixins';
import css from '@emotion/css';
import CardsGroups from 'containers/ReviewGroupContainer';
import StatsBar from 'containers/StatsBar';

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
`;

const LogoWrapper = styled.div`
  position: absolute;
  top: 40px;
`;

const Home = () => (
  <Container>
    <div css={css(topButton, { left: 38 })}>
      <Icon name="card-list" color={colorPrimary} />
    </div>
    <LogoWrapper>
      <Icon name="logo" color={colorPrimary} size={48} />
    </LogoWrapper>
    <div css={css(topButton, { right: 38 })}>
      <Icon name="add-circle" color={colorPrimary} />
    </div>

    <CardsGroups />
    <StatsBar />
  </Container>
);

export default Home;
