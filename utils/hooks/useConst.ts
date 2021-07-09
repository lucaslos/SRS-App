import React, { useRef } from 'react';

export function useConst<T>(value: T | (() => T)) {
  const store = useRef<T>();

  if (store.current === undefined) {
    store.current = typeof value === 'function' ? (value as () => T)() : value;
  }

  return store.current;
}
