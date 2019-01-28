/* eslint-disable @typescript-eslint/class-name-casing */
interface anyObject<T = any> {
  [key: string]: T;
}

interface genericFunction {
  (...params: any): any;
}

type SerializableObject = {
  [key: string]: Serializable;
}

type ObjectWithKey<K extends string, V = any> = {
  [P in K]: V;
}

type SerializableArray = (string | number | SerializableObject | boolean | undefined)[];

type Serializable = string | number | boolean | SerializableObject | undefined | SerializableArray;

type ListOfString = keyof anyObject;

type SecondArgument<T> = T extends (arg1: any, arg2: infer U, ...args: any[]) => any ? U : any;

/* state */
type Card = {
  id: number | string;
  front: string;
  back: string;
  tags?: string[];
  notes?: string[];
  lastReview?: string;
  wrongReviews: number;
  repetitions: number;
  lang: string;
  diff: number;
}

type Results = 'success' | 'hard' | 'wrong';
