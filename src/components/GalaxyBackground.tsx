'use client';

/**
 * Full-viewport galaxy background: deep purple/indigo gradient,
 * soft nebula glows, and scattered star dots. TrustBit-style cosmic look.
 */

import React, { useMemo } from 'react';
import styles from './GalaxyBackground.module.css';

const STAR_COUNT = 180;
const SEED = 12345;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateStars(count: number, seed: number) {
  const stars: { x: number; y: number; r: number; opacity: number; blue: boolean }[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = seededRandom(s + 1);
    const x = seededRandom(s + 2);
    const y = seededRandom(s + 3);
    const r = seededRandom(s + 4);
    const opacity = seededRandom(s + 5);
    const blue = seededRandom(s + 6) > 0.7;
    stars.push({
      x: x * 100,
      y: y * 100,
      r: 0.4 + r * 1.4,
      opacity: 0.5 + opacity * 0.5,
      blue,
    });
  }
  return stars;
}

export default function GalaxyBackground() {
  const stars = useMemo(() => generateStars(STAR_COUNT, SEED), []);

  return (
    <div className={styles.wrapper} aria-hidden>
      {/* Base cosmic gradient */}
      <div className={styles.baseGradient} />

      {/* Soft nebula blobs */}
      <div className={styles.nebula1} />
      <div className={styles.nebula2} />
      <div className={styles.nebula3} />
      <div className={styles.nebula4} />
      <div className={styles.nebula5} />
      <div className={styles.nebula6} />

      {/* Starfield */}
      <svg className={styles.starfield} preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {stars.map((star, i) => (
          <circle
            key={i}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.r}
            fill={star.blue ? 'rgba(200,220,255,0.9)' : 'rgba(255,255,255,0.95)'}
            opacity={star.opacity}
            filter="url(#starGlow)"
          />
        ))}
      </svg>
    </div>
  );
}
