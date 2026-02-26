'use client';

/**
 * Simple "space with a few stars" background for non-home pages.
 * Deep purple gradient, sparse starfield, one soft horizontal glow band.
 */

import React, { useMemo } from 'react';
import styles from './SpaceBackground.module.css';

const STAR_COUNT = 55;
const SEED = 67890;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateStars(count: number, seed: number) {
  const stars: { x: number; y: number; r: number; opacity: number }[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = seededRandom(s + 1);
    stars.push({
      x: seededRandom(s + 2) * 100,
      y: seededRandom(s + 3) * 100,
      r: 0.35 + seededRandom(s + 4) * 0.9,
      opacity: 0.4 + seededRandom(s + 5) * 0.5,
    });
  }
  return stars;
}

export default function SpaceBackground() {
  const stars = useMemo(() => generateStars(STAR_COUNT, SEED), []);

  return (
    <div className={styles.wrapper} aria-hidden>
      <div className={styles.baseGradient} />
      <div className={styles.glowBand} />
      <svg className={styles.starfield} preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="spaceStarGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.25" result="blur" />
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
            fill="rgba(255,255,255,0.9)"
            opacity={star.opacity}
            filter="url(#spaceStarGlow)"
          />
        ))}
      </svg>
    </div>
  );
}
