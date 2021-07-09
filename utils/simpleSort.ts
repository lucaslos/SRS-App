type Options = { reverse?: boolean };

export function sortByPriority<T>(
  arr: T[],
  getPriority: (item: T) => number | string,
  { reverse }: Options = {},
) {
  return [...arr].sort((a, b) => {
    const aPriority = getPriority(a);
    const bPriority = getPriority(b);

    if (aPriority < bPriority) {
      return reverse ? -1 : 1;
    }

    if (aPriority > bPriority) {
      return reverse ? 1 : -1;
    }

    return 0;
  });
}

export function sortByString<T>(
  arr: T[],
  getString: (item: T) => string,
  { reverse }: Options = {},
) {
  return [...arr].sort((a, b) => {
    const aString = getString(a);
    const bString = getString(b);

    return (reverse ? -1 : 1) * aString.localeCompare(bString);
  });
}
