export function getLast<T>(lastOf: T[]) {
  if (lastOf.length === 0) return undefined;

  return lastOf[lastOf.length - 1];
}
