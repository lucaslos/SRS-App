import { animate, velocityPerSecond } from 'popmotion'
import { createEffect, createSignal, onCleanup, untrack } from 'solid-js'

export function useSpring(
  syncWith: () => number,
  options: {
    stiffness?: number
    disable?: boolean
    mass?: number
    damping?: number
  } = { stiffness: 300, mass: 1, damping: 26 },
) {
  let nextInitialVelocity = 0
  let prev = 0
  let current = 0
  let prevTimestamp = 0
  let currentTimestamp = 0

  const defaultValue = syncWith()

  const [montionValue, setMotionValue] = createSignal(defaultValue)

  createEffect(() => {
    const from = untrack(montionValue)

    const to = syncWith()

    if (from === to) {
      return
    }

    const animation = animate({
      ...options,
      type: 'spring',
      velocity: nextInitialVelocity,
      from,
      to,
      onUpdate: (latest) => {
        prev = current
        current = latest

        prevTimestamp = currentTimestamp
        currentTimestamp = performance.now()

        setMotionValue(latest)
      },
      onComplete: () => {
        current = prev
      },
    })

    onCleanup(() => {
      const frameTime = currentTimestamp - prevTimestamp

      nextInitialVelocity = velocityPerSecond(current - prev, frameTime)

      animation.stop()
    })
  })

  return montionValue
}
