'use client';

/**
 * Developer Notes page — documents architecture, data integration points,
 * theme tokens, risk score mapping, and future API interfaces.
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function DeveloperNotesPage() {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.topNav}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push('/')}>
            ← Home
          </button>
        </div>

        <h1 className={styles.title}>Developer Notes</h1>
        <p className={styles.subtitle}>
          Architecture reference for extending StartFolio with real data,
          custom themes, and additional features.
        </p>

        {/* Section 1: Data Integration */}
        <section className={styles.section}>
          <h2>Data Integration Points</h2>
          <p>
            StartFolio currently uses illustrative heuristic metrics (defined in{' '}
            <code>src/lib/metrics.ts</code>). These should be replaced with real
            historical data when available. Below are the TypeScript interfaces
            for a future data module.
          </p>

          <div className={styles.codeBlock}>
            <pre>{`// --- Future Data Module Interfaces ---
// File: src/lib/dataModule.ts

/**
 * Fetch historical total returns for an asset class index.
 *
 * Suggested APIs:
 *   - Yahoo Finance (yfinance Python lib or unofficial REST API)
 *   - Alpha Vantage (free tier available)
 *   - FRED API (for Treasury, TIPS, and money market rates)
 *   - Nasdaq Data Link / Quandl (commodities, broad indices)
 *
 * @param asset - Asset class identifier (e.g., 'globalStocks')
 * @param startDate - ISO date string for period start
 * @param endDate - ISO date string for period end
 * @returns Array of { date: string; totalReturn: number } sorted by date
 */
export async function getReturns(
  asset: string,
  startDate: string,
  endDate: string
): Promise<{ date: string; totalReturn: number }[]> {
  // TODO: Implement with real API
  throw new Error('Not implemented — using illustrative heuristics');
}

/**
 * Compute the variance–covariance matrix from a set of asset return series.
 *
 * Suggested approach:
 *   - Align return series to common dates
 *   - Compute pairwise covariances using overlapping periods
 *   - Use shrinkage estimator (Ledoit-Wolf) for stability
 *
 * @param returns - Record of assetKey → array of periodic returns
 * @returns 2D covariance matrix (same order as input keys)
 */
export function computeCovarianceMatrix(
  returns: Record<string, number[]>
): { matrix: number[][]; keys: string[] } {
  // TODO: Implement with real data
  throw new Error('Not implemented — using illustrative heuristics');
}

/**
 * Run a historical backtest with given weights and return series.
 *
 * @param weights - Record of assetKey → decimal weight (sum to 1)
 * @param returns - Record of assetKey → array of periodic returns
 * @returns Backtest metrics including CAGR, max drawdown, Sharpe, etc.
 */
export function computeBacktestMetrics(
  weights: Record<string, number>,
  returns: Record<string, number[]>
): {
  cagr: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  recoveryTimeDays: number;
  worstYear: number;
  bestYear: number;
} {
  // TODO: Implement with real data
  throw new Error('Not implemented — using illustrative heuristics');
}

/**
 * Compute beta (market sensitivity) for a return series.
 *
 * @param assetReturns - Array of periodic returns for the asset/portfolio
 * @param marketReturns - Array of periodic returns for the market benchmark
 * @returns Beta coefficient
 */
export function computeBeta(
  assetReturns: number[],
  marketReturns: number[]
): number {
  // TODO: Implement: Cov(asset, market) / Var(market)
  throw new Error('Not implemented — using illustrative heuristics');
}`}</pre>
          </div>

          <h3>How to integrate</h3>
          <ol className={styles.steps}>
            <li>
              Implement the functions above in <code>src/lib/dataModule.ts</code>.
            </li>
            <li>
              In <code>src/lib/metrics.ts</code>, check if real data is available
              (try/catch the data module calls). If available, compute real metrics.
              If not, fall back to the existing illustrative heuristics.
            </li>
            <li>
              The UI in <code>src/app/customize/page.tsx</code> already displays
              metrics from the <code>computeIllustrativeMetrics</code> function —
              no UI changes needed if the function signature stays the same.
            </li>
            <li>
              Add a visual indicator in the Advanced Details accordion to show
              whether metrics are &quot;illustrative&quot; or &quot;based on historical data&quot;.
            </li>
          </ol>
        </section>

        {/* Section 2: Theme & Branding */}
        <section className={styles.section}>
          <h2>Theme &amp; Branding</h2>
          <p>
            All design tokens are defined as CSS custom properties in{' '}
            <code>src/app/globals.css</code>. To update the theme, modify the
            values in the <code>:root</code> block.
          </p>

          <h3>Global Tokens</h3>
          <div className={styles.tokenTable}>
            <table>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>CSS Variable</th>
                  <th>Value</th>
                  <th>Usage</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Background</td><td><code>--bg</code></td><td>#0B0520</td><td>Page background</td></tr>
                <tr><td>Surface</td><td><code>--surface</code></td><td>#14103A</td><td>Cards, panels</td></tr>
                <tr><td>Text Primary</td><td><code>--text-primary</code></td><td>#FFFFFF</td><td>Headings, primary text</td></tr>
                <tr><td>Text Secondary</td><td><code>--text-secondary</code></td><td>#A89EC4</td><td>Body text, descriptions</td></tr>
                <tr><td>Border</td><td><code>--border</code></td><td>#2D1B69</td><td>Card borders, dividers</td></tr>
                <tr><td>Primary Brand</td><td><code>--primary</code></td><td>#9A12CA</td><td>Buttons, gradients</td></tr>
                <tr><td>Primary Soft</td><td><code>--primary-soft</code></td><td>#1E0A3A</td><td>Soft backgrounds</td></tr>
                <tr><td>Secondary</td><td><code>--secondary</code></td><td>#6A35FF</td><td>Links, accents, blue-violet</td></tr>
                <tr><td>Secondary Soft</td><td><code>--secondary-soft</code></td><td>#150F3A</td><td>Soft accent backgrounds</td></tr>
                <tr><td>Warning</td><td><code>--warning</code></td><td>#E05A6F</td><td>Errors and warnings only</td></tr>
                <tr><td>Warning Soft</td><td><code>--warning-soft</code></td><td>#2C1520</td><td>Warning backgrounds</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Portfolio Accent Tokens</h3>
          <div className={styles.tokenTable}>
            <table>
              <thead>
                <tr>
                  <th>Portfolio</th>
                  <th>Accent Hex</th>
                  <th>Soft Hex</th>
                  <th>CSS Variable (accent)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Conservative Balanced</td><td>#35CFAF</td><td>#0D2926</td><td><code>--portfolio-conservative</code></td></tr>
                <tr><td>Core Balanced</td><td>#6A35FF</td><td>#150F3A</td><td><code>--portfolio-core</code></td></tr>
                <tr><td>Growth Focus</td><td>#35B8CF</td><td>#0D2329</td><td><code>--portfolio-growth</code></td></tr>
                <tr><td>Inflation-Resilient</td><td>#DBA04A</td><td>#2A2012</td><td><code>--portfolio-inflation</code></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Risk Score Mapping */}
        <section className={styles.section}>
          <h2>Risk Score Mapping</h2>
          <p>
            The onboarding questionnaire computes a risk score from 0 (most
            conservative) to 100 (most growth-oriented). Each question
            contributes 0–20 points. The mapping is defined in{' '}
            <code>src/data/questions.ts</code>.
          </p>

          <h3>Point Allocations per Question</h3>
          <div className={styles.tokenTable}>
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Option 1</th>
                  <th>Option 2</th>
                  <th>Option 3</th>
                  <th>Option 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Investment horizon</td>
                  <td>0 pts</td>
                  <td>7 pts</td>
                  <td>14 pts</td>
                  <td>20 pts</td>
                </tr>
                <tr>
                  <td>Loss reaction</td>
                  <td>0 pts</td>
                  <td>7 pts</td>
                  <td>14 pts</td>
                  <td>20 pts</td>
                </tr>
                <tr>
                  <td>Liquidity needs</td>
                  <td>0 pts</td>
                  <td>10 pts</td>
                  <td>20 pts</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Simplicity preference</td>
                  <td>0 pts</td>
                  <td>10 pts</td>
                  <td>20 pts</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td>Worst-year comfort</td>
                  <td>0 pts</td>
                  <td>7 pts</td>
                  <td>14 pts</td>
                  <td>20 pts</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Score → Portfolio Recommendation</h3>
          <div className={styles.tokenTable}>
            <table>
              <thead>
                <tr>
                  <th>Risk Score Range</th>
                  <th>Recommended Portfolio</th>
                  <th>Default Slider</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>0–25</td><td>Conservative Balanced</td><td>25</td></tr>
                <tr><td>26–50</td><td>Core Balanced</td><td>45</td></tr>
                <tr><td>51–75</td><td>Growth Focus</td><td>65</td></tr>
                <tr><td>76–100</td><td>Inflation-Resilient Balanced</td><td>55</td></tr>
              </tbody>
            </table>
          </div>

          <p>
            The thresholds are defined in <code>getRecommendation()</code> in{' '}
            <code>src/data/questions.ts</code> and can be easily adjusted.
          </p>
        </section>

        {/* Section 4: Slider Constraints */}
        <section className={styles.section}>
          <h2>Slider Constraints &amp; Guardrails</h2>
          <p>
            The customization slider logic is in <code>src/lib/sliderLogic.ts</code>.
            The following bounds are enforced:
          </p>
          <div className={styles.tokenTable}>
            <table>
              <thead>
                <tr><th>Asset Class</th><th>Min %</th><th>Max %</th></tr>
              </thead>
              <tbody>
                <tr><td>Global Stocks</td><td>20%</td><td>90%</td></tr>
                <tr><td>Total Bonds (Gov + Inflation)</td><td>10%</td><td>70%</td></tr>
                <tr><td>Cash / Money Market</td><td>0%</td><td>15%</td></tr>
                <tr><td>Commodities</td><td>0%</td><td>15%</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            Commodities only appear if the baseline portfolio includes them or
            if the &quot;Include inflation diversifiers&quot; toggle is enabled and the
            slider value is ≤ 60. When a bound is hit, the remaining slider
            movement reallocates among flexible buckets. All allocations
            re-normalize to exactly 100%.
          </p>
        </section>

        {/* Section 5: File Structure */}
        <section className={styles.section}>
          <h2>File Structure</h2>
          <div className={styles.codeBlock}>
            <pre>{`src/
├── app/
│   ├── layout.tsx              # Root layout with AppProvider
│   ├── globals.css             # Design tokens & base styles
│   ├── page.tsx                # Landing screen
│   ├── onboarding/page.tsx     # Questionnaire
│   ├── portfolios/
│   │   ├── page.tsx            # Portfolio selection grid
│   │   └── [id]/page.tsx       # Portfolio detail page
│   ├── customize/page.tsx      # Slider customization
│   ├── summary/page.tsx        # Final summary
│   └── developer-notes/page.tsx # This page
├── components/
│   ├── AllocationPieChart.tsx   # Recharts pie chart
│   ├── AllocationTable.tsx      # Allocation table with bars
│   ├── PortfolioCard.tsx        # Card for portfolio grid
│   ├── StepIndicator.tsx        # Onboarding step dots
│   └── ETFToggle.tsx            # Example ETFs accordion
├── context/
│   └── AppContext.tsx            # Global state (React Context)
├── data/
│   ├── portfolios.ts            # 4 model portfolios with content
│   ├── questions.ts             # Onboarding questions & scoring
│   └── assetClasses.ts          # Asset class definitions
└── lib/
    ├── sliderLogic.ts           # Slider allocation algorithm
    └── metrics.ts               # Illustrative risk metrics`}</pre>
          </div>
        </section>
      </div>
    </main>
  );
}
