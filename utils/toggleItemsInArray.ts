export function toggleItemsInArray<T>(array: T[], itemsToToggle: T[]) {
  let result = [...array];

  itemsToToggle.forEach((item) => {
    if (array.indexOf(item) === -1) {
      result.push(item);
    } else {
      result = result.filter((elem) => elem !== item);
    }
  });

  return result;
}
