import React, { useLayoutEffect, useState } from 'react';
import { shallowEqual } from 't-state';

export function useConditionalValueUpdate<T>(
  value: T,
  shouldUpdate: (prevValue: T, value: T) => boolean,
  deps: any[] = [value],
  equalityFn = shallowEqual,
) {
  const [currentValue, setCurrentValue] = useState(value);

  useLayoutEffect(() => {
    if (
      equalityFn ? !equalityFn(value, currentValue) : value !== currentValue
    ) {
      if (shouldUpdate(currentValue, value)) {
        setCurrentValue(value);
      }
    }
  }, deps);

  return currentValue;
}
