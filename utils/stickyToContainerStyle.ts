import { clampMin } from '@utils/clamp';

export function stickyToContainerStyle(
  container: {
    width: number;
    height: number;
  },
  refElement: {
    left: number;
    top: number;
    width: number;
    height: number;
  },
  {
    minHeight = refElement.height,
    minWidth = refElement.width,
    margin = 8,
  }: {
    minWidth?: number;
    minHeight?: number;
    margin?: number;
  },
) {
  const aling: { x: 'left' | 'right'; y: 'top' | 'bottom' } = {
    x: 'left',
    y: 'top',
  };

  const rightDistance =
    container.width - (refElement.left + clampMin(refElement.width, minWidth));
  const bottomDistance =
    container.height -
    (refElement.top + clampMin(refElement.height, minHeight));

  if (rightDistance <= 0) {
    aling.x = 'right';
  }

  if (bottomDistance <= 0) {
    aling.y = 'bottom';
  }

  return {
    left: aling.x === 'left' ? clampMin(refElement.left, margin) : 'auto',
    right: aling.x === 'right' ? clampMin(rightDistance, margin) : 'auto',
    top: aling.y === 'top' ? clampMin(refElement.top, 0) : 'auto',
    bottom: aling.y === 'bottom' ? clampMin(bottomDistance, margin) : 'auto',
    minWidth,
    minHeight,
    maxWidht: container.width,
  };
}
