import { Serializable } from '@utils/typings';

export function safeJsonParse<T extends Serializable = Serializable>(
  input: string | undefined | null,
) {
  if (!input) return undefined;

  try {
    return JSON.parse(input) as T;
  } catch (err) {
    return undefined;
  }
}
