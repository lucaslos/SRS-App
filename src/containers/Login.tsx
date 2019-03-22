import css from '@emotion/css';
import Button from 'components/Button';
import Modal, {
  bottomButtonsWrapperStyle,
  boxStyle,
  inputsRowWrapperStyle,
} from 'components/Modal';
import TextField from 'components/TextField';
import firebase from '@firebase/app';
import React, { useEffect, useState } from 'react';
import { listenToCardsChange } from 'state/cards';
import { colorPrimary, colorRed, fontDecorative } from 'style/theme';
import { firebaseDev, login as loginUser } from 'utils/firebase';

const h2Style = css`
  width: 100%;
  padding: 0 32px;
  font-size: 12px;
  font-weight: 400;
  margin-top: -12px;
  margin-bottom: 16px;
  /* color: ${colorRed}; */


  flex-shrink: 0;
`;

const errorStyle = css`
  width: 100%;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 600;
  color: ${colorRed};

  flex-shrink: 0;
`;

const loadingStyle = css`
  position: absolute;
  font-family: ${fontDecorative};
  text-align: center;
  padding: 0 24px;
  color: ${colorPrimary};
`;

let firstLogin = true;

const Login = () => {
  const [user, setUser] = useState('lucas@sugestly.com');
  const [pass, setPass] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [firebaseError, setFirebaseError] = useState('');

  function login(userId: string, password: string) {
    setIsLogging(true);
    setLoginError('');

    loginUser(userId, password, err => {
      setIsLogged(false);
      setIsLogging(false);
      setLoginError(err.message);
      console.log(err);
    });
  }

  useEffect(() => {
    // try to login if crendentials are saved
    if (firebaseDev) {
      // skip auth on dev mode
      window.userId = 'nb6fUZ3QSZcDtTlsqMHCr4Vbvou2';
      setIsLogged(true);
      setIsConnected(true);
      listenToCardsChange();
    }

    // listen to changes in login state
    if (!firebaseDev) {
      try {
        firebase.auth!().onAuthStateChanged(
          loggedUser => {
            setIsLogging(false);

            if (loggedUser) {
              console.log('user logged!');
              setIsLogged(true);
              setIsConnected(true);
              window.userId = loggedUser.uid; // user is undefined if no user signed in
              listenToCardsChange();
            } else {
              console.log('loggin failed ou user signout');
              setIsLogged(false);

              // auto login if pass is stored
              if (firstLogin && localStorage.pass && localStorage.user) {
                firstLogin = false;
                login(localStorage.user, localStorage.pass);
              } else {
                firstLogin = false;
                // setLoginError('Login failed! Check you user or pass.');
              }
            }
          },
          err => {
            setLoginError(err.message);
          }
        );
      } catch (error) {
        setFirebaseError(error.message);
      }
    }

    const connectedRef = firebase.database!().ref('.info/connected');
    connectedRef.on('value', snap => {
      if (snap && snap.val()) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });

    // const reCAPTCHA = new firebase.auth.RecaptchaVerifier('recaptcha', {
    //   callback: response => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     // ...
    //   },
    //   'expired-callback': () => {
    //     // Response expired. Ask user to solve reCAPTCHA again.
    //     // ...
    //   },
    // });

    // reCAPTCHA.render();
  }, []);

  return (
    <Modal active={!isLogged || !!firebaseError || !isConnected}>
      <div css={loadingStyle}>
        {isLogging && <span>Logging...</span>}
        {!isConnected && !isLogging && <span>Not conected...</span>}
        {firebaseError && (
          <span css={{ color: colorRed }}>Firebase error: {firebaseError}</span>
        )}
      </div>
      <div
        css={[
          boxStyle,
          { width: 340 },
          firebaseError || isLogging || !isConnected
            ? { opacity: 0, visibility: 'hidden' }
            : undefined,
        ]}
      >
        <h1>Login</h1>
        <h2 css={h2Style}>Atention! Don&apos;t reuse any of your passwords!</h2>
        <form css={{ width: '100%' }}>
          <div css={inputsRowWrapperStyle}>
            <TextField
              handleChange={(value: string) => {
                setUser(value);
                setLoginError('');
              }}
              autocomplete="username"
              label="User"
              type="email"
              value={user}
              required
            />
          </div>
          <div css={inputsRowWrapperStyle}>
            <TextField
              handleChange={(value: string) => {
                setPass(value);
                setLoginError('');
              }}
              label="Password"
              autocomplete="password"
              type="password"
              value={pass}
              required
            />
          </div>
        </form>
        {loginError && <div css={errorStyle}>Error: {loginError}</div>}
        {/* <div id="recaptcha" /> */}
        <div css={bottomButtonsWrapperStyle}>
          <Button
            label="Login"
            disabled={!user || !pass}
            onClick={() => login(user, pass)}
            right
          />
        </div>
      </div>
    </Modal>
  );
};

export default Login;
