import { deepEqual } from 't-state';

export function matchesOneOf<T, U extends T>(
  value: T,
  oneOf: readonly U[],
): value is U {
  for (let i = 0; i < oneOf.length; i++) {
    if (deepEqual(oneOf[i], value)) {
      return true;
    }
  }

  return false;
}

export function notMatchesOneOf<T, U extends T>(
  value: T,
  oneOf: readonly U[],
): value is Exclude<T, U> {
  for (let i = 0; i < oneOf.length; i++) {
    if (deepEqual(oneOf[i], value)) {
      return false;
    }
  }

  return true;
}
