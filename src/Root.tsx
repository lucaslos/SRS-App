import { pathIntegration, Router } from '@rturnq/solid-router'
import Loading from '@src/components/Loading'
import App from '@src/pages/main/App'
import Login from '@src/pages/login/login'
import { authStore } from '@src/stores/auth'
import { GlobalStyles } from '@src/style/global'
import { centerContent } from '@src/style/helpers/centerContent'
import { fillContainer } from '@src/style/helpers/fillContainer'
import { css } from 'solid-styled-components'

const Root = () => {
  return (
    <>
      <GlobalStyles />
      <Router integration={pathIntegration()}>
        <Switch>
          <Match when={authStore.authState === 'loading'}>
            <div
              class={css`
                ${fillContainer};
                ${centerContent};
              `}
            >
              <Loading />
            </div>
          </Match>

          <Match when={authStore.authState === 'error'}>
            <Login />

            <div
              class={css`
                ${centerContent};
              `}
            >
              {JSON.stringify(authStore.error)}
            </div>
          </Match>

          <Match when={authStore.authState === 'loggedOut'}>
            <Login />
          </Match>

          <Match when>
            <App />
          </Match>
        </Switch>
      </Router>
    </>
  )
}

export default Root
