import Loading from '@src/components/Loading'
import { centerContent } from '@src/style/helpers/centerContent'
import { fillContainer } from '@src/style/helpers/fillContainer'
import { colors } from '@src/style/theme'
import { cx } from '@utils/cx'
import { css } from 'solid-styled-components'

const containerStyle = css`
  ${fillContainer};
  ${centerContent};
  background: ${colors.bgPrimary.alpha(0.1)};
`

type LoadingOverlayProps = { class?: string }

const LoadingOverlay = (props: LoadingOverlayProps) => {
  return (
    <div class={cx(containerStyle, props.class)}>
      <Loading />
    </div>
  )
}

export default LoadingOverlay
