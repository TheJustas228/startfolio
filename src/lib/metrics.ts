/**
 * Illustrative risk metrics for StartFolio.
 *
 * These are simple heuristic calculations based on assumed per-asset-class
 * risk levels. They are PLACEHOLDERS — clearly labeled as "illustrative,
 * not guarantees" in the UI.
 *
 * --- Future Data Integration ---
 * Replace these heuristics with real calculations using:
 *
 * 1. getReturns(asset, startDate, endDate)
 *    - Fetch daily/monthly total returns for each asset class index
 *    - Suggested API: Yahoo Finance (yfinance), FRED, Nasdaq Data Link
 *
 * 2. computeCovarianceMatrix(returns)
 *    - Compute the variance–covariance matrix from historical returns
 *    - Use this for proper portfolio volatility: sqrt(w' * Σ * w)
 *
 * 3. computeBacktestMetrics(weights, returns)
 *    - Run a historical backtest with given weights and return:
 *      - Realized CAGR
 *      - Realized max drawdown
 *      - Time to recovery from each drawdown
 *      - Sharpe ratio
 *      - Sortino ratio
 *
 * 4. computeBeta(assetReturns, marketReturns)
 *    - Compute the beta (market sensitivity) of each asset or the portfolio
 *
 * When these functions are implemented, the UI should prefer real data
 * and fall back to these heuristics only if data is unavailable.
 */

import { AssetClassKey, ASSET_CLASSES } from '@/data/assetClasses';
import { PortfolioAllocation } from '@/data/portfolios';

/**
 * Assumed illustrative per-asset-class statistics.
 * These are editable constants — adjust them to change the heuristic output.
 */
const ILLUSTRATIVE_STATS: Record<
  AssetClassKey,
  {
    /** Illustrative annualized volatility */
    vol: number;
    /** Illustrative worst-year return */
    worstYear: number;
    /** Illustrative average annual return */
    avgReturn: number;
  }
> = {
  globalStocks: { vol: 0.16, worstYear: -0.45, avgReturn: 0.08 },
  govBonds: { vol: 0.05, worstYear: -0.12, avgReturn: 0.035 },
  inflationBonds: { vol: 0.06, worstYear: -0.14, avgReturn: 0.03 },
  commodities: { vol: 0.18, worstYear: -0.50, avgReturn: 0.025 },
  cash: { vol: 0.01, worstYear: -0.01, avgReturn: 0.02 },
};

/**
 * Simple assumed pairwise correlations for the heuristic volatility estimate.
 * In reality you would compute these from historical returns.
 */
const CORRELATIONS: Partial<Record<string, number>> = {
  'globalStocks-govBonds': 0.0,
  'globalStocks-inflationBonds': 0.15,
  'globalStocks-commodities': 0.3,
  'globalStocks-cash': 0.0,
  'govBonds-inflationBonds': 0.7,
  'govBonds-commodities': -0.1,
  'govBonds-cash': 0.3,
  'inflationBonds-commodities': 0.2,
  'inflationBonds-cash': 0.2,
  'commodities-cash': 0.0,
};

function getCorrelation(a: AssetClassKey, b: AssetClassKey): number {
  if (a === b) return 1;
  const key1 = `${a}-${b}`;
  const key2 = `${b}-${a}`;
  return CORRELATIONS[key1] ?? CORRELATIONS[key2] ?? 0;
}

export interface IllustrativeMetrics {
  /** Estimated annualized volatility (decimal) */
  volatility: number;
  /** Estimated worst-year loss (decimal, negative) */
  worstYearLoss: number;
  /** Recovery time intuition in plain text */
  recoveryIntuition: string;
  /** Estimated average annual return (decimal) */
  estimatedReturn: number;
}

/**
 * Compute illustrative portfolio metrics from allocation weights.
 *
 * Portfolio volatility uses the standard formula:
 *   σ_p = sqrt( Σ_i Σ_j w_i * w_j * σ_i * σ_j * ρ_ij )
 *
 * Worst-year loss uses a weighted average of per-asset worst years
 * with a correlation adjustment (heuristic).
 *
 * These are ILLUSTRATIVE ONLY. Label them clearly in the UI.
 */
export function computeIllustrativeMetrics(
  allocations: PortfolioAllocation[]
): IllustrativeMetrics {
  // Convert allocations to weight map (decimal)
  const weights: Partial<Record<AssetClassKey, number>> = {};
  for (const a of allocations) {
    weights[a.asset] = a.weight / 100;
  }

  const assets = Object.keys(weights) as AssetClassKey[];

  // Portfolio volatility (variance formula with correlations)
  let variance = 0;
  for (const i of assets) {
    for (const j of assets) {
      const wi = weights[i] ?? 0;
      const wj = weights[j] ?? 0;
      const sigI = ILLUSTRATIVE_STATS[i]?.vol ?? 0;
      const sigJ = ILLUSTRATIVE_STATS[j]?.vol ?? 0;
      const rho = getCorrelation(i, j);
      variance += wi * wj * sigI * sigJ * rho;
    }
  }
  const volatility = Math.sqrt(Math.max(0, variance));

  // Weighted worst-year (simple weighted average with diversification benefit)
  let weightedWorstYear = 0;
  for (const asset of assets) {
    const w = weights[asset] ?? 0;
    weightedWorstYear += w * ILLUSTRATIVE_STATS[asset].worstYear;
  }
  // Apply a diversification adjustment (assets don't all hit worst year simultaneously)
  // Heuristic: diversified worst year is ~70% of the undiversified weighted worst year
  const worstYearLoss = weightedWorstYear * 0.7;

  // Estimated average return (weighted sum)
  let estimatedReturn = 0;
  for (const asset of assets) {
    const w = weights[asset] ?? 0;
    estimatedReturn += w * ILLUSTRATIVE_STATS[asset].avgReturn;
  }

  // Recovery intuition
  let recoveryIntuition: string;
  const absLoss = Math.abs(worstYearLoss);
  if (absLoss < 0.08) {
    recoveryIntuition =
      'Minor dips may recover within months. Staying invested is usually straightforward.';
  } else if (absLoss < 0.15) {
    recoveryIntuition =
      'Moderate declines may take 1–2 years to recover. Patience is important.';
  } else if (absLoss < 0.25) {
    recoveryIntuition =
      'Significant declines could take 2–4 years to recover. Emotional discipline matters.';
  } else {
    recoveryIntuition =
      'Large declines could take 3–5+ years to recover. This requires strong conviction and a long horizon.';
  }

  return {
    volatility: Math.round(volatility * 1000) / 1000,
    worstYearLoss: Math.round(worstYearLoss * 1000) / 1000,
    recoveryIntuition,
    estimatedReturn: Math.round(estimatedReturn * 1000) / 1000,
  };
}

/** Format a decimal as a percentage string, e.g. 0.123 → "12.3%" */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
