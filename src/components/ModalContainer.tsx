import { centerContent } from '@src/style/helpers/centerContent'
import { fillContainer } from '@src/style/helpers/fillContainer'
import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { transition } from '@src/style/helpers/transition'
import { colors } from '@src/style/theme'
import { cx } from '@utils/cx'
import { createEffect, createSignal, JSX, on } from 'solid-js'
import { Portal } from 'solid-js/web'
import { css } from 'solid-styled-components'

const containerStyle = css`
  width: 100%;
  height: 100%;
  ${centerContent};
`

const bgStyle = css`
  ${fillContainer}
  ${transition()};
  backdrop-filter: blur(20px);

  .anim-from &,
  .anim-exit & {
    opacity: 0;
  }

  .anim-appear & {
    opacity: 1;
  }
`

interface AddCardProps {
  show: boolean
  onClose: () => any
  children: JSX.Element
}

type ShowStatus = 'from' | 'appear' | 'exit' | 'unmounted'

const ModalContainer = (props: AddCardProps) => {
  const [showStatus, setShowStatus] = createSignal<ShowStatus>(
    props.show ? 'from' : 'unmounted',
  )

  function startOpening() {
    setShowStatus('from')

    setTimeout(() => {
      setShowStatus('appear')
    }, 10)
  }

  function startClosing() {
    setShowStatus('exit')

    setTimeout(() => {
      setShowStatus('unmounted')
    }, 260)
  }

  createEffect(
    on(
      () => props.show,
      (show, prevShow) => {
        if (show) {
          startOpening()
        } else if (!show && prevShow) {
          startClosing()
        }
      },
    ),
  )

  return (
    <Portal mount={document.getElementById('modals')!}>
      <Show when={showStatus() !== 'unmounted'}>
        <div class={cx(containerStyle, `anim-${showStatus()}`)}>
          <div className={bgStyle} onClick={props.onClose} />

          {props.children}
        </div>
      </Show>
    </Portal>
  )
}

export default ModalContainer
