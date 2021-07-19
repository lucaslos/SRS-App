import Loading from '@src/components/Loading'
import { Logo } from '@src/components/Logo'
import { authStore } from '@src/stores/auth'
import { centerContent } from '@src/style/helpers/centerContent'
import { circle } from '@src/style/helpers/circle'
import { inline } from '@src/style/helpers/inline'
import { gradients } from '@src/style/theme'
import { css, styled } from 'solid-styled-components'

const containerStyle = css`
  ${inline({ justify: 'spaceBetween' })};
  height: 68px;
  padding-left: 22px;
  padding-right: 22px;

  .logo-container {
    ${inline()};

    svg {
      width: 48px;
      height: 48px;
      margin-right: 2px;
    }

    span {
      font-size: 24px;
      letter-spacing: 0.08em;
      font-weight: 300;
    }
  }

  .avatar {
    ${circle(36)}
    background: ${gradients.primary};
    overflow: hidden;
    ${centerContent};

    img {
      ${circle(32)};
    }
  }
`

const AppHeader = () => {
  return (
    <header class={containerStyle}>
      <div class="logo-container">
        <Logo />
        <span>SRS</span>
      </div>

      <div class="avatar">
        <img src={authStore.user?.photoURL || ''} alt="avatar" />
      </div>
    </header>
  )
}

export default AppHeader
