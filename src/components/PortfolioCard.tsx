'use client';

/**
 * Portfolio card component — used in the portfolio selection grid.
 * Displays portfolio name, purpose, allocations, and accent theming.
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { Portfolio } from '@/data/portfolios';
import { ASSET_CLASSES } from '@/data/assetClasses';
import styles from './PortfolioCard.module.css';

interface Props {
  portfolio: Portfolio;
  isRecommended?: boolean;
  onSelect: (id: string) => void;
}

export default function PortfolioCard({ portfolio, isRecommended, onSelect }: Props) {
  const router = useRouter();

  return (
    <div
      className={styles.card}
      style={{
        borderColor: isRecommended ? portfolio.accent : undefined,
        borderWidth: isRecommended ? 2 : undefined,
      }}
    >
      {/* Accent strip */}
      <div
        className={styles.strip}
        style={{ background: portfolio.accent }}
      />

      {/* Recommended badge */}
      {isRecommended && (
        <div
          className={styles.badge}
          style={{ background: portfolio.accentSoft, color: portfolio.accent }}
        >
          Recommended
        </div>
      )}

      <div className={styles.content}>
        <h3 className={styles.name}>{portfolio.name}</h3>
        <p className={styles.purpose}>{portfolio.shortPurpose}</p>

        {/* Mini allocation breakdown */}
        <div className={styles.allocations}>
          {portfolio.allocations.map((a) => (
            <div key={a.asset} className={styles.allocRow}>
              <span
                className={styles.allocDot}
                style={{ background: ASSET_CLASSES[a.asset]?.color }}
              />
              <span className={styles.allocName}>
                {ASSET_CLASSES[a.asset]?.name ?? a.asset}
              </span>
              <span className={styles.allocWeight}>{a.weight}%</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onSelect(portfolio.id)}
          >
            Select
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => router.push(`/portfolios/${portfolio.id}`)}
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}
