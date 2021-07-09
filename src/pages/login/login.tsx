import ButtonElement from '@src/components/ButtonElement';
import { Logo } from '@src/components/Logo';
import { centerContent } from '@src/style/helpers/centerContent';
import { fillContainer } from '@src/style/helpers/fillContainer';
import { responsiveWidth } from '@src/style/helpers/responsiveSize';
import { stack } from '@src/style/helpers/stack';
import { transition } from '@src/style/helpers/transition';
import { gradients } from '@src/style/theme';
import { styled } from 'solid-styled-components';
import firebase from 'firebase/app';
import { auth } from '@src/firebase/initialize';

const Container = styled('div')`
  ${fillContainer};
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  align-items: center;
  justify-items: center;
`;

const Content = styled('div')`
  ${responsiveWidth(360, 16)};
  ${stack()};

  > .logo {
    width: 200px;
  }

  > button {
    position: relative;
    padding: 10px;
    font-size: 24px;
    width: 160px;
    letter-spacing: 0.08em;

    &::before {
      content: '';
      ${fillContainer};
      border-radius: 50px;
      border: 2px solid transparent;
      background: ${gradients.primary} border-box;
      -webkit-mask: linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;

      opacity: 0.8;
      ${transition()};
    }

    &:hover::before {
      opacity: 1;
    }
  }
`;

const Login = () => {
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    void auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      auth.signInWithPopup(provider);
    });
  }

  return (
    <Container>
      <Content>
        <Logo class="logo" />

        <ButtonElement onClick={() => signInWithGoogle()}>Login</ButtonElement>
      </Content>
    </Container>
  );
};

export default Login;
