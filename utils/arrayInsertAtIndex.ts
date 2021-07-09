export function arrayInsertAtIndex<T>(arr: T[], index: number, ...items: T[]) {
  return [...arr.slice(0, index), ...items, ...arr.slice(index)];
}
