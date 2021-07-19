import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
} from 'solid-js'

type ShowStatus = 'from' | 'appear' | 'exit' | 'unmounted'

export function useAnimateMount(show: Accessor<boolean>, id = 'anim') {
  const [status, setShowStatus] = createSignal<ShowStatus>(
    show() ? 'from' : 'unmounted',
  )

  let openTimeout: number
  let closeTimeout: number

  onCleanup(() => {
    clearTimeout(openTimeout)
    clearTimeout(closeTimeout)
  })

  function startOpening() {
    setShowStatus('from')

    openTimeout = window.setTimeout(() => {
      setShowStatus('appear')
    }, 10)
  }

  function startClosing() {
    setShowStatus('exit')

    closeTimeout = window.setTimeout(() => {
      setShowStatus('unmounted')
    }, 260)
  }

  createEffect(
    on(show, (newShow, prevShow) => {
      if (newShow) {
        startOpening()
      } else if (!newShow && prevShow) {
        startClosing()
      }
    }),
  )

  const mount = () => status() !== 'unmounted'
  const className = () => `${id}-${status()}`

  return {
    mount,
    className,
  }
}
