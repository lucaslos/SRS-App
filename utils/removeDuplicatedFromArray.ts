export function filterUnique<T extends any>(
  arr: T[],
  referenceSelector: (item: T) => any,
) {
  const unique = ([] as unknown) as T[];

  arr.map((x) =>
    unique.filter((a) => referenceSelector(a) === referenceSelector(x)).length >
    0
      ? null
      : unique.push(x),
  );

  return unique;
}
