// eslint-disable-next-line no-restricted-imports
import { shade as polishedShade } from 'polished';

/**
 * Shades a color by mixing it with black
 * @param color
 * @param percentage
 */
export function mixWithBlack(
  color: Parameters<typeof polishedShade>[1],
  percentage: Parameters<typeof polishedShade>[0],
) {
  return polishedShade(percentage, color);
}
