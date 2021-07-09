export function pipe<T1, R>(input: T1, fn1: (a: T1) => R): R;
export function pipe<T1, T2, R>(
  input: T1,
  fn1: (a: T1) => T2,
  fn2: (a: T2) => R,
): R;
export function pipe<T1, T2, T3, R>(
  input: T1,
  fn1: (a: T1) => T2,
  fn2: (a: T2) => T3,
  fn3: (a: T3) => R,
): R;
export function pipe<T1, T2, T3, T4, R>(
  input: T1,
  fn1: (a: T1) => T2,
  fn2: (a: T2) => T3,
  fn3: (a: T3) => T4,
  fn4: (a: T4) => R,
): R;
export function pipe<T1, T2, T3, T4, T5, R>(
  input: T1,
  fn1: (a: T1) => T2,
  fn2: (a: T2) => T3,
  fn3: (a: T3) => T4,
  fn4: (a: T4) => T5,
  fn5: (a: T5) => R,
): R;

/** A ponyfill to pipeline operator https://github.com/tc39/proposal-pipeline-operator */
export function pipe(
  input: unknown,
  ...fns: ((a: unknown) => unknown)[]
): unknown {
  let result = input;

  for (const func of fns) {
    result = func(result);
  }

  return result;
}
