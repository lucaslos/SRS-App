import ButtonElement from '@src/components/ButtonElement'
import { centerContent } from '@src/style/helpers/centerContent'
import { circle } from '@src/style/helpers/circle'
import { inline } from '@src/style/helpers/inline'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { cx } from '@utils/cx'
import { css } from 'solid-styled-components'

const containerStyle = css`
  background: ${colors.bgPrimary.var};
  ${inline({ gap: 12 })};
  height: 32px;
  border-radius: 32px;
  padding-right: 4px;

  .label {
    letter-spacing: 0.01em;
    padding-left: 14px;
  }
`

const switchStyle = css`
  height: 24px;
  width: 46px;
  border-radius: 40px;
  position: relative;
  isolation: isolate;
  background: ${gradients.primary};
  ${centerContent};

  &::before {
    content: '';
    width: 100%;
    height: 100%;
    border-radius: 50px;
    top: 0;
    left: 0;
    z-index: -1;
    border: 1px solid transparent;
    position: absolute;
    background: ${colors.bgPrimary.var};
    background-clip: padding-box;
    opacity: 1;
    ${transition()};
  }

  &:hover::before {
    opacity: 0.9;
  }

  .thumb {
    ${circle(16)};
    background: #fff;
    position: absolute;
    left: 4px;
    ${transition()};
  }

  &.checked {
    &::before {
      opacity: 0;
    }

    .thumb {
      transform: translate3d(${46 - 4 - 16 - 4}px, 0, 0);
    }
  }
`

interface SwitcherProps {
  label: string
  class?: string
  checked: boolean
  onChange: (checked: boolean) => any
}

export const Switcher = (props: SwitcherProps) => {
  function toggle() {
    props.onChange(!props.checked)
  }

  return (
    <ButtonElement
      class={cx(containerStyle, props.class)}
      onClick={() => toggle()}
    >
      <div class="label">{props.label}</div>

      <div class={switchStyle} classList={{ checked: props.checked }}>
        <div class="thumb" />
      </div>
    </ButtonElement>
  )
}
