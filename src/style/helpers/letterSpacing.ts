import { injectCSS } from '@utils/css';
/**
 *
 * @param emSize size in em unit
 */
export function letterSpacing(percentage: number) {
  return injectCSS`
    letter-spacing: ${percentage / 100}em;
    margin-right: -${percentage / 100}em;
  `;
}
