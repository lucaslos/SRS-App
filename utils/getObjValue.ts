import { anyObj, ObjectPropValue } from '@utils/typings';

export function getObjValue<T extends anyObj, D = undefined>(
  obj: T,
  key: any,
  defaultVal: D = (undefined as unknown) as D,
): ObjectPropValue<T> | D {
  return obj[key] || defaultVal;
}
