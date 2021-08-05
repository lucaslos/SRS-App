import { MatchRoute } from '@rturnq/solid-router'
import Home from '@src/pages/home/home'
import List from '@src/pages/list/list'
import AppHeader from '@src/pages/main/AppHeader'
import NavBar from '@src/pages/main/NavBar'
import AddOrEditCard from '@src/pages/modals/AddOrEditCard'
import DeleteCard from '@src/pages/modals/DeleteCard'
import Import from '@src/pages/modals/ImportData'
import Review from '@src/pages/modals/review/Review'
import { stack } from '@src/style/helpers/stack'
import { css } from 'solid-styled-components'

const containerStyle = css`
  width: 100%;
  height: 100%;
  ${stack({ align: 'stretch' })};
`

const App = () => {
  return (
    <div class={containerStyle}>
      <AppHeader />

      <Switch fallback={<h1>404</h1>}>
        <MatchRoute end>
          <Home />
        </MatchRoute>

        <MatchRoute path="list">
          <List />
        </MatchRoute>
      </Switch>

      <Review />
      <AddOrEditCard />
      <DeleteCard />
      <Import />

      <NavBar />
    </div>
  )
}

export default App
