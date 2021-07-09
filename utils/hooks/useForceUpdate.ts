import React, { useState } from 'react';

export function useForceUpdate() {
  const [, setIt] = useState(false);
  return () => setIt((it) => !it);
}
