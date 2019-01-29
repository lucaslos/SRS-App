import React, { useState, useEffect } from 'react';
import { Global, css } from '@emotion/core';
import normalize from 'style/normalize';
import scrollBar from 'style/scrollBar';
import hotkey from 'hotkeys-js';
import { useGetSet } from 'react-use';

const debugLayout = css`
  *:not(g):not(path) {
    color: hsla(210, 100%, 100%, 0.9) !important;
    background: hsla(210, 100%, 50%, 0.5) !important;
    outline: solid 3px hsla(210, 100%, 100%, 0.5) !important;

    box-shadow: none !important;
    filter: none !important;
  }
`;

const GlobalStyle = () => {
  const [getDebugLayout, setDebugLayout] = useGetSet(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      hotkey('shift+d', () => {
        setDebugLayout(!getDebugLayout());
      });
    }
  }, []);

  return (
    <Global
      styles={css(normalize, scrollBar, getDebugLayout() && debugLayout, {
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
