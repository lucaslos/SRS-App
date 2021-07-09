import { anyObj } from '@utils/typings';

export function objectEntries<T extends anyObj>(
  object: T,
): { key: keyof T; value: T[keyof T] }[] {
  return Object.keys(object).map((key: keyof T) => ({
    key,
    value: object[key],
  }));
}
