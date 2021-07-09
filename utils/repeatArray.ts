export function repeatArray<T extends any[]>(
  array: T | undefined,
  times: number,
): T {
  if (!array) return ([] as unknown) as T;

  return Array(times)
    .fill(0)
    .flatMap(() => array) as T;
}
