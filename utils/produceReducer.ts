import { produce, isDraft } from 'immer';
import { anyObj } from '@utils/typings';

type ArrayItemWithId = { id: string | number; [k: string]: any };

// TODO: api: prevent creation of a id column

function checkIfIsDraft(input: any) {
  if (import.meta.env.DEV) {
    if (!isDraft(input)) {
      throw new Error('Input is not draft');
    }
  }
}

export function produceReducer<T, P>(
  reducer: (state: T, payload: P) => void | undefined | T,
) {
  return produce(reducer) as (state: T, payload: P) => T;
}

export function updateOrAddToArray<T extends ArrayItemWithId>(
  draftArr: T[] | undefined | null,
  newItems: T[],
) {
  if (!draftArr) return;
  checkIfIsDraft(draftArr);

  newItems.forEach((newItem) => {
    const itemIndex = draftArr.findIndex(
      (currItem) => newItem.id === currItem.id,
    );

    if (itemIndex !== -1) {
      draftArr[itemIndex] = newItem;
    } else {
      draftArr.push(newItem);
    }
  });
}

export function deleteItemFromArray<T extends ArrayItemWithId>(
  draftArr: T[] | undefined | null,
  idToDelete: T['id'],
) {
  if (!draftArr) {
    return;
  }

  checkIfIsDraft(draftArr);

  const itemIndex = draftArr.findIndex(
    (currItem) => idToDelete === currItem.id,
  );
  if (itemIndex !== -1) draftArr.splice(itemIndex, 1);
}

export function updateArrayItem<T extends ArrayItemWithId>(
  draftArr: T[] | undefined | null,
  id: T['id'],
  updateFn: (item: T) => void,
) {
  if (!draftArr) {
    return;
  }

  checkIfIsDraft(draftArr);

  const itemIndex = draftArr.findIndex((currItem) => id === currItem.id);

  if (itemIndex !== -1) {
    updateFn(draftArr[itemIndex]);
  }
}

export function mergeDraftObj<T extends anyObj>(
  draftObj: T | undefined | null,
  updateValues: Partial<T>,
) {
  if (!draftObj) {
    return;
  }

  checkIfIsDraft(draftObj);

  // TODO: check if obj spread is better

  Object.keys(updateValues).forEach((key: keyof T) => {
    draftObj[key] = updateValues[key] as T[keyof T];
  });
}
