import React, { useRef, useEffect, useLayoutEffect } from 'react';

export function usePrevious<T, I = undefined>(value: T, initial?: I) {
  const ref = useRef<T | I | undefined>(initial);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current as T | I;
}
