import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';

import App from 'containers/App';
import store from 'store/configureStore';

const Root = () => (
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path="/section/:section" component={App} />
        <Route path="/" component={App} showAllSections />
      </Switch>
    </HashRouter>
  </Provider>
);

export default Root;
