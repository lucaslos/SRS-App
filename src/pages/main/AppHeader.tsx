import ButtonElement from '@src/components/ButtonElement'
import Icon from '@src/components/Icon'
import Loading from '@src/components/Loading'
import { Logo } from '@src/components/Logo'
import TopSheet from '@src/components/modals/TopSheet'
import { auth } from '@src/firebase/initialize'
import { authStore } from '@src/stores/auth'
import { centerContent } from '@src/style/helpers/centerContent'
import { circle } from '@src/style/helpers/circle'
import { inline } from '@src/style/helpers/inline'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { signOut } from 'firebase/auth'
import { createSignal } from 'solid-js'
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

const menuStyle = css`
  position: relative;
  display: grid;
  grid-template-columns: minmax(200px, auto) 50px;

  .closeButton {
    justify-self: center;
    align-self: flex-start;
    padding-top: 18px;
    padding-right: 10px;
    opacity: 0.5;
    ${transition()};
    ${centerContent};

    &:hover {
      opacity: 1;
    }
  }

  .optionsContainer {
    padding: 10px;
    ${stack({ align: 'stretch', gap: 8 })};

    > button {
      ${inline({ gap: 10, justify: 'center' })};
      padding: 12px 12px;
      text-transform: uppercase;
      border-radius: 8px;
      background: ${colors.primary.alpha(0.1)};
      ${transition()};
      font-size: 16px;
      letter-spacing: 0.08em;

      .icon {
        color: ${colors.primary.var};
        --icon-size: 20px;
      }

      &:hover {
        background: ${colors.primary.alpha(0.3)};
      }
    }
  }
`

const AppHeader = () => {
  const [menuIsOpen, setMenuIsOpen] = createSignal(false)

  return (
    <header class={containerStyle}>
      <div class="logo-container">
        <Logo />
        <span>SRS</span>
      </div>

      <ButtonElement class="avatar" onClick={() => setMenuIsOpen(true)}>
        <img src={authStore.user?.photoURL || ''} alt="avatar" />
      </ButtonElement>

      <TopSheet
        align="right"
        show={menuIsOpen()}
        onClose={() => setMenuIsOpen(false)}
      >
        <div class={menuStyle} onClick={() => setMenuIsOpen(false)}>
          <div className="optionsContainer">
            <ButtonElement class="delete" onClick={() => signOut(auth)}>
              <span>Logout</span>
            </ButtonElement>
          </div>

          <ButtonElement
            class="closeButton"
            onClick={() => setMenuIsOpen(false)}
          >
            <Icon name="close" />
          </ButtonElement>
        </div>
      </TopSheet>
    </header>
  )
}

export default AppHeader
