import { tint as polishedTint } from 'polished';

/**
 * Mix a color with white
 * @param color
 * @param percentage
 */
export function mixWithWhite(
  color: Parameters<typeof polishedTint>[1],
  percentage: Parameters<typeof polishedTint>[0],
) {
  return polishedTint(percentage, color);
}
