export function matchesOneOf<T, U extends T>(
  value: T,
  oneOf: readonly U[],
): value is U {
  for (let i = 0; i < oneOf.length; i++) {
    if (oneOf[i] === value) {
      return true
    }
  }

  return false
}
