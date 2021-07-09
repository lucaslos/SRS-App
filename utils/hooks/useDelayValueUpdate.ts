import React, { useState, useRef, useEffect } from 'react';
import { useTimeout } from '@utils/hooks/useTimeout';

export function useDelayValueUpdate<T>(
  value: T,
  delay: number,
  shouldDelay: (value: T) => boolean,
  areEqual?: (a: T, b: T) => boolean,
) {
  const [delayedValue, setDelayedValue] = useState(value);
  const [setValueTimeout, clear] = useTimeout();

  useEffect(() => {
    if (areEqual ? !areEqual(value, delayedValue) : value !== delayedValue) {
      if (shouldDelay(value)) {
        setValueTimeout(() => {
          setDelayedValue(value);
        }, delay);
      } else {
        setDelayedValue(value);
      }
    }

    return clear;
  }, [value]);

  return delayedValue;
}
