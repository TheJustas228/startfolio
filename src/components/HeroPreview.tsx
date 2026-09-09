'use client';

/**
 * Live product preview for the landing hero.
 *
 * Renders the real model portfolios from `data/portfolios.ts` through the
 * real metrics engine, so the marketing page can never drift from the app.
 * Auto-advances through the four portfolios unless the visitor has asked
 * for reduced motion; the tabs stay clickable either way.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PORTFOLIOS } from '@/data/portfolios';
import { ASSET_CLASSES, ASSET_CLASS_ORDER, AssetClassKey } from '@/data/assetClasses';
import { computeIllustrativeMetrics, formatPercent } from '@/lib/metrics';
import useReducedMotion from '@/hooks/useReducedMotion';
import styles from './HeroPreview.module.css';

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ROTATE_MS = 4200;

export default function HeroPreview() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % PORTFOLIOS.length),
      ROTATE_MS
    );
    return () => window.clearInterval(id);
  }, [reducedMotion, paused]);

  const portfolio = PORTFOLIOS[active];

  /**
   * Weights for every asset class, including the ones this portfolio does
   * not hold. Keeping all five segments mounted lets the donut morph between
   * portfolios instead of tearing down and rebuilding.
   */
  const weights = useMemo(() => {
    const map = {} as Record<AssetClassKey, number>;
    for (const key of ASSET_CLASS_ORDER) map[key] = 0;
    for (const a of portfolio.allocations) map[a.asset] = a.weight;
    return map;
  }, [portfolio]);

  const metrics = useMemo(
    () => computeIllustrativeMetrics(portfolio.allocations),
    [portfolio]
  );

  // Cumulative offsets so each arc starts where the previous one ended.
  let cumulative = 0;
  const segments = ASSET_CLASS_ORDER.map((key) => {
    const fraction = weights[key] / 100;
    const segment = { key, fraction, offset: cumulative };
    cumulative += fraction;
    return segment;
  });

  const stockWeight = weights.globalStocks;

  return (
    <div
      className={styles.frame}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Faux window chrome, so the preview reads as the product itself */}
      <div className={styles.chrome} aria-hidden>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.chromeLabel}>startfolio.co/summary</span>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Model portfolios">
        {PORTFOLIOS.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={i === active}
            className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
            style={
              i === active
                ? { borderColor: p.accent, color: p.accent }
                : undefined
            }
            onClick={() => setActive(i)}
          >
            {p.name.replace(' Balanced', '').replace(' Focus', '')}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.chartWrap}>
          <svg viewBox="0 0 140 140" className={styles.donut} role="img"
               aria-label={`${portfolio.name}: ${portfolio.allocations
                 .map((a) => `${ASSET_CLASSES[a.asset].name} ${a.weight}%`)
                 .join(', ')}`}>
            <circle
              cx="70" cy="70" r={RADIUS}
              className={styles.track}
            />
            {segments.map((s) => (
              <circle
                key={s.key}
                cx="70" cy="70" r={RADIUS}
                className={styles.segment}
                stroke={ASSET_CLASSES[s.key].color}
                strokeDasharray={`${s.fraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={-s.offset * CIRCUMFERENCE}
              />
            ))}
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutValue}>{stockWeight}%</span>
            <span className={styles.donutLabel}>in stocks</span>
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.portfolioName} style={{ color: portfolio.accent }}>
            {portfolio.name}
          </p>
          <ul className={styles.rows}>
            {ASSET_CLASS_ORDER.filter((key) => weights[key] > 0).map((key) => (
              <li key={key} className={styles.row}>
                <span
                  className={styles.swatch}
                  style={{ background: ASSET_CLASSES[key].color }}
                />
                <span className={styles.rowName}>{ASSET_CLASSES[key].name}</span>
                <span className={styles.rowWeight}>{weights[key]}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Est. volatility</span>
          <span className={styles.metricValue}>
            {formatPercent(metrics.volatility)}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Worst year</span>
          <span className={styles.metricValue}>
            {formatPercent(metrics.worstYearLoss)}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Avg. return</span>
          <span className={styles.metricValue}>
            {formatPercent(metrics.estimatedReturn)}
          </span>
        </div>
      </div>

      <div className={styles.previewFoot}>
        <span className={styles.illustrative}>Illustrative — not a forecast</span>
        <Link href={`/portfolios/${portfolio.id}`} className={styles.previewLink}>
          Open this portfolio →
        </Link>
      </div>
    </div>
  );
}
