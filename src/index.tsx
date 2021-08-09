import { render } from 'solid-js/web'
import { registerSW } from 'virtual:pwa-register'
import '@src/style/reset.css'
import Root from '@src/Root'

const updateSW = registerSW({
  onNeedRefresh() {
    // eslint-disable-next-line no-alert
    const reload = window.confirm('New version available, refresh?')

    if (reload) {
      void updateSW()
    }
  },
})

render(() => <Root />, document.getElementById('app')!)
