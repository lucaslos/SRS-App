import { anyFunction } from '@utils/typings';

function checkIfTargetContainsRef(
  ref: React.RefObject<HTMLElement>,
  target: Node,
) {
  return ref.current?.contains(target);
}

export function onClickIgnoreRefs(
  callback: anyFunction,
  refsToIgnore: React.RefObject<HTMLElement>[],
) {
  return (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      refsToIgnore.some((item) =>
        checkIfTargetContainsRef(item, event.target as Node),
      )
    ) {
      return;
    }

    callback(event);
  };
}
