export function reorderItemOnArray<T extends any[]>(
  arr: T,
  startIndex: number,
  endIndex: number,
) {
  const result = Array.from(arr);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}
