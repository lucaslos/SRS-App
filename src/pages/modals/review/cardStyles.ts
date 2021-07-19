import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { colors, gradients } from '@src/style/theme'
import { css } from 'solid-styled-components'

export const cardBaseStyle = css`
  ${responsiveWidth(440, 16)};
  min-height: 280px;
  border-radius: 16px;
  background: ${gradients.primary};
  position: absolute;
  padding: 16px;
  isolation: isolate;

  &::before {
    content: '';
    inset: 0;
    border-radius: 16px;
    z-index: -1;
    border: 2px solid rgba(0, 0, 0, 0.4);
    background: ${colors.bgPrimary.var};
    position: absolute;
    background-clip: padding-box;
  }
`
