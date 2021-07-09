import { injectCSS } from '@utils/css';

export function anchorTextColor(color: string) {
  return injectCSS`
    color: ${color};

    &:visited {
      color: ${color};
    }
  `;
}
