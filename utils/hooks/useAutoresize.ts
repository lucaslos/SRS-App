import { debounce } from '@utils/debounce';
import React, { useState, useEffect, RefObject } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const useAutoresize = (elementRef: RefObject<any>, debounceMs?: number) => {
  const [{ width, height }, setMeasurements] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    const debouncedSetMeasurements = debounceMs
      ? debounce((size: { width: number; height: number }) => {
          setMeasurements(size);
        }, debounceMs)
      : setMeasurements;

    const observer = new ResizeObserver(([{ contentRect }]) => {
      debouncedSetMeasurements({
        width: contentRect.width,
        height: contentRect.height,
      });
    });

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [elementRef]);
  return { width, height };
};

export default useAutoresize;
