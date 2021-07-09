import React, { useEffect } from 'react';

type Ref = HTMLElement | React.RefObject<HTMLElement> | null | string;

function checkIfTargetContainsRef(ref: any, target: Node) {
  const elem =
    ((typeof ref === 'string'
      ? document.querySelector(ref)
      : ref?.current || ref) as HTMLElement) || undefined;

  return !elem || elem.contains?.(target);
}

export function useOnClickOutside(
  ref: Ref | Ref[],
  handler: (event: MouseEvent) => any,
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        Array.isArray(ref)
          ? ref.some((item) =>
              checkIfTargetContainsRef(item, event.target as Node),
            )
          : checkIfTargetContainsRef(ref, event.target as Node)
      ) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
