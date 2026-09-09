/**
 * Model portfolio definitions for StartFolio.
 *
 * Each portfolio has a unique slug, display metadata, baseline allocations
 * (which always sum to 100), accent theming, and thorough explanation content.
 *
 * --- Future Data Integration ---
 * The baseline allocations can be used as inputs to:
 *   - computeBacktestMetrics(weights, returns) for real historical performance
 *   - computeCovarianceMatrix(returns) for portfolio-level risk analytics
 *   - computeBeta(portfolioReturns, marketReturns) for market sensitivity
 * See src/lib/metrics.ts for the full interface definitions.
 */

import { AssetClassKey } from './assetClasses';

export interface PortfolioAllocation {
  asset: AssetClassKey;
  weight: number; // percentage 0–100
}

export interface PortfolioContent {
  whatDesignedFor: string;
  whatEachPartDoes: { asset: AssetClassKey; explanation: string }[];
  whyTheseWeights: string;
  whatCanGoWrong: string;
  commonMistakes: string[];
  timeHorizonGuidance: string;
}

export interface Portfolio {
  id: string;
  name: string;
  shortPurpose: string;
  accent: string;
  accentSoft: string;
  allocations: PortfolioAllocation[];
  content: PortfolioContent;
}

export const PORTFOLIOS: Portfolio[] = [
  /* ----------------------------------------------------------------
     Portfolio 1: Conservative Balanced
     ---------------------------------------------------------------- */
  {
    id: 'conservative',
    name: 'Conservative Balanced',
    shortPurpose: 'Capital preservation with measured growth.',
    accent: '#35CFAF',
    accentSoft: '#0D2926',
    allocations: [
      { asset: 'globalStocks', weight: 30 },
      { asset: 'govBonds', weight: 45 },
      { asset: 'inflationBonds', weight: 15 },
      { asset: 'cash', weight: 10 },
    ],
    content: {
      whatDesignedFor:
        'This portfolio is designed for investors who prioritize reducing the size of downturns and providing stability. It aims to preserve capital while still participating in long-term growth through a modest equity allocation. It may suit investors with shorter horizons (3–7+ years), those nearing retirement, or anyone who would lose sleep over a large account decline. The trade-off is that long-term growth potential is lower than more aggressive allocations.',
      whatEachPartDoes: [
        {
          asset: 'globalStocks',
          explanation:
            'Global stocks provide long-term growth potential but are kept to 30% to limit the portfolio\'s exposure to equity bear markets. Even at this level, stocks are the primary engine for outpacing inflation over time.',
        },
        {
          asset: 'govBonds',
          explanation:
            'Intermediate government bonds, at 45%, form the backbone of this portfolio\'s stability. Historically, high-quality bonds provide ballast when equities fall. However, they can suffer when interest rates rise sharply, which is why the allocation is complemented by inflation-protected bonds.',
        },
        {
          asset: 'inflationBonds',
          explanation:
            'Inflation-protected bonds at 15% help guard against unexpected inflation eroding purchasing power. They adjust their principal with inflation, offering a degree of protection that nominal bonds cannot provide in inflationary environments.',
        },
        {
          asset: 'cash',
          explanation:
            'Cash at 10% reduces overall volatility and provides immediate liquidity and psychological comfort. It is a buffer — not the growth engine. The trade-off is lower long-run returns, but it means you always have readily accessible funds without needing to sell other holdings at a bad time.',
        },
      ],
      whyTheseWeights:
        'The weights are designed to keep the portfolio relatively stable even during equity bear markets. With only 30% in stocks, the worst-case scenario is more contained than a typical balanced fund. The heavy bond allocation provides income and stability, while inflation-protected bonds and cash round out the defensive posture. This mix historically would have experienced smaller drawdowns than a 60/40 portfolio, at the cost of lower long-run returns.',
      whatCanGoWrong:
        'Inflation can erode the real value of the large cash and bond holdings over time, especially during prolonged inflationary periods. Bonds can lose value during rapid interest rate hikes — this happened notably in 2022. The limited stock allocation means this portfolio may significantly underperform during strong bull markets, which can be frustrating. If your time horizon is very long, this portfolio may not grow fast enough to meet ambitious goals.',
      commonMistakes: [
        'Panic selling during a downturn — even this conservative portfolio can temporarily decline 10–15% in a severe market event.',
        'Chasing performance by switching to a growth portfolio after seeing stocks rally — this defeats the purpose of the conservative allocation.',
        'Changing your plan frequently based on news headlines or market commentary.',
        'Investing money you may need within 1–2 years in this portfolio — even conservative portfolios can be down at an inconvenient time.',
      ],
      timeHorizonGuidance:
        'This portfolio is most appropriate for investors with a 3–7+ year horizon, or for very risk-averse investors with longer horizons who prioritize peace of mind over maximum growth. It is not ideal for money needed within 1–2 years (consider a savings account or CDs for that). It is also not ideal for very long horizons (15+ years) where a higher equity allocation could be more appropriate, unless emotional comfort is the overriding priority.',
    },
  },

  /* ----------------------------------------------------------------
     Portfolio 2: Core Balanced
     ---------------------------------------------------------------- */
  {
    id: 'core',
    name: 'Core Balanced',
    shortPurpose: 'A classic balanced approach for most beginners.',
    accent: '#6A35FF',
    accentSoft: '#150F3A',
    allocations: [
      { asset: 'globalStocks', weight: 55 },
      { asset: 'govBonds', weight: 35 },
      { asset: 'inflationBonds', weight: 5 },
      { asset: 'cash', weight: 5 },
    ],
    content: {
      whatDesignedFor:
        'This is a classic balanced approach designed for people with medium-to-long horizons who can tolerate some fluctuation in exchange for growth. It is the default recommendation for most beginner investors because it balances growth and stability in a way that has historically been sustainable for a wide range of people. It aims to capture the majority of equity market growth while cushioning the blow during downturns.',
      whatEachPartDoes: [
        {
          asset: 'globalStocks',
          explanation:
            'At 55%, global stocks are the primary growth driver. Over long periods, equities have historically outperformed other asset classes, but they come with significant short-term volatility. The global diversification reduces the risk of being concentrated in any single market.',
        },
        {
          asset: 'govBonds',
          explanation:
            'Government bonds at 35% reduce the depth of drawdowns and smooth the portfolio\'s returns over time. When stocks fall, bonds often hold steady or rise, providing a natural hedge. However, bonds can lose value when interest rates rise.',
        },
        {
          asset: 'inflationBonds',
          explanation:
            'A small 5% allocation to inflation-protected bonds provides modest resilience against unexpected inflation without significantly altering the portfolio\'s character.',
        },
        {
          asset: 'cash',
          explanation:
            'Cash at 5% provides a small liquidity buffer and marginally reduces volatility. It is enough to cover small unexpected needs without forcing bond or stock sales at a bad time.',
        },
      ],
      whyTheseWeights:
        'The 55/35/5/5 split is a time-tested balanced allocation. The equity majority means the portfolio can participate meaningfully in long-term market growth, while the bond and cash cushion aims to keep drawdowns more manageable than a pure equity portfolio. This mix has historically delivered reasonable returns with moderate volatility — a sweet spot for many investors who want growth but also want to be able to sleep at night.',
      whatCanGoWrong:
        'Equity bear markets can still produce meaningful declines — a 55% stock allocation could see the overall portfolio drop 20–30% in a severe downturn. Bonds may not protect in every scenario, especially during periods of rising inflation and interest rates (as seen in 2022). The portfolio\'s performance will sometimes lag an all-stock portfolio during booming markets, which can test patience. Unexpected correlations (stocks and bonds falling together) can make diversification less effective than expected.',
      commonMistakes: [
        'Panic selling after a 15–20% decline — historically, staying invested has been rewarded over time.',
        'Performance chasing by moving to 100% stocks after a bull market run.',
        'Frequently changing allocation based on market news or forecasts.',
        'Using this portfolio for money needed within 2–3 years, where even moderate declines could be problematic.',
      ],
      timeHorizonGuidance:
        'This portfolio is most appropriate for investors with a 7–15+ year horizon and a typical risk tolerance. It is a good starting point for most beginners. It is less suitable for money needed within 3–5 years (consider the Conservative Balanced portfolio) or for investors with very long horizons (20+ years) and high risk tolerance (consider the Growth Focus portfolio). If you are uncertain, this is usually the safest "default" choice.',
    },
  },

  /* ----------------------------------------------------------------
     Portfolio 3: Growth Focus
     ---------------------------------------------------------------- */
  {
    id: 'growth',
    name: 'Growth Focus',
    shortPurpose: 'Long-term growth for patient investors.',
    accent: '#35B8CF',
    accentSoft: '#0D2329',
    allocations: [
      { asset: 'globalStocks', weight: 80 },
      { asset: 'govBonds', weight: 15 },
      { asset: 'cash', weight: 5 },
    ],
    content: {
      whatDesignedFor:
        'This portfolio is designed for long time horizons and investors who accept volatility as the price of higher expected returns. It is appropriate for those who genuinely will not need this money for 10–20+ years and who can tolerate seeing their account value drop significantly during bear markets without changing their plan. The higher equity weight aims to capture the full benefit of long-run equity risk premia.',
      whatEachPartDoes: [
        {
          asset: 'globalStocks',
          explanation:
            'Global stocks at 80% dominate this portfolio to capture the long-run equity risk premium. This is the engine for wealth building over decades. The global diversification helps, but 80% equity exposure means substantial short-term volatility is expected.',
        },
        {
          asset: 'govBonds',
          explanation:
            'A smaller 15% bond allocation still provides some diversification benefit and rebalancing opportunities. When stocks fall, bonds may rise, giving you "dry powder" to rebalance into cheaper stocks. However, 15% bonds cannot prevent large drawdowns.',
        },
        {
          asset: 'cash',
          explanation:
            'Cash at 5% provides minimal liquidity and a small psychological buffer. It reduces the chance of panic selling by ensuring some funds are always accessible without selling at a loss.',
        },
      ],
      whyTheseWeights:
        'The 80/15/5 split is designed to maximize long-term growth potential while maintaining a minimal diversification floor. Historically, higher equity allocations have delivered higher long-term returns, but with deeper and more frequent drawdowns. The small bond and cash allocations are guardrails — they won\'t prevent large declines but they provide rebalancing opportunities and a liquidity floor.',
      whatCanGoWrong:
        'Large drawdowns are expected and can be severe — 30–50%+ declines are historically possible during major bear markets. Recovery can take years (the 2008 crisis took roughly 4–5 years for a full recovery in global equities). Emotional discipline is critical; if a 40% decline would cause you to sell, this portfolio is not appropriate. Long stretches of underperformance relative to bonds or other portfolios are possible. Short-term needs can force selling at the worst time.',
      commonMistakes: [
        'Overestimating your risk tolerance — a 40% decline feels very different in reality than in theory.',
        'Panic selling during a bear market, locking in losses that could have been recovered.',
        'Investing money you might need within 5–7 years in this aggressive allocation.',
        'Switching to a conservative portfolio at the bottom of a downturn, then missing the recovery.',
      ],
      timeHorizonGuidance:
        'This portfolio is appropriate for investors with 10–20+ year horizons who genuinely will not need the money before then. It is ideal for young investors saving for far-off goals (retirement decades away) who have stable income and an emergency fund. It is not appropriate for money needed within 5–10 years, for investors near retirement, or for anyone who would be unable to stay the course during a prolonged bear market.',
    },
  },

  /* ----------------------------------------------------------------
     Portfolio 4: Inflation-Resilient Balanced
     ---------------------------------------------------------------- */
  {
    id: 'inflation',
    name: 'Inflation-Resilient Balanced',
    shortPurpose: 'Purchasing-power protection with balanced growth.',
    accent: '#DBA04A',
    accentSoft: '#2A2012',
    allocations: [
      { asset: 'globalStocks', weight: 50 },
      { asset: 'govBonds', weight: 20 },
      { asset: 'inflationBonds', weight: 15 },
      { asset: 'commodities', weight: 10 },
      { asset: 'cash', weight: 5 },
    ],
    content: {
      whatDesignedFor:
        'This portfolio aims to be more robust when inflation is high or unexpected. It is designed for investors who are particularly concerned about preserving purchasing power and want exposure to assets that may perform better in inflationary environments. It still maintains balanced growth through a significant equity allocation but tilts toward inflation-sensitive assets.',
      whatEachPartDoes: [
        {
          asset: 'globalStocks',
          explanation:
            'Stocks at 50% can outgrow inflation over long horizons because companies can raise prices and grow earnings. However, stocks can struggle during acute inflation shocks when central banks raise rates aggressively, causing temporary declines.',
        },
        {
          asset: 'govBonds',
          explanation:
            'Government bonds at 20% still provide diversification and stability, but the allocation is lower than in other balanced portfolios because nominal bonds can lose value during inflationary periods when rates rise.',
        },
        {
          asset: 'inflationBonds',
          explanation:
            'Inflation-protected bonds at 15% are a core feature of this portfolio. They adjust with inflation, helping to preserve purchasing power when price increases are higher than expected. They provide meaningful protection that nominal bonds cannot.',
        },
        {
          asset: 'commodities',
          explanation:
            'Commodities at 10% can help in certain inflationary regimes because commodity prices often rise with inflation. However, commodities are volatile and can underperform for long periods — they are a diversifier and a partial inflation hedge, not a reliable growth asset.',
        },
        {
          asset: 'cash',
          explanation:
            'Cash at 5% provides liquidity and a small buffer. During inflationary periods, cash loses purchasing power, which is why this portfolio limits its cash allocation while emphasizing inflation-linked assets.',
        },
      ],
      whyTheseWeights:
        'The weights balance growth (stocks), stability (bonds), and inflation protection (TIPS + commodities) in a way that aims to perform reasonably across different economic environments — not just the disinflationary periods that favored traditional balanced portfolios. The modest commodities allocation adds diversification without excessive volatility, while the larger TIPS allocation directly addresses inflation risk.',
      whatCanGoWrong:
        'Commodities are volatile and can be frustrating — they can decline significantly and underperform for years. Inflation hedges do not always work on short horizons; the protection is probabilistic, not guaranteed. This portfolio can lag in disinflationary booms when traditional stocks and bonds outperform. The multi-asset complexity means some component is almost always underperforming, which requires patience. If inflation stays low, the inflation-oriented tilts may be a drag on returns compared to a simpler balanced portfolio.',
      commonMistakes: [
        'Abandoning the commodities allocation after it underperforms for a year or two — the diversification benefit requires staying invested through full cycles.',
        'Expecting perfect inflation protection in every environment — these tools help on average, not perfectly in every period.',
        'Panic selling during a downturn that affects all assets simultaneously (rare but possible in severe crises).',
        'Overcomplicating further by adding many more asset classes — this portfolio is already reasonably well-diversified.',
      ],
      timeHorizonGuidance:
        'This portfolio is appropriate for investors with a 7–15+ year horizon who are particularly concerned about inflation eroding their purchasing power. It suits those who want balanced growth but with a tilt toward real-asset protection. It is less suitable for very short horizons (the volatility from commodities and equities can cause short-term losses) or for investors in a deflationary environment where simpler bond-heavy portfolios may perform better.',
    },
  },
];

/** Helper to find portfolio by id */
export function getPortfolioById(id: string): Portfolio | undefined {
  return PORTFOLIOS.find((p) => p.id === id);
}
