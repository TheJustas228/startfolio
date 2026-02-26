'use client';

/**
 * Customization screen — single slider adjusts portfolio allocations
 * in real time with strict diversification guardrails.
 */

import React, { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { getPortfolioById } from '@/data/portfolios';
import { computeSliderAllocations } from '@/lib/sliderLogic';
import { computeIllustrativeMetrics, formatPercent } from '@/lib/metrics';
import AllocationPieChart from '@/components/AllocationPieChart';
import AllocationTable from '@/components/AllocationTable';
import styles from './page.module.css';

export default function CustomizePage() {
  const router = useRouter();
  const {
    selectedPortfolioId,
    sliderValue,
    setSliderValue,
    includeInflationDiversifiers,
    setIncludeInflationDiversifiers,
    setCustomAllocations,
    recommendation,
    resetToRecommended,
  } = useAppContext();

  const portfolio = selectedPortfolioId
    ? getPortfolioById(selectedPortfolioId)
    : null;

  // Compute adjusted allocations from slider
  const sliderResult = useMemo(() => {
    if (!portfolio) return null;
    return computeSliderAllocations(
      portfolio.allocations,
      sliderValue,
      includeInflationDiversifiers
    );
  }, [portfolio, sliderValue, includeInflationDiversifiers]);

  const allocations = sliderResult?.allocations ?? portfolio?.allocations ?? [];

  // Compute illustrative metrics
  const metrics = useMemo(() => {
    return computeIllustrativeMetrics(allocations);
  }, [allocations]);

  // Sync customized allocations to context
  useEffect(() => {
    if (sliderResult) {
      setCustomAllocations(sliderResult.allocations);
    }
  }, [sliderResult, setCustomAllocations]);

  // Redirect if no portfolio selected
  if (!portfolio) {
    return (
      <main className={styles.main}>
        <div className="container">
          <div className={styles.empty}>
            <h2>No portfolio selected</h2>
            <p>Please select a portfolio first.</p>
            <button
              className="btn btn-primary"
              onClick={() => router.push('/portfolios')}
            >
              Browse portfolios
            </button>
          </div>
        </div>
      </main>
    );
  }

  const sliderLabel =
    sliderValue <= 30
      ? 'More Safety'
      : sliderValue >= 70
      ? 'More Growth'
      : 'Balanced';

  return (
    <main className={styles.main}>
      <div className="container">
        {/* Header */}
        <div className={styles.topNav}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => router.push(`/portfolios/${portfolio.id}`)}
          >
            ← Back to {portfolio.name}
          </button>
        </div>

        <div className={styles.pageHeader}>
          <h1>
            Customize:{' '}
            <span style={{ color: portfolio.accent }}>{portfolio.name}</span>
          </h1>
          <p>
            Use the slider to adjust your allocation between safety and growth.
            Diversification guardrails keep your portfolio balanced.
          </p>
        </div>

        {/* Main content: chart + controls side by side */}
        <div className={styles.layout}>
          {/* Left: Chart + table */}
          <div className={styles.vizCol}>
            <div className={styles.chartCard}>
              <AllocationPieChart allocations={allocations} size={260} />
            </div>
            <AllocationTable allocations={allocations} />
          </div>

          {/* Right: Controls */}
          <div className={styles.controlsCol}>
            {/* Slider */}
            <div className={styles.sliderCard}>
              <div className={styles.sliderHeader}>
                <span className={styles.sliderLabel}>Safety ↔ Growth</span>
                <span className={styles.sliderValue}>
                  {sliderValue} — {sliderLabel}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className={styles.slider}
                aria-label="Safety to Growth slider"
              />
              <div className={styles.sliderTicks}>
                <span>Safety</span>
                <span>Growth</span>
              </div>

              {sliderResult?.constraintActive && (
                <p className={styles.constraintNote}>
                  A diversification guardrail is active — some allocations have
                  reached their minimum or maximum bounds.
                </p>
              )}
            </div>

            {/* Inflation diversifiers toggle */}
            <div className={styles.toggleCard}>
              <div className="toggle-wrapper">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={includeInflationDiversifiers}
                    onChange={(e) =>
                      setIncludeInflationDiversifiers(e.target.checked)
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
                <div>
                  <span className={styles.toggleLabel}>
                    Include inflation diversifiers
                  </span>
                  <span className={styles.toggleHint}>
                    Adds commodities exposure when slider is ≤ 60
                  </span>
                </div>
              </div>
            </div>

            {/* Illustrative metrics accordion */}
            <details className={styles.metricsAccordion}>
              <summary>Advanced details (illustrative)</summary>
              <div className={styles.metricsContent}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>
                    Estimated volatility (illustrative)
                  </span>
                  <span className={styles.metricValue}>
                    ~{formatPercent(metrics.volatility)}
                  </span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>
                    Estimated worst-year loss (illustrative)
                  </span>
                  <span className={styles.metricValue}>
                    ~{formatPercent(metrics.worstYearLoss)}
                  </span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>
                    Recovery time intuition (illustrative)
                  </span>
                  <span className={styles.metricDesc}>
                    {metrics.recoveryIntuition}
                  </span>
                </div>
                <p className={styles.metricsDisclaimer}>
                  Illustrative, not guarantees. These are simple heuristic
                  estimates based on assumed per-asset-class risk levels.
                  Replace with real historical calculations when data is
                  connected.
                </p>
              </div>
            </details>

            {/* Reset */}
            {recommendation && (
              <button
                className="btn btn-outline btn-sm"
                onClick={resetToRecommended}
                style={{ width: '100%' }}
              >
                Reset to recommended
              </button>
            )}
          </div>
        </div>

        {/* Continue */}
        <div className={styles.continueBar}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => router.push('/summary')}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
