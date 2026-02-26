/**
 * Slider customization logic for StartFolio.
 *
 * The single "Safety ↔ Growth" slider (0–100) adjusts portfolio allocations
 * while enforcing strict diversification guardrails.
 *
 * Constraints:
 *   - Global Stocks: 20% – 90%
 *   - Total Bonds (Gov Bonds + Inflation Bonds): 10% – 70%
 *   - Cash: 0% – 15%
 *   - Commodities: 0% – 15% (only if baseline includes them or toggle is on)
 *
 * The slider primarily shifts weight between stocks and bonds/cash.
 * Allocations always re-normalize to exactly 100%.
 *
 * --- Future Data Integration ---
 * The slider could later incorporate mean–variance optimization results
 * from computeCovarianceMatrix(returns) to derive "optimal" allocations
 * at each risk level, instead of the linear interpolation used here.
 */

import { AssetClassKey } from '@/data/assetClasses';
import { PortfolioAllocation } from '@/data/portfolios';

/** Allocation bounds (percentage, 0–100) */
const BOUNDS: Record<AssetClassKey, { min: number; max: number }> = {
  globalStocks: { min: 20, max: 90 },
  govBonds: { min: 5, max: 60 },
  inflationBonds: { min: 0, max: 30 },
  commodities: { min: 0, max: 15 },
  cash: { min: 0, max: 15 },
};

/** Total bonds (govBonds + inflationBonds) aggregate constraint */
const TOTAL_BONDS_MIN = 10;
const TOTAL_BONDS_MAX = 70;

export interface SliderResult {
  allocations: PortfolioAllocation[];
  /** Whether any constraint was binding */
  constraintActive: boolean;
}

/**
 * Compute adjusted allocations given baseline weights, slider value,
 * and whether commodities are enabled.
 *
 * Algorithm:
 * 1. The slider value (0=safety, 100=growth) determines a target equity weight
 *    by interpolating between the min and max stock bounds.
 * 2. Remaining weight is distributed among bonds, cash, and (if applicable)
 *    commodities, proportionally to the baseline ratios of those classes.
 * 3. Clamp each asset to its individual bounds.
 * 4. Re-normalize so the total is exactly 100%.
 *
 * @param baseline - The model portfolio's default allocations
 * @param sliderValue - 0 (max safety) to 100 (max growth)
 * @param includeCommodities - Whether commodities are enabled
 */
export function computeSliderAllocations(
  baseline: PortfolioAllocation[],
  sliderValue: number,
  includeCommodities: boolean
): SliderResult {
  const slider = Math.min(100, Math.max(0, sliderValue));

  // Determine which assets are active
  const baselineMap = new Map<AssetClassKey, number>();
  for (const a of baseline) {
    baselineMap.set(a.asset, a.weight);
  }

  // Check if commodities should be included
  const hasCommoditiesInBaseline = (baselineMap.get('commodities') ?? 0) > 0;
  const commoditiesActive =
    hasCommoditiesInBaseline || (includeCommodities && slider <= 60);

  // Target stock weight: interpolate from min to max based on slider
  const targetStocks =
    BOUNDS.globalStocks.min +
    (slider / 100) * (BOUNDS.globalStocks.max - BOUNDS.globalStocks.min);

  // Remaining weight for non-stock assets
  let remainingWeight = 100 - targetStocks;

  // Compute baseline ratios for non-stock assets
  const nonStockAssets: AssetClassKey[] = [
    'govBonds',
    'inflationBonds',
    'cash',
  ];
  if (commoditiesActive) nonStockAssets.push('commodities');

  // Get baseline weights for non-stock assets
  let baselineNonStockTotal = 0;
  const baselineNonStock: Record<string, number> = {};
  for (const key of nonStockAssets) {
    const w = baselineMap.get(key) ?? 0;
    baselineNonStock[key] = w;
    baselineNonStockTotal += w;
  }

  // Distribute remaining weight proportionally to baseline ratios
  const raw: Record<string, number> = { globalStocks: targetStocks };

  if (baselineNonStockTotal > 0) {
    for (const key of nonStockAssets) {
      raw[key] =
        remainingWeight * (baselineNonStock[key] / baselineNonStockTotal);
    }
  } else {
    // Fallback: distribute evenly
    for (const key of nonStockAssets) {
      raw[key] = remainingWeight / nonStockAssets.length;
    }
  }

  // If commodities not active, zero it out
  if (!commoditiesActive) {
    const comVal = raw['commodities'] ?? 0;
    delete raw['commodities'];
    // Redistribute to bonds
    raw['govBonds'] = (raw['govBonds'] ?? 0) + comVal;
  }

  // Clamp to individual bounds
  let constraintActive = false;
  const allKeys = Object.keys(raw) as AssetClassKey[];

  // Multiple passes to resolve cascading constraints
  for (let pass = 0; pass < 5; pass++) {
    let excess = 0;
    let flexibleKeys: AssetClassKey[] = [];

    for (const key of allKeys) {
      const bounds = BOUNDS[key];
      if (raw[key] < bounds.min) {
        excess -= bounds.min - raw[key];
        raw[key] = bounds.min;
        constraintActive = true;
      } else if (raw[key] > bounds.max) {
        excess += raw[key] - bounds.max;
        raw[key] = bounds.max;
        constraintActive = true;
      } else {
        flexibleKeys.push(key);
      }
    }

    // Distribute excess among flexible keys proportionally
    if (Math.abs(excess) > 0.01 && flexibleKeys.length > 0) {
      const flexTotal = flexibleKeys.reduce((s, k) => s + raw[k], 0);
      if (flexTotal > 0) {
        for (const k of flexibleKeys) {
          raw[k] += excess * (raw[k] / flexTotal);
        }
      } else {
        for (const k of flexibleKeys) {
          raw[k] += excess / flexibleKeys.length;
        }
      }
    }
  }

  // Enforce total bonds aggregate constraint
  const totalBonds = (raw['govBonds'] ?? 0) + (raw['inflationBonds'] ?? 0);
  if (totalBonds < TOTAL_BONDS_MIN) {
    const deficit = TOTAL_BONDS_MIN - totalBonds;
    raw['govBonds'] = (raw['govBonds'] ?? 0) + deficit;
    raw['globalStocks'] = (raw['globalStocks'] ?? 0) - deficit;
    constraintActive = true;
  } else if (totalBonds > TOTAL_BONDS_MAX) {
    const excess = totalBonds - TOTAL_BONDS_MAX;
    const govRatio =
      (raw['govBonds'] ?? 0) / totalBonds;
    raw['govBonds'] = (raw['govBonds'] ?? 0) - excess * govRatio;
    raw['inflationBonds'] = (raw['inflationBonds'] ?? 0) - excess * (1 - govRatio);
    raw['globalStocks'] = (raw['globalStocks'] ?? 0) + excess;
    constraintActive = true;
  }

  // Final re-normalization to exactly 100
  const total = Object.values(raw).reduce((s, v) => s + v, 0);
  const allocations: PortfolioAllocation[] = [];

  for (const key of allKeys) {
    const normalized = (raw[key] / total) * 100;
    // Round to 1 decimal
    const rounded = Math.round(normalized * 10) / 10;
    if (rounded > 0) {
      allocations.push({ asset: key, weight: rounded });
    }
  }

  // Fix rounding errors: adjust the largest allocation
  const allocTotal = allocations.reduce((s, a) => s + a.weight, 0);
  const diff = 100 - allocTotal;
  if (Math.abs(diff) > 0.01) {
    // Find the largest allocation to absorb the rounding error
    let largestIdx = 0;
    for (let i = 1; i < allocations.length; i++) {
      if (allocations[i].weight > allocations[largestIdx].weight) {
        largestIdx = i;
      }
    }
    allocations[largestIdx].weight =
      Math.round((allocations[largestIdx].weight + diff) * 10) / 10;
  }

  return { allocations, constraintActive };
}
