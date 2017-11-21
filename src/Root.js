import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from 'containers/App';
import store from 'store/configureStore';

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/section/:section" component={App} />
        <Route path="/" component={App} showAllSections />
      </Switch>
    </BrowserRouter>
  </Provider>
);

export default Root;
