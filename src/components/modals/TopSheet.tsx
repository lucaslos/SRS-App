import ModalContainer from '@src/components/ModalContainer'
import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { mq } from '@src/style/mediaQueries'
import { colors } from '@src/style/theme'
import { JSX, PropsWithChildren } from 'solid-js'
import { css } from 'solid-styled-components'

const containerStyle = css`
  ${responsiveWidth(600)};
  background: ${colors.bgSecondary.var};
  position: absolute;
  top: 0;
  left: 0;
  max-height: calc(100% - 20px);
  ${transition()};
  ${stack({ align: 'stretch' })};
  border-radius: 0 0 20px 20px;
  overflow: hidden;

  ${mq.desktop} {
    width: max-content;

    &:not(.alignRight) {
      border-bottom-left-radius: 0;
    }

    &.alignRight {
      border-bottom-right-radius: 0;
    }
  }

  .top-sheet-from &,
  .top-sheet-exit & {
    opacity: 0;
    transform: translate3d(0, -20px, 0);
  }

  .top-sheet-appear & {
    opacity: 1;
  }

  &.alignRight {
    right: 0;
    left: auto;
  }
`

interface TopSheetProps {
  show: boolean
  onClose: () => void
  align: 'left' | 'right'
  children: JSX.Element
}

const ModalContent = (props: TopSheetProps) => {
  return (
    <div
      class={containerStyle}
      classList={{ alignRight: props.align === 'right' }}
    >
      {props.children}
    </div>
  )
}

const TopSheet = (props: TopSheetProps) => {
  return (
    <ModalContainer
      animClass="top-sheet"
      show={props.show}
      onClose={props.onClose}
      disableBgStyle
    >
      <ModalContent {...props} />
    </ModalContainer>
  )
}

export default TopSheet
