import { injectCSS } from '@utils/css';

export function circle(size: number) {
  return injectCSS`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${size}px;
  `;
}
