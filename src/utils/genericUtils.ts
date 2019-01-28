export const isDev = process.env.NODE_ENV === 'development';

export function shuffle<T extends any[]>(array: T) {
  let currentIndex = array.length;

  let temporaryValue;

  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function replaceAt<T>(array: T[], index: number, value: T) {
  const ret = array.slice(0);
  ret[index] = value;
  return ret;
}

export function timeToDate(timeStamp: number) {
  const date = new Date(timeStamp * 1000);
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();

  const addZero = (i: number) => (i < 10 ? `0${i}` : i);

  return `${yyyy}-${addZero(mm)}-${addZero(dd)}`;
}

export function addUniqueObjToArray<T extends anyObject = anyObject>(unique: T, array: T[], key = 'id') {
  if (array.some(currElem => unique[key] === currElem[key])) {
    return array;
  }

  return [...array, unique];
}

export function addUniqueToArray<T = any>(unique: T, array: T[]) {
  if (array.includes(unique)) {
    return array;
  }

  return [...array, unique];
}

/**
 * Convert milliseconds to time string (hh:mm:ss).
 *
 * @param Number ms
 *
 * @return String
 */
export function time(ms: string | number | Date) {
  return new Date(ms).toISOString().slice(11, 19);
}

export function getLastElem(array: any[]) {
  return array[array.length - 1];
}

export function clamp(num: number, min: number, max: number) {
  return num > max ? max : num < min ? min : num;
}

export const clampMin = (num: number, min: number) => (num < min ? min : num);

export const clampMax = (num: number, max: number) => (num > max ? max : num);
