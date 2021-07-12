import { createEffect, createRoot } from 'solid-js'

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
