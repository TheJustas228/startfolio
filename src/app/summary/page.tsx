'use client';

/**
 * Summary screen — final view of selected portfolio and allocations
 * with plain-English guidance and reminders.
 */

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { getPortfolioById } from '@/data/portfolios';
import { computeIllustrativeMetrics } from '@/lib/metrics';
import AllocationPieChart from '@/components/AllocationPieChart';
import AllocationTable from '@/components/AllocationTable';
import styles from './page.module.css';

export default function SummaryPage() {
  const router = useRouter();
  const {
    selectedPortfolioId,
    customAllocations,
    sliderValue,
    resetAll,
  } = useAppContext();

  const portfolio = selectedPortfolioId
    ? getPortfolioById(selectedPortfolioId)
    : null;

  const allocations = customAllocations ?? portfolio?.allocations ?? [];

  const metrics = useMemo(
    () => computeIllustrativeMetrics(allocations),
    [allocations]
  );

  if (!portfolio) {
    return (
      <main className={styles.main}>
        <div className="container">
          <div className={styles.empty}>
            <h2>No portfolio selected</h2>
            <p>Please start the process to build your portfolio.</p>
            <button className="btn btn-primary" onClick={() => router.push('/')}>
              Go to Start
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Determine tone based on slider
  const isSafetyOriented = sliderValue <= 35;
  const isGrowthOriented = sliderValue >= 65;

  const whatToExpect = isSafetyOriented
    ? `Your ${portfolio.name} allocation leans toward safety. This means smaller short-term fluctuations and more stability, but lower long-term growth potential. You may see modest dips during market downturns, but they should be more contained than an equity-heavy portfolio. The trade-off is that your returns may not keep up with more aggressive portfolios during bull markets — and that is by design. Patience and consistency matter more than chasing higher returns.`
    : isGrowthOriented
    ? `Your ${portfolio.name} allocation leans toward growth. This means higher expected long-term returns, but with larger short-term fluctuations. You should be prepared for temporary declines that can feel significant — potentially 20–30% or more during severe bear markets. The key is staying invested through those periods. Historically, disciplined long-term investors have been rewarded, but there are no guarantees. Only allocate money you truly will not need for many years.`
    : `Your ${portfolio.name} allocation balances growth and stability. You can expect moderate fluctuations — some years will be positive, some negative, and occasionally the swings can be meaningful. This balanced approach aims to grow your wealth over time while keeping drawdowns more manageable than an all-stock portfolio. Stay consistent, avoid reacting to short-term market noise, and trust the diversification built into this allocation.`;

  const handleStartOver = () => {
    resetAll();
    router.push('/');
  };

  return (
    <main className={styles.main}>
      <div className="container">
        {/* Header */}
        <div className={styles.header} style={{ background: portfolio.accentSoft }}>
          <div
            className={styles.headerAccent}
            style={{ background: portfolio.accent }}
          />
          <p className={styles.headerLabel}>Your Portfolio</p>
          <h1 style={{ color: portfolio.accent }}>{portfolio.name}</h1>
        </div>

        {/* Allocation */}
        <div className={styles.allocationSection}>
          <div className={styles.chartCol}>
            <AllocationPieChart allocations={allocations} size={260} />
          </div>
          <div className={styles.tableCol}>
            <AllocationTable allocations={allocations} />
          </div>
        </div>

        {/* What to expect */}
        <div className={styles.section}>
          <h3>What to expect</h3>
          <p>{whatToExpect}</p>
        </div>

        {/* Reminders */}
        <div className={styles.reminders}>
          <h3>Three reminders</h3>
          <div className={styles.reminderCards}>
            <div className={styles.reminderCard}>
              <div className={styles.reminderIcon}>📊</div>
              <p>
                <strong>Avoid checking daily.</strong> Short-term moves are
                normal and do not reflect the long-term trajectory of your
                portfolio.
              </p>
            </div>
            <div className={styles.reminderCard}>
              <div className={styles.reminderIcon}>🛡️</div>
              <p>
                <strong>Plan for downturns.</strong> Staying invested matters
                more than timing the market. Downturns are uncomfortable but
                historically temporary.
              </p>
            </div>
            <div className={styles.reminderCard}>
              <div className={styles.reminderIcon}>💰</div>
              <p>
                <strong>Keep an emergency cash buffer</strong> separate from your
                investments. This prevents you from selling at a bad time to
                cover unexpected expenses.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className={styles.disclaimer}>
          <p>
            StartFolio is an educational tool and does not provide personalized
            financial advice. The portfolios, allocations, and metrics shown are
            illustrative and based on simplified assumptions. Past performance
            does not guarantee future results. Consult a qualified financial
            advisor before making investment decisions.
          </p>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleStartOver}
          >
            Start over
          </button>
          <button
            className="btn btn-outline"
            onClick={() => router.push('/portfolios')}
          >
            Compare portfolios
          </button>
        </div>
      </div>
    </main>
  );
}
