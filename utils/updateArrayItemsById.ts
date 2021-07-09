import { anyObj } from '@utils/typings';

export function updateArrayItemsById<T extends anyObj>(
  array: T[],
  itemsToUpdate: T[],
  idSelector?: (item: T) => string | number | boolean | null | undefined,
) {
  return array.map((item) => {
    const updatedFilter =
      idSelector && idSelector(item) !== undefined
        ? itemsToUpdate.find(
            (itemToUpdate) => idSelector(itemToUpdate) === idSelector(item),
          )
        : item.id !== undefined
        ? itemsToUpdate.find((itemToUpdate) => itemToUpdate.id === item.id)
        : undefined;

    return updatedFilter || item;
  });
}
