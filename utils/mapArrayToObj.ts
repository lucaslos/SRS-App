import { anyObj } from '@utils/typings';

export function mapArrayToObj<
  K extends string,
  T extends any[] | readonly any[],
  O
>(array: T, mapFunction: (item: T[number]) => [K, O]) {
  const obj: { [k in K]: O } = {} as any;

  for (let i = 0; i < array.length; i++) {
    const [key, value] = mapFunction(array[i]);

    obj[key] = value;
  }

  return obj;
}

const obj = mapArrayToObj([1, 2, 3], (num) => [`i${num}`, num]);
