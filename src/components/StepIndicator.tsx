'use client';

/**
 * Subtle step indicator — calm dots, no gamification.
 */

import React from 'react';
import styles from './StepIndicator.module.css';

interface Props {
  total: number;
  current: number;
}

export default function StepIndicator({ total, current }: Props) {
  return (
    <div className={styles.wrapper} role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
      <div className={styles.dots}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i <= current ? styles.active : ''}`}
          />
        ))}
      </div>
      <span className={styles.label}>
        {current + 1} of {total}
      </span>
    </div>
  );
}
