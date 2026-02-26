'use client';

/**
 * Global cursor-following purple glow orb.
 * Renders on every page; use fixed positioning so it follows the mouse across the viewport.
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import styles from './CursorGlow.module.css';

export default function CursorGlow() {
  const orbRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!orbRef.current) return;
    orbRef.current.style.left = `${e.clientX}px`;
    orbRef.current.style.top = `${e.clientY}px`;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted, handleMouseMove]);

  if (!mounted) return null;

  return <div className={styles.glowOrb} ref={orbRef} aria-hidden />;
}
