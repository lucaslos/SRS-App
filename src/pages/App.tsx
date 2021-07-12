import {
  MatchRoute,
  pathIntegration,
  Router,
  useRouter,
} from '@rturnq/solid-router'
import NavBar from '@src/components/NavBar'
import Home from '@src/pages/home/home'
import AddCard from '@src/pages/modals/AddCard'
import { createMemo } from 'solid-js'
import { css, styled } from 'solid-styled-components'

const containerStyle = css`
  width: 100%;
  height: 100%;
`

const App = () => {
  const router = useRouter()

  const showAddModal = createMemo(() => !!router.query.add)

  return (
    <div class={containerStyle}>
      <Switch fallback={<h1>404</h1>}>
        <MatchRoute end>
          <Home />
        </MatchRoute>

        <MatchRoute path="list">list</MatchRoute>
      </Switch>

      <AddCard show={showAddModal()} />

      <NavBar />
    </div>
  )
}

export default App
