import { injectCSS } from '@utils/css';

const justifyValues = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
} as const;

const alignValues = {
  top: 'flex-start',
  bottom: 'flex-end',
  center: 'center',
  stretch: 'stretch',
} as const;

export function inlineSpacing(spacing?: string | number) {
  return spacing
    ? {
        '> *:not(:last-child)': {
          marginRight: spacing || 0,
        },
      }
    : '';
}

export type InlineProps = {
  justify?: keyof typeof justifyValues;
  align?: keyof typeof alignValues;
  gap?: string | number;
};

export const inline = ({
  justify = 'left',
  align = 'center',
  gap,
}: InlineProps = {}) =>
  injectCSS({
    display: 'flex',
    columnGap: gap,
    justifyContent: justifyValues[justify],
    alignItems: alignValues[align],
  });
