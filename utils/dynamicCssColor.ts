import { getAutoIncrementId } from '@utils/getAutoIncrementId'

type Rgb = {
  red: number
  green: number
  blue: number
}

export function createDynamicCssColor() {
  const colorId = `dynamic-${getAutoIncrementId()}`

  function set(rgb: Rgb) {
    return `
      --${colorId}-r: ${rgb.red};
      --${colorId}-g: ${rgb.green};
      --${colorId}-b: ${rgb.blue};
    `
  }

  function _alpha(alpha: number) {
    return `rgba(var(--${colorId}-r), var(--${colorId}-g), var(--${colorId}-b), ${alpha})`
  }

  function mix(withColor: Rgb, percentage: number, alpha = 1) {
    const weight = percentage / 100

    return `rgba(${[
      `calc(var(--${colorId}-r) + (${withColor.red} - var(--${colorId}-r)) * ${weight})`,
      `calc(var(--${colorId}-g) + (${withColor.green} - var(--${colorId}-g)) * ${weight})`,
      `calc(var(--${colorId}-b) + (${withColor.blue} - var(--${colorId}-b)) * ${weight})`,
    ].join(',')}, ${alpha})`
  }

  return {
    set,
    alpha: _alpha,
    var: _alpha(1),
    mix,
    darker: (percentage: number, alpha?: number) => {
      return mix({ red: 0, green: 0, blue: 0 }, percentage, alpha)
    },
    lighter: (percentage: number, alpha?: number) => {
      return mix({ red: 255, green: 255, blue: 255 }, percentage, alpha)
    },
  }
}
