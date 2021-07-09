import React, { useState, useRef, useCallback } from 'react';

export function useGetSet<T>(
  initialState: T,
): [() => T, (value: T) => void, T] {
  const [value, set] = useState(initialState);
  const s = useRef(initialState);
  const get = useCallback(() => s.current, []);
  s.current = value;
  return [get, set, value];
}
