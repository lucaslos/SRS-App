import * as React from 'react';
import styled from '@emotion/styled';
import { secondaryLigher } from 'style/colors';
import { rgba } from 'polished';

const Container = styled.div`
  position: absolute;
  height: 60px;
  left: 0;
  right: 0;
  bottom: 0;

  background: ${rgba(secondaryLigher, 0.9)};
`;

const StatsBar = ({  }) => {


  return (
    <Container>

    </Container>
  );
};

export default StatsBar;
