import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from 'Root';

const rootEl = document.getElementById('app');
const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  );

render(Root);

if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextApp = require('./Root').default;
    render(NextApp);
  });
}