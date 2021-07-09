import { anyFunction } from '@utils/typings';

export function throttle(func: anyFunction, timeout: number) {
  let ready = true;

  return (...args: any) => {
    if (!ready) {
      return;
    }

    ready = false;
    func(...args);
    setTimeout(() => {
      ready = true;
    }, timeout);
  };
}
