import * as React from 'react';
import { hot } from 'react-hot-loader';

import App from 'containers/App';
import GlobalStyle from 'style/GlobalStyle';

const Root = () => (
  <>
    <GlobalStyle />
    <App />
  </>
);

export default hot(module)(Root);
