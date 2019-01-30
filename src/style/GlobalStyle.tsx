import { css, Global } from '@emotion/core';
import hotkey from 'hotkeys-js';
import React, { useEffect, useState } from 'react';
import normalize from 'style/normalize';
import scrollBar from 'style/scrollBar';

const debugLayoutStyle = css`
  *:not(g):not(path) {
    color: hsla(210, 100%, 100%, 0.9) !important;
    background: hsla(210, 100%, 50%, 0.5) !important;
    outline: solid 3px hsla(210, 100%, 100%, 0.5) !important;

    box-shadow: none !important;
    filter: none !important;
  }
`;

const GlobalStyle = () => {
  const [debugLayout, setDebugLayout] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      hotkey.unbind('shift+d');
      hotkey('shift+d', () => {
        setDebugLayout(!debugLayout);
      });
    }
  }, [debugLayout]);

  return (
    <Global
      styles={css(normalize, scrollBar, debugLayout && debugLayoutStyle, {
        '*, *::before, *::after': {
          boxSizing: 'border-box',
          transform: 'translate3d(0, 0, 0)',
          userSelect: 'none',
          margin: 0,
        },
        'html, body, #app': {
          position: 'absolute',
          height: '100%',
          width: '100%',

          fontFamily: 'Open Sans, sans-serif',
          color: '#fff',
        },
      })}
    />
  );
};

export default GlobalStyle;
