import React, { useEffect } from 'react';
import { usePrevious } from '@utils/hooks/usePrevious';

export function useOnChange<T>(
  value: T,
  callBack: (prev: T | undefined, curr: T) => void,
  equalityFn?: (a: any, b: any) => boolean,
) {
  const last = usePrevious(value);
  useEffect(() => {
    if (equalityFn) {
      if (equalityFn(value, last)) {
        callBack(last, value);
      }
    } else {
      callBack(last, value);
    }
  }, [value]);
}

export function useOnChangeTo<T, U extends T>(
  value: T,
  target: U,
  callBack: (last: T | undefined, curr: U) => void,
  equalityFn?: (a: any, b: any) => boolean,
) {
  const last = usePrevious(value);
  useEffect(() => {
    if (equalityFn) {
      if (equalityFn(value, last) && equalityFn(value, target)) {
        callBack(last, target);
      }
    } else if (value === target) {
      callBack(last, target);
    }
  }, [value, target]);
}
