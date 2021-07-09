import { anyFunction } from '@utils/typings';

export function debounce(func: anyFunction, timeout: number) {
  let timer: number;
  return (...args: any) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func(...args);
    }, timeout);
  };
}
