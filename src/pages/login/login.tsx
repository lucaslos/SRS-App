import ButtonElement from '@src/components/ButtonElement'
import { Logo } from '@src/components/Logo'
import { centerContent } from '@src/style/helpers/centerContent'
import { fillContainer } from '@src/style/helpers/fillContainer'
import { responsiveWidth } from '@src/style/helpers/responsiveSize'
import { stack } from '@src/style/helpers/stack'
import { transition } from '@src/style/helpers/transition'
import { colors, gradients } from '@src/style/theme'
import { css, styled } from 'solid-styled-components'
import firebase from 'firebase/app'
import { auth } from '@src/firebase/initialize'
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  User,
  Persistence,
  signInWithPopup,
} from 'firebase/auth'

const Container = styled('div')`
  ${fillContainer};
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  align-items: center;
  justify-items: center;
`

const Content = styled('div')`
  ${responsiveWidth(360, 16)};
  ${stack()};

  .logo {
    width: 200px;
  }
`

const buttonStyle = css`
  position: relative;
  padding: 10px;
  font-size: 24px;
  width: 160px;
  height: 48px;
  letter-spacing: 0.08em;
  border-radius: 50px;
  isolation: isolate;
  background: ${gradients.primary};

  &::before {
    content: '';
    width: 100%;
    height: 100%;
    border-radius: 50px;
    top: 0;
    left: 0;
    z-index: -1;
    border: 2px solid transparent;
    position: absolute;
    background: ${colors.bgPrimary.var};
    background-clip: padding-box;
    opacity: 1;
    ${transition()};
  }

  &:hover::before {
    opacity: 0.9;
  }
`

const Login = () => {
  function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    void auth.setPersistence(browserLocalPersistence).then(() => {
      void signInWithPopup(auth, provider)
    })
  }

  return (
    <Container>
      <Content>
        <Logo class="logo" />

        <ButtonElement class={buttonStyle} onClick={() => signInWithGoogle()}>
          <div>Login</div>
        </ButtonElement>
      </Content>
    </Container>
  )
}

export default Login
