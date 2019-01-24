import * as React from 'react';
import { Global, css } from '@emotion/core';
import normalize from 'style/normalize';

const GlobalStyle = () => (
  <>
    <Global
      styles={css(
        normalize,
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

            fontFamily: ['Source Sans Pro', 'sans-serif'],
            color: '#000',
          }
        }
      )}
    />
  </>
);

export default GlobalStyle;
