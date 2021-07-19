import { createSignal } from 'solid-js'

export function createSet<T>(initial: T[] = []) {
  const [set, setSet] = createSignal(initial)

  function has(item: T | undefined) {
    return set().includes(item as T)
  }

  function add(item: T) {
    setSet((s) => {
      if (s.includes(item)) return s

      return [...s, item]
    })
  }

  function clear() {
    setSet(() => [])
  }

  function remove(item: T) {
    setSet((s) => s.filter((c) => c !== item))
  }

  return {
    has,
    add,
    clear,
    remove,
  }
}
