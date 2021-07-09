import { isBrowser } from '@utils/isBrowser';
import { toCSS } from '@utils/toCSS';

export type CSSProperties = {
  [key: string]: string | number | undefined | CSSProperties;
};

export type CSSPropertiesLinaria = {
  [key: string]: string | number | CSSPropertiesLinaria;
};

type Exprs = string | number | undefined | CSSProperties | null;

export function injectCSS(styleObj: CSSProperties): string;
export function injectCSS(styleString: string): string;
export function injectCSS(
  strings: TemplateStringsArray,
  ...exprs: Exprs[]
): string;
export function injectCSS(
  style: TemplateStringsArray | CSSProperties | string,
  ...exprs: Exprs[]
) {
  if (typeof style === 'string') return style;

  if (!Array.isArray(style)) {
    return toCSS(style as CSSProperties);
  }

  let str = '';

  style.forEach((string, i) => {
    const expr = exprs[i];

    if (expr !== null && typeof expr === 'object') {
      str += string + toCSS(expr);
    } else {
      str += string + (expr ?? '');
    }
  });

  return str;
}
