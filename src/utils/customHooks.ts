import { useState, useRef, useCallback, useEffect } from 'react';
import hotkeys, { KeyHandler } from 'hotkeys-js';

// export const useClickOutside = (callBack) => {
//   const ref = useRef(null);

//   const handleClickOutside = (e) => {
//     if (ref.current && !ref.current.contains(e.target)) {
//       callBack(e);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('click', handleClickOutside);

//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, []);

//   return ref;
// };

export function usePrevious<T>(value: T, initial: T | null = null) {
  const ref = useRef(initial);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current as NonNullable<typeof ref['current']>;
}

// export function useLastDiff(value, initial = null) {
//   const valueBeforeChange = useRef(initial);
//   const lastValue = usePrevious(value, value);

//   if (lastValue !== value) {
//     valueBeforeChange.current = lastValue;
//   }

//   return valueBeforeChange.current;
// }

export const useForceUpdate = () => {
  const [, setIt] = useState(false);
  return () => setIt(it => !it);
};

export function useOnChange<T>(value: T, callBack: (last: T) => void) {
  const last = usePrevious(value, value);

  useEffect(() => {
    if (value !== last) {
      callBack(last);
    }
  });
}

// // QUESTION: user ref or state?
// export function useOnChangeTo(value, target, callBack) {
//   const [last, setLast] = useState(value);

//   if (Array.isArray(value)) {
//     let hasChanged = false;
//     let allMatchTarget = true;

//     for (let i = 0; i < value.length; i++) {
//       const currentElem = value[i];
//       const lastElem = last[i];
//       const targetElem = target[i];

//       if (!hasChanged) hasChanged = currentElem !== lastElem;
//       if (currentElem !== targetElem) allMatchTarget = false;
//     }

//     if (hasChanged) {
//       if (allMatchTarget) callBack(last);
//       setLast(value);
//     }
//   } else if (value !== last) {
//     if (value === target) callBack(last);
//     setLast(value);
//   }
// }

/**
 *
 * @param value value to be debounced
 * @param limit limit in ms
 */
export const useThrottle = <T>(value: T, limit: number) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(
    () => {
      const handler = setTimeout(() => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        }
      }, limit - (Date.now() - lastRan.current));

      return () => {
        clearTimeout(handler);
      };
    },
    [value, limit]
  );

  return throttledValue;
};

export function useShortCut(shortcut: string, callback: KeyHandler, inputs?: ReadonlyArray<any>) {
  useEffect(() => {
    hotkeys(shortcut, callback);

    return () => hotkeys.unbind(shortcut, callback);
  }, inputs);
}
