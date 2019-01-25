/** forked from https://github.com/jhonnymichel/react-hookstore */
import { useEffect, useState } from 'react';
import devtools from './devtools';
// TODO: deep freeze?
// TODO: connect function
// TODO: memoize
// TODO: remove the max callbacks, use for
// TODO: test unmount remove setter
// IDEA: create hook for get multiple keys from store at same

interface Subscribe {
  (prev: genericObject, current: genericObject, action?: string | genericObject): void;
}

interface StoreConfig {
  state: object;
  reducers?: object;
  subscriber?: Subscribe;
}

interface Store {
  state: genericObject;
  reducers: genericObject;
  setters: Setter[];
  subscribers: Subscribe[];
}

interface Setter {
  key: string;
  callback: genericFunction;
}

let stores: { [index: string]: Store } = {};

const devToolsMiddeware =
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' &&
  ((window as any).__REDUX_DEVTOOLS_EXTENSION__ ? devtools : false);

/**
 * Creates a new store
 * @param {String} name - The store namespace. not required if you're not using multiple stores within the same app.
 * @param {Object} config - An object containing the store setup
 * @param {*} config.state [{}] - The store initial state. It can be of any type.
 * @param {*} confg.reducer [{}] The reducers handlers.
 * @param {*} confg.subscribers [{}] Initial subscriber.
 */
export function createStore(name: string, { state = {}, reducers = {}, subscriber }: StoreConfig) {
  if (stores[name]) {
    throw new Error(`Store ${name} already exists`);
  }

  const store: Store = {
    state,
    reducers,
    setters: [],
    subscribers: subscriber ? [subscriber] : [],
  };

  if (devToolsMiddeware) {
    store.subscribers.push(
      devToolsMiddeware(name, state, (newState: genericObject) => {
        setState(getStore(name), newState);
      })
    );
  }

  stores = { ...stores, [name]: store };
  return store;
}

function setState(store: Store, newState: genericObject, action?: string | genericObject) {
  for (let i = 0; i < store.setters.length; i++) {
    const setter = store.setters[i];

    if (store.state[setter.key] !== newState[setter.key]) {
      setter.callback(newState[setter.key]);
      // console.log('callback');
    }
  }

  const prevState = { ...store.state };
  store.state = newState;

  for (let i = 0; i < store.subscribers.length; i++) {
    store.subscribers[i](prevState, newState, action);
  }
}

function getStore(name: string) {
  const store = stores[name];
  if (!store) {
    throw new Error(`Store ${name} does not exist`);
  }

  return store;
}

/**
 * Returns the state for the selected store
 * @param {String} name - The namespace for the wanted store
 */
export function getState(name: string) {
  return getStore(name).state;
}

export function dispatch(name: string, type: string, payload: genericObject) {
  const store = getStore(name);

  const newState = store.reducers[type](store.state, payload);

  setState(store, newState, { type: `${name}.${type}`, ...payload });
}

export function setKey(name: string, key: string, value: any) {
  const store = getStore(name);

  const newState = { ...store.state, [key]: value };

  setState(store, newState, { type: `${name}.set.${key}`, key, value });

  return value;
}

/**
 * Returns a [ state, setState ] pair for the selected store. Can only be called within React Components
 * @param {String} name - The namespace for the wanted store
 * @param {String} key - The wanted state key
 */
export function useStore(name: string, key: string) {
  const store = getStore(name);

  const [state, set] = useState(store.state[key]);

  useEffect(() => {
    store.setters.push({
      key,
      callback: set,
    });

    return () => {
      store.setters = store.setters.filter((setter: Setter) => setter.callback !== set);
    };
  }, []);

  if (store.state[key] === undefined)
    throw new Error(`Key '${key}' for the store '${name}' does not exist`);

  const getter = () => getState(name)[key];

  return [state, (value: any) => setKey(name, key, value), getter];
}

/**
 * Subscribe callback
 *
 * @callback subscribeCallback
 * @param {Object} prevState - previous state
 * @param {Object} nextState - next state
 * @param {String} action - action dispatched
 */

/**
 * Subscribe to changes in a store
 * @param {String} name - The store name
 * @param {subscribeCallback} callback - callback to run
 */
export function subscribe(name: string, callback: Subscribe) {
  const store = getStore(name);

  if (!store.subscribers.includes(callback)) {
    store.subscribers.push(callback);
  }

  return () => {
    store.subscribers = store.subscribers.filter(subscriber => subscriber !== callback);
  };
}
