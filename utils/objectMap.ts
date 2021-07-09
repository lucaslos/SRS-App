import { anyObj } from '@utils/typings';

export function objectMap<I extends anyObj, O extends anyObj = I>(
  obj: I,
  callbackFn: Processor<I, O>,
): O {
  const result: O = {} as O;

  Object.keys(obj).forEach((key: keyof I) => {
    result[key] = callbackFn(obj[key], key, obj);
  });

  return result;
}

export type Processor<I, O> = (
  currentValue: NonNullable<I[keyof I]>,
  key: keyof I,
  obj: I,
) => O[keyof O];
