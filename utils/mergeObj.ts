import deepmerge from 'deepmerge';

export function mergeObj<T>(
  x: Partial<T>,
  y: Partial<T>,
  overwriteMerge = (_: any, sourceArray: any) => sourceArray,
) {
  return deepmerge(x, y, { arrayMerge: overwriteMerge });
}
