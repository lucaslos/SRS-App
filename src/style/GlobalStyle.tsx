import * as React from 'react';
import { Global, css } from '@emotion/core';
import normalize from 'style/normalize';
import scrollBar from 'style/scrollBar';

const GlobalStyle = () => (
  <>
    <Global
      styles={css(
        normalize,
        scrollBar,
        {
          '*, *::before, *::after': {
            boxSizing: 'border-box',
            transform: 'translate3d(0, 0, 0)',
            userSelect: 'none',
          },
          'html, body, #app': {
            position: 'absolute',
            height: '100%',
            width: '100%',

            fontFamily: 'Open Sans, sans-serif',
            color: '#fff',
          }
        }
      )}
    />
  </>
);

export default GlobalStyle;
