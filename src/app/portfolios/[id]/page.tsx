'use client';

/**
 * Portfolio detail page — thorough explanations in multiple sections.
 *
 * Includes: pie chart, allocation table, 6 content sections,
 * ETF toggles, and calls to action.
 */

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPortfolioById } from '@/data/portfolios';
import { ASSET_CLASSES } from '@/data/assetClasses';
import { useAppContext } from '@/context/AppContext';
import AllocationPieChart from '@/components/AllocationPieChart';
import AllocationTable from '@/components/AllocationTable';
import ETFToggle from '@/components/ETFToggle';
import styles from './page.module.css';

export default function PortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { selectPortfolio } = useAppContext();

  const portfolioId = params.id as string;
  const portfolio = getPortfolioById(portfolioId);

  if (!portfolio) {
    return (
      <main className={styles.main}>
        <div className="container">
          <h1>Portfolio not found</h1>
          <button className="btn btn-primary" onClick={() => router.push('/portfolios')}>
            Back to all portfolios
          </button>
        </div>
      </main>
    );
  }

  const handleCustomize = () => {
    selectPortfolio(portfolio.id);
    router.push('/customize');
  };

  return (
    <main className={styles.main}>
      <div className="container">
        {/* Navigation */}
        <div className={styles.topNav}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push('/portfolios')}>
            ← All portfolios
          </button>
        </div>

        {/* Header */}
        <div className={styles.header} style={{ background: portfolio.accentSoft }}>
          <div className={styles.headerAccent} style={{ background: portfolio.accent }} />
          <h1 style={{ color: portfolio.accent }}>{portfolio.name}</h1>
          <p className={styles.purpose}>{portfolio.shortPurpose}</p>
        </div>

        {/* Chart + Table */}
        <div className={styles.allocationSection}>
          <div className={styles.chartCol}>
            <AllocationPieChart allocations={portfolio.allocations} />
          </div>
          <div className={styles.tableCol}>
            <AllocationTable allocations={portfolio.allocations} />
          </div>
        </div>

        {/* Content sections */}
        <div className={styles.contentSections}>
          {/* Section A */}
          <section className={styles.section}>
            <h3 style={{ color: portfolio.accent }}>
              What this portfolio is designed for
            </h3>
            <p>{portfolio.content.whatDesignedFor}</p>
          </section>

          {/* Section B */}
          <section className={styles.section}>
            <h3 style={{ color: portfolio.accent }}>What each part does</h3>
            <div className={styles.partsList}>
              {portfolio.content.whatEachPartDoes.map((part) => {
                const asset = ASSET_CLASSES[part.asset];
                return (
                  <div key={part.asset} className={styles.partItem}>
                    <div className={styles.partHeader}>
                      <span
                        className={styles.partDot}
                        style={{ background: asset?.color }}
                      />
                      <h4>{asset?.name ?? part.asset}</h4>
                    </div>
                    <p>{part.explanation}</p>
                    <ETFToggle assetKey={part.asset} />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section C */}
          <section className={styles.section}>
            <h3 style={{ color: portfolio.accent }}>Why these weights</h3>
            <p>{portfolio.content.whyTheseWeights}</p>
          </section>

          {/* Section D */}
          <section className={styles.section}>
            <h3 style={{ color: portfolio.accent }}>What can go wrong</h3>
            <p>{portfolio.content.whatCanGoWrong}</p>
          </section>

          {/* Section E */}
          <section className={styles.section}>
            <h3 style={{ color: portfolio.accent }}>Common mistakes to avoid</h3>
            <ul className={styles.mistakesList}>
              {portfolio.content.commonMistakes.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </section>

          {/* Section F */}
          <section className={styles.section}>
            <h3 style={{ color: portfolio.accent }}>Time horizon guidance</h3>
            <p>{portfolio.content.timeHorizonGuidance}</p>
          </section>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleCustomize}
          >
            Customize this portfolio
          </button>
          <button
            className="btn btn-outline"
            onClick={() => router.push('/portfolios')}
          >
            Back to all portfolios
          </button>
        </div>
      </div>
    </main>
  );
}
