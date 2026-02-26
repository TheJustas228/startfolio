'use client';

/**
 * ETF examples toggle — hidden by default.
 * Clearly labeled as examples only, not recommendations.
 */

import React from 'react';
import { AssetClassKey, ASSET_CLASSES } from '@/data/assetClasses';
import styles from './ETFToggle.module.css';

interface Props {
  assetKey: AssetClassKey;
}

export default function ETFToggle({ assetKey }: Props) {
  const asset = ASSET_CLASSES[assetKey];
  if (!asset || !asset.exampleETFs.length) return null;

  return (
    <details className={styles.details}>
      <summary>Example ETFs</summary>
      <div className={styles.content}>
        <p className={styles.disclaimer}>
          Examples only; not personalized recommendations. Do your own research
          or consult a financial advisor before investing.
        </p>
        <ul className={styles.list}>
          {asset.exampleETFs.map((etf) => (
            <li key={etf.ticker}>
              <strong>{etf.ticker}</strong>
              <span> — {etf.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
