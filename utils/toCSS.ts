import { anyObj } from '@utils/typings';

// source: https://github.com/callstack/linaria/blob/master/src/babel/utils/toCSS.ts
type Serializable =
  | boolean
  | number
  | string
  | undefined
  | null
  | Serializable[]
  | { [key: string]: Serializable };

const constructors = ['Number', 'String'];

function isBoxedPrimitive(o: any): o is number | string {
  return (
    constructors.includes(o.constructor.name) &&
    typeof o?.valueOf() !== 'object'
  );
}

const unitless = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};

function isSerializable(o: any): o is Serializable {
  return (
    (Array.isArray(o) && o.every(isSerializable)) ||
    (typeof o === 'object' &&
      o !== null &&
      (o.constructor.name === 'Object' || isBoxedPrimitive(o)))
  );
}

const hyphenate = (s: string) =>
  /^--/.test(s)
    ? s
    : s
        // Hyphenate CSS property names from camelCase version from JS string
        .replace(/([A-Z])/g, (match, p1) => `-${p1.toLowerCase()}`)
        // Special case for `-ms` because in JS it starts with `ms` unlike `Webkit`
        .replace(/^ms-/, '-ms-');

export function toCSS(o: anyObj<Serializable>): string {
  if (Array.isArray(o)) {
    return o.map(toCSS).join('\n');
  }

  if (isBoxedPrimitive(o)) {
    return o.valueOf().toString();
  }

  return Object.entries(o)
    .filter(
      ([, value]) =>
        // Ignore all falsy values except numbers
        typeof value === 'number' || value,
    )
    .map(([key, value]) => {
      if (isSerializable(value)) {
        return `${key} { ${toCSS(value as any)} }`;
      }

      return `${hyphenate(key)}: ${
        typeof value === 'number' &&
        value !== 0 &&
        // Strip vendor prefixes when checking if the value is unitless
        !(
          key.replace(
            /^(Webkit|Moz|O|ms)([A-Z])(.+)$/,
            (match, p1, p2, p3) => `${p2.toLowerCase()}${p3}`,
          ) in unitless
        )
          ? `${value}px`
          : value
      };`;
    })
    .join(' ');
}
