import { anyObj } from '@utils/typings';

export function getById<T extends anyObj & { id: string | number }>(
  array: T[],
  id: T['id'],
) {
  return array.find((item) => item.id === id);
}
