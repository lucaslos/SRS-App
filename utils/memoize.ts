import { anyFunction } from '@utils/typings';

type Options = {
  maxCacheSize?: number;
};

export function memoizer({ maxCacheSize = Infinity }: Options = {}) {
  const cache = new Map<any, any>();

  function trimCache() {
    const cacheSize = cache.size;

    if (cacheSize > maxCacheSize) {
      let index = 0;

      cache.forEach((_, key) => {
        if (index < cacheSize - maxCacheSize) {
          cache.delete(key);
        }

        index++;
      });
    }
  }

  function value<T>(val: (() => T) | T, cacheKey: any): T {
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, typeof val === 'function' ? (val as () => T)() : val);
      trimCache();
    }

    return cache.get(cacheKey);
  }

  function callback<T extends anyFunction>(val: T, cacheKey: any): T {
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, val);
      trimCache();
    }

    return cache.get(cacheKey);
  }

  return {
    value,
    callback,
    clear: () => cache.clear(),
  };
}
