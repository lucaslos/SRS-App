import { injectCSS, CSSProperties } from '@utils/css';
import { isBrowser } from '@utils/isBrowser';
import { anyObj } from '@utils/typings';
import { parseToRgb } from 'polished';

type VarsObj = {
  [k: string]: string | readonly string[];
};

type Theme = {
  [k: string]: VarsObj;
};

const rootElement = (isBrowser && document.documentElement) as HTMLElement;

function numToSSColumn(num: number) {
  let _num = num;
  let s = '';
  let t: number;

  while (_num > 0) {
    t = (_num - 1) % 26;
    s = String.fromCharCode(97 + t) + s;
    _num = ((_num - t) / 26) | 0;
  }

  return s;
}

let themeVarsPos: anyObj;

function getHashName(scope: string, name: string, theme: Theme) {
  if (!themeVarsPos) {
    themeVarsPos = Object.keys(theme)
      .flatMap((scope2) =>
        Object.keys(theme[scope2]!).map((name2) => `${scope2}${name2}`),
      )
      .reduce((acc, name2, i) => {
        acc[name2] = numToSSColumn(i + 1);
        return acc;
      }, {} as anyObj<string>);
  }

  return themeVarsPos[`${scope}${name}`];
}

function getContrastColor(r: number, g: number, b: number) {
  const sum = Math.round((r * 299 + g * 587 + b * 114) / 1000);
  return sum > 128 ? 'black' : 'white';
}

export function createThemeVars<T extends Theme, S extends keyof T>(
  theme: T,
  scope: S,
) {
  const cssVars: {
    [k in keyof T[S]]: {
      var: string;
      default: string;
      noop?: () => void;
    };
  } = {} as any;

  Object.entries(theme[scope]!).forEach(([name, value]) => {
    cssVars[name as keyof T[S]] = {
      var: `var(--${getHashName(scope, name, theme)})`,
      default: value as string,
    };
  });

  return cssVars;
}

export function applyTheme(theme: Theme, element = rootElement) {
  Object.entries(theme).forEach(([name, value]) => {
    // const varName = `--${name}`;
    // element.style.setProperty(varName, value);
  });
}

export function generateCssVars<T extends Theme>(theme: T, scope: keyof T) {
  return injectCSS(
    Object.entries(theme[scope]).reduce<anyObj<string>>(
      (acc, [name, value]) => {
        acc[`--${getHashName(scope, name, theme)}`] = value as string;
        return acc;
      },
      {} as anyObj<string>,
    ),
  );
}

export function createColorThemeVars<T extends Theme, S extends keyof T>(
  theme: T,
  scope: S,
) {
  const cssVars: {
    [k in keyof T[S]]: {
      var: string;
      rgb: string;
      alpha: (alpha: number) => string;
      darker: (percentage: number, alpha?: number) => string;
      lighter: (percentage: number, alpha?: number) => string;
      contrast: {
        var: string;
        alpha: (alpha: number) => string;
      };
      default: string;
    };
  } = {} as any;

  Object.entries(theme[scope]).forEach(([name, color]) => {
    const colorName = getHashName(scope, name, theme);

    cssVars[name as keyof T] = {
      rgb: `var(--${colorName}-r), var(--${colorName}-g), var(--${colorName}-b)`,
      var: `var(--${colorName})`,
      alpha: (alpha) =>
        `rgba(var(--${colorName}-r), var(--${colorName}-g), var(--${colorName}-b), ${alpha})`,
      darker: (percentage, alpha) => {
        const weight = percentage / 100;

        return `${alpha ? 'rgba' : 'rgb'}(${[
          `calc(var(--${colorName}-r) - var(--${colorName}-r) * ${weight})`,
          `calc(var(--${colorName}-g) - var(--${colorName}-g) * ${weight})`,
          `calc(var(--${colorName}-b) - var(--${colorName}-b) * ${weight})`,
        ].join(',')}${alpha !== undefined ? `, ${alpha}` : ''})`;
      },
      contrast: {
        var: `rgb(var(--${colorName}-c))`,
        alpha: (alpha) => `rgba(var(--${colorName}-c), ${alpha})`,
      },
      lighter: (percentage, alpha) => {
        const weight = percentage / 100;

        // mix function = c1r + (c2r - c1r) * weight, for each rgb value
        return `${alpha ? 'rgba' : 'rgb'}(${[
          `calc(var(--${colorName}-r) + (255 - var(--${colorName}-r)) * ${weight})`,
          `calc(var(--${colorName}-g) + (255 - var(--${colorName}-g)) * ${weight})`,
          `calc(var(--${colorName}-b) + (255 - var(--${colorName}-b)) * ${weight})`,
        ].join(',')}${alpha !== undefined ? `, ${alpha}` : ''})`;
      },
      default: color as string,
    };
  });

  return cssVars;
}

export function applyColorTheme(theme: Theme, element = rootElement) {
  Object.entries(theme).forEach(([name, color]) => {
    // const hsl = parseToHsl(color);
    // element.style.setProperty(`--c-${name}-h`, String(hsl.hue));
    // element.style.setProperty(`--c-${name}-s`, `${hsl.saturation * 100}%`);
    // element.style.setProperty(`--c-${name}-l`, `${hsl.lightness * 100}%`);
  });
}

export function generateCssColorVars<T extends Theme>(
  theme: T,
  scope: keyof T,
) {
  return injectCSS(
    Object.entries(theme[scope]).reduce((acc, [name, color]) => {
      const rgb = parseToRgb(color as string);

      const colorName = getHashName(scope, name, theme);

      const contrastColor = getContrastColor(rgb.red, rgb.green, rgb.blue);

      // TODO: remove spread of all object reducers

      acc[`--${colorName}`] = color as string;
      acc[`--${colorName}-r`] = String(rgb.red);
      acc[`--${colorName}-g`] = String(rgb.green);
      acc[`--${colorName}-b`] = String(rgb.blue);
      acc[`--${colorName}-c`] =
        contrastColor === 'white' ? '255, 255, 255' : '0, 0, 0';

      return acc;
    }, {} as anyObj<string>),
  );
}

export function createThemeVariant<T extends ReadonlyArray<string>>(
  variations: T,
) {
  return (variationsCss: { [k in T[number]]?: string | CSSProperties }) => {
    let generatedCss = '';

    variations.forEach((variation: T[number]) => {
      const style = variationsCss[variation] as
        | string
        | CSSProperties
        | undefined;

      if (style) {
        generatedCss += injectCSS`
          .${variation} & {
            ${injectCSS(style as string)};
          }
        `;
      }
    });

    return generatedCss;
  };
}
