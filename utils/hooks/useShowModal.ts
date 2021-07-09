import React, { useState } from 'react';

export function useShowModal<D = null>() {
  const [showModal, setShowModal] = useState<
    { show: true; data: D } | { show: false; data: D | null }
  >({
    show: false,
    data: null,
  });

  return {
    ...showModal,
    close: () => setShowModal((state) => ({ ...state, show: false })),
    open: (...args: D extends null ? [] : [data: D]) =>
      setShowModal({ show: true as false, data: args[0] ?? null }),
  };
}
