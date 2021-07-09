import { MatchRoute, pathIntegration, Router } from '@rturnq/solid-router';
import App from '@src/pages/App';
import Home from '@src/pages/home/home';
import Login from '@src/pages/login/login';
import { authStore } from '@src/stores/auth';
import { GlobalStyles } from '@src/style/global';

const Root = () => {
  return (
    <>
      <GlobalStyles />
      <Router integration={pathIntegration()}>
        <Switch>
          <Match when={authStore.authState === 'loading'}>...</Match>

          <Match when={authStore.authState === 'loggedOut'}>
            <Login />
          </Match>

          <Match when>
            <App />
          </Match>
        </Switch>
      </Router>
    </>
  );
};

export default Root;
