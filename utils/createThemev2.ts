import { typedObjectEntries } from '@utils/typed';
import { parseToRgb } from 'polished';

const rootStyle = document.documentElement.style;

type ColorProps = {
  var: string;
  raw: string;
  alpha: (alpha: number) => string;
  darker: (percentage: number, alpha?: number) => string;
  lighter: (percentage: number, alpha?: number) => string;
};

let autoId = 1;

export function createThemeColors<C extends Record<string, string>>(colors: C) {
  const themeColors: Record<keyof C, ColorProps> = {} as any;

  for (const [name, color] of typedObjectEntries(colors)) {
    const rgb = parseToRgb(color);

    const colorId = `c${autoId}`;
    autoId++;

    rootStyle.setProperty(`--${colorId}-r`, String(rgb.red));
    rootStyle.setProperty(`--${colorId}-g`, String(rgb.green));
    rootStyle.setProperty(`--${colorId}-b`, String(rgb.blue));
    rootStyle.setProperty(`--${colorId}`, color);

    themeColors[name] = {
      var: `var(--${colorId})`,
      raw: color,
      alpha: (alpha) =>
        `rgba(var(--${colorId}-r), var(--${colorId}-g), var(--${colorId}-b), ${alpha})`,
      darker: (percentage, alpha) => {
        const weight = percentage / 100;

        return `${alpha ? 'rgba' : 'rgb'}(${[
          `calc(var(--${colorId}-r) - var(--${colorId}-r) * ${weight})`,
          `calc(var(--${colorId}-g) - var(--${colorId}-g) * ${weight})`,
          `calc(var(--${colorId}-b) - var(--${colorId}-b) * ${weight})`,
        ].join(',')}${alpha !== undefined ? `, ${alpha}` : ''})`;
      },
      lighter: (percentage, alpha) => {
        const weight = percentage / 100;

        // mix function = c1r + (c2r - c1r) * weight, for each rgb value
        return `${alpha ? 'rgba' : 'rgb'}(${[
          `calc(var(--${colorId}-r) + (255 - var(--${colorId}-r)) * ${weight})`,
          `calc(var(--${colorId}-g) + (255 - var(--${colorId}-g)) * ${weight})`,
          `calc(var(--${colorId}-b) + (255 - var(--${colorId}-b)) * ${weight})`,
        ].join(',')}${alpha !== undefined ? `, ${alpha}` : ''})`;
      },
    };
  }

  return themeColors;
}
