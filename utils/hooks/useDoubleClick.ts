import React, { useRef, useCallback } from 'react';
import { anyFunction } from '@utils/typings';

export function useDoubleClick<T extends anyFunction>({
  onDoubleClick,
  onClick,
}: {
  onDoubleClick: T;
  onClick: T;
}) {
  const clickRef = useRef(0);
  const handleClick = useCallback(
    (...args) => {
      clickRef.current += 1;

      setTimeout(() => {
        if (clickRef.current === 1) {
          onClick(...args);
        } else if (clickRef.current === 2) {
          onDoubleClick(...args);
        }

        clickRef.current = 0;
      }, 250);
    },
    [onClick, onDoubleClick],
  );

  return handleClick as T;
}
