import tinykeys from 'tinykeys';
import React, { useEffect } from 'react';
import { anyFunction } from '@utils/typings';

// TODO: replace hotkeys with tinykeys

export function useShortCut(
  shortcut: string,
  callback: anyFunction,
  inputs?: any[],
) {
  useEffect(() => {
    const remove = tinykeys(window, {
      [shortcut]: callback,
    });

    return remove;
  }, inputs);
}
