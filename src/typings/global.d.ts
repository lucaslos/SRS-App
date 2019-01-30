/* eslint-disable @typescript-eslint/class-name-casing */
interface anyObject<T = any> {
  [key: string]: T;
}

interface genericFunction {
  (...params: any): any;
}

type SerializableObject = {
  [key: string]: Serializable;
};

type ObjectWithKey<K extends string, V = any> = { [P in K]: V };

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type SerializableArray = (
  | string
  | number
  | SerializableObject
  | boolean
  | undefined)[];

type Serializable = | string
  | number
  | boolean
  | null
  | SerializableObject
  | undefined
  | SerializableArray;

type ListOfString = keyof anyObject;

/* state */
type Card = {
  id: string;
  front: string;
  back: string;
  tags?: string[];
  notes?: string[];
  lastReview?: string;
  createdAt?: number;
  wrongReviews: number;
  repetitions: number;
  lang: 'en';
  diff: number;
};

type CardToAdd = Omit<Card, 'id' | 'lastReview' | 'diff' | 'lang' | 'repetitions' | 'wrongReviews'>;

type Results = 'success' | 'hard' | 'wrong';

/* react tag input */
type ReactTagInputResult = {
  id: number;
  text: string;
}[]

/* user */
interface Window {
  userId: firebase.User['uid'];
  firebaseLogOut: () => void;
}
