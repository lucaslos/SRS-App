import { anyObj } from '@utils/typings'
import { dequal } from 'dequal'
import { createEffect, createRoot } from 'solid-js'
import type { Next, Part, StoreSetter } from 'solid-js/store'

export function subscribe(callback: () => any) {
  let disposer: (() => void) | null = null

  createRoot((dispose) => {
    createEffect(() => {
      disposer = dispose
      callback()
    })
  })

  return disposer!
}

export type ReconcileItems<T> = T[]

export function reconcile<T>(
  original: readonly T[],
  newItems: ReconcileItems<T>,
  key: keyof T,
): T[] {
  const final: T[] = []

  const originalMap = new Map<any, T>(original.map((item) => [item[key], item]))

  for (const item of newItems) {
    const currentValue = originalMap.get(item[key])

    if (!currentValue) {
      final.push(item)
    } else if (dequal(currentValue, item)) {
      final.push(currentValue)
    } else {
      final.push(item)
    }
  }

  return final
}

type Filter<T> =
  | 'all'
  | ((item: T) => boolean)
  | number[]
  | { from: number; to: number }

type AnyReturn = [any]

type Setter<T> = Partial<T> | ((current: T) => Partial<T>)

interface TypedArraySet<T> {
  (filter: Filter<T>, setter: Setter<T>): AnyReturn
  <K1 extends keyof T>(
    filter: Filter<T>,
    key: K1,
    setter: Setter<T[K1]>,
  ): AnyReturn
}

function _typedArraySet(
  filter: Filter<unknown>,
  ...args: unknown[]
): AnyReturn {
  return [filter === 'all' ? {} : filter, ...args] as any
}

export function typedArraySet<T>() {
  return _typedArraySet as TypedArraySet<T>
}
