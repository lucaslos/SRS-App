import React, { useRef, useEffect } from 'react';
import { anyFunction } from '@utils/typings';

export function useTimeout() {
  const timeoutRef = useRef(-1);

  function callback(cb: anyFunction, ms: number) {
    timeoutRef.current = window.setTimeout(cb, ms);
  }

  function clear() {
    clearTimeout(timeoutRef.current);
  }

  useEffect(() => clear, []);

  return [callback, clear] as const;
}
