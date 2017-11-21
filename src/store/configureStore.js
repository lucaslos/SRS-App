import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import initialState from './initialState';
import freezeState from 'redux-freeze-state';

const composeEnhancers =
typeof window === 'object' &&
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
}) : compose;

export default createStore(
  // freezeState(rootReducer), // TODO: remove in production
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(thunkMiddleware)
  )
);
