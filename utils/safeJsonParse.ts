import { Serializable } from '@utils/typings'

export function safeJsonParse<T>(input: string | undefined | null) {
  if (!input) return undefined

  try {
    return JSON.parse(input) as T
  } catch (err) {
    return undefined
  }
}
