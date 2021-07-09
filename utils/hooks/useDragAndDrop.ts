import React, { useCallback, useState } from 'react';

export type DragElementProps = {
  draggable: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragEnd: () => void;
};

export function useDragAndDrop<T = number>({
  disabled,
  onDrop,
}: {
  disabled?: boolean;
  onDrop: (source: T, destination: T) => any;
}) {
  const [isDraggingOver, setIsDraggingOver] = useState<T>();
  const [isDragging, setIsDragging] = useState<T>();

  function handleDragStart(e: any, i: T) {
    setIsDragging(i);
  }

  function handleDragEnter(e: any, i: T) {
    setIsDraggingOver(i);
  }

  function handleDragEnd() {
    setIsDraggingOver(undefined);
    setIsDragging(undefined);
  }

  const handleOnDrop = useCallback(() => {
    if (disabled || isDragging === undefined || isDraggingOver === undefined) {
      return;
    }

    if (isDraggingOver !== isDragging) {
      onDrop(isDragging, isDraggingOver);
    }

    setIsDraggingOver(undefined);
    setIsDragging(undefined);
  }, [disabled, isDragging, isDraggingOver, onDrop]);

  return {
    getDragElementProps: useCallback(
      (id: T): DragElementProps => ({
        draggable: !disabled,
        onDragStart: (e: React.DragEvent) => handleDragStart(e, id),
        onDragOver: (e: React.DragEvent) => e.preventDefault(),
        onDrop: handleOnDrop,
        onDragEnter: (e: React.DragEvent) => handleDragEnter(e, id),
        onDragEnd: handleDragEnd,
      }),
      [disabled, handleOnDrop],
    ),
    isDragging,
    isDraggingOver,
  };
}
