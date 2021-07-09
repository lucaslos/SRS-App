import { MatchRoute, pathIntegration, Router } from '@rturnq/solid-router';
import NavBar from '@src/components/NavBar';
import Home from '@src/pages/home/home';
import { css, styled } from 'solid-styled-components';

const containerStyle = css`
  width: 100%;
  height: 100%;
`;

const App = () => {
  return (
    <div class={containerStyle}>
      <Switch fallback={<h1>404</h1>}>
        <MatchRoute end>
          <Home />
        </MatchRoute>

        <MatchRoute path="list">list</MatchRoute>

        <MatchRoute path="add">add</MatchRoute>
      </Switch>
      <NavBar />
    </div>
  );
};

export default App;
