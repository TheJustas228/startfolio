'use client';

/**
 * Reports whether the visitor has asked the OS to reduce motion.
 *
 * Returns `true` until the media query has been read on the client, so
 * animations start opted-out and only switch on once we know it is welcome.
 * That also keeps server and first client render in agreement.
 */

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export default function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
