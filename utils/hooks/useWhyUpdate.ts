/* eslint-disable no-console */
import React, { useRef, useEffect } from 'react';
import { anyObj } from '@utils/typings';

export function useWhyUpdate(props: anyObj) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce<any>((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = { prev: prev.current[k], current: v };
      }
      return ps;
    }, {});

    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}
