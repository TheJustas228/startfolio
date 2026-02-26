'use client';

import { usePathname } from 'next/navigation';
import GalaxyBackground from './GalaxyBackground';
import SpaceBackground from './SpaceBackground';

/**
 * Renders full galaxy on home, simple "space with a few stars" on all other pages.
 */
export default function AppBackground() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return isHome ? <GalaxyBackground /> : <SpaceBackground />;
}
