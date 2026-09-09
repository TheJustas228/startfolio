'use client';

/**
 * Global cursor-following purple glow orb.
 * Renders on every page; use fixed positioning so it follows the mouse across
 * the viewport. Skipped for pointer-less devices (CSS) and for visitors who
 * prefer reduced motion (below).
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';
import styles from './CursorGlow.module.css';

export default function CursorGlow() {
  const orbRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!orbRef.current) return;
    orbRef.current.style.left = `${e.clientX}px`;
    orbRef.current.style.top = `${e.clientY}px`;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || reducedMotion) return;
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted, reducedMotion, handleMouseMove]);

  // A glow that chases the cursor is motion; drop it entirely when the
  // visitor has asked for less of it, rather than tracking invisibly.
  if (!mounted || reducedMotion) return null;

  return <div className={styles.glowOrb} ref={orbRef} aria-hidden />;
}
