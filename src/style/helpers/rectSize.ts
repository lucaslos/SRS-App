import { injectCSS } from '@utils/css';
import { parseUnit } from '@utils/parseUnit';

export function rectSize(size: number | string) {
  return injectCSS`
    width: ${parseUnit(size)};
    height: ${parseUnit(size)};
  `;
}
