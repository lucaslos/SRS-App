import { render } from 'solid-js/web';

import '@src/style/reset.css';
import Root from '@src/Root';

// addGoogleFonts();

render(() => <Root />, document.getElementById('app')!);
