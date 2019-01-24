import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from 'Root';
// import 'state/configureStores';
import { version } from '../package.json';

if (process.env.NODE_ENV === 'production') {
  console.log(`Hub Navigation v${version}`);

  // register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then((registration) => {
        console.log('SW registered: ', registration);
      }).catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
}

ReactDOM.render(
  <Root />,
  document.getElementById('app')
);
