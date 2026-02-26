/**
 * Asset class definitions used throughout StartFolio.
 *
 * Each asset class has a unique key, display name, short description,
 * detailed explanation, and example ETFs. The illustrative risk
 * parameters (volatility, maxDrawdown) are simple heuristic placeholders.
 *
 * --- Future Data Integration ---
 * Replace `illustrativeVolatility` and `illustrativeMaxDrawdown` with
 * values computed from real historical returns. Suggested APIs:
 *   - Yahoo Finance API (yfinance) for daily/monthly total returns
 *   - FRED API for Treasury / TIPS yields
 *   - Quandl / Nasdaq Data Link for commodities indices
 *   - Portfolio Visualizer API for backtested statistics
 * The function `getReturns(asset, startDate, endDate)` defined in
 * the developer-notes types should replace these constants.
 */

export type AssetClassKey =
  | 'globalStocks'
  | 'govBonds'
  | 'inflationBonds'
  | 'commodities'
  | 'cash';

export interface AssetClass {
  key: AssetClassKey;
  name: string;
  shortDescription: string;
  detailedExplanation: string;
  exampleETFs: { ticker: string; note: string }[];
  /** Illustrative annualized volatility (decimal, e.g. 0.15 = 15%) */
  illustrativeVolatility: number;
  /** Illustrative worst-year drawdown (decimal, e.g. -0.40 = -40%) */
  illustrativeMaxDrawdown: number;
  /** Chart color — coordinated with calm palette */
  color: string;
}

export const ASSET_CLASSES: Record<AssetClassKey, AssetClass> = {
  globalStocks: {
    key: 'globalStocks',
    name: 'Global Stocks',
    shortDescription:
      'Broad diversified equities across regions and sectors — the long-term growth engine.',
    detailedExplanation:
      'Global stocks represent ownership in thousands of companies worldwide. Over long periods, equities have historically delivered the highest returns among major asset classes, but they can be very volatile in the short term. A global approach avoids concentrating risk in a single country or sector. Expect significant temporary declines (30–50%+) during bear markets, but historically markets have recovered and reached new highs over time. Global stocks are the core growth driver of most long-term portfolios.',
    exampleETFs: [
      { ticker: 'VT', note: 'Vanguard Total World Stock ETF' },
      { ticker: 'VWRL', note: 'Vanguard FTSE All-World (non-US listed)' },
      { ticker: 'IWDA', note: 'iShares Core MSCI World (developed markets)' },
    ],
    illustrativeVolatility: 0.16,
    illustrativeMaxDrawdown: -0.45,
    color: '#6A35FF',
  },

  govBonds: {
    key: 'govBonds',
    name: 'Intermediate Government Bonds',
    shortDescription:
      'High-quality government bonds with intermediate duration — the stability ballast.',
    detailedExplanation:
      'Intermediate government bonds (roughly 3–10 year maturities) historically provide a counterbalance to stocks. When equities fall during recessions or crises, high-quality bonds often rise or hold steady, smoothing overall portfolio returns. However, bonds are sensitive to interest rate changes: when rates rise, bond prices fall. They typically return less than stocks over the long run but significantly reduce portfolio volatility. They are the traditional "shock absorber" in a balanced portfolio.',
    exampleETFs: [
      { ticker: 'BND', note: 'Vanguard Total Bond Market ETF' },
      { ticker: 'IEF', note: 'iShares 7-10 Year Treasury Bond ETF' },
      { ticker: 'AGGH', note: 'iShares Core Global Aggregate Bond ETF' },
    ],
    illustrativeVolatility: 0.05,
    illustrativeMaxDrawdown: -0.12,
    color: '#35B8CF',
  },

  inflationBonds: {
    key: 'inflationBonds',
    name: 'Inflation-Protected Bonds',
    shortDescription:
      'Bonds whose principal adjusts with inflation — purchasing-power protection.',
    detailedExplanation:
      'Inflation-protected bonds (like TIPS in the US) adjust their principal based on official inflation measures. This means they can help preserve purchasing power when inflation surprises to the upside. However, they can still fluctuate with changes in real interest rates, and they may underperform nominal bonds during periods of stable or falling inflation. They are best viewed as insurance against unexpected inflation rather than a reliable return generator.',
    exampleETFs: [
      { ticker: 'TIP', note: 'iShares TIPS Bond ETF' },
      { ticker: 'SCHP', note: 'Schwab U.S. TIPS ETF' },
      { ticker: 'ITPS', note: 'iShares Global Inflation-Linked Bond (example)' },
    ],
    illustrativeVolatility: 0.06,
    illustrativeMaxDrawdown: -0.14,
    color: '#35CFAF',
  },

  commodities: {
    key: 'commodities',
    name: 'Commodities',
    shortDescription:
      'Broad commodities exposure — may help in some inflationary regimes but very volatile.',
    detailedExplanation:
      'Commodities include energy, metals, and agriculture. A broad commodities allocation can provide some protection when inflation rises unexpectedly, because commodity prices often move with inflation. However, commodities are very volatile, can underperform for extended periods, and do not generate income like stocks or bonds. They are best used as a small diversifier rather than a core holding. Long-term expected returns are lower and less reliable than equities.',
    exampleETFs: [
      { ticker: 'PDBC', note: 'Invesco Optimum Yield Diversified Commodity ETF' },
      { ticker: 'DBC', note: 'Invesco DB Commodity Index Tracking Fund' },
      { ticker: 'GSG', note: 'iShares S&P GSCI Commodity ETF' },
    ],
    illustrativeVolatility: 0.18,
    illustrativeMaxDrawdown: -0.50,
    color: '#DBA04A',
  },

  cash: {
    key: 'cash',
    name: 'Cash / Money Market',
    shortDescription:
      'Very low volatility liquidity — stability and optionality at the cost of low long-run returns.',
    detailedExplanation:
      'Cash and money market instruments (like Treasury bills or money market funds) provide near-zero volatility and immediate liquidity. They serve as a psychological buffer during market stress and can be deployed opportunistically. The trade-off is that cash earns low returns over time and may not keep pace with inflation. It is not a growth engine — it is a safety net and a source of optionality.',
    exampleETFs: [
      { ticker: 'BIL', note: 'SPDR Bloomberg 1-3 Month T-Bill ETF' },
      { ticker: 'SHV', note: 'iShares Short Treasury Bond ETF' },
      { ticker: 'SGOV', note: 'iShares 0-3 Month Treasury Bond ETF' },
    ],
    illustrativeVolatility: 0.01,
    illustrativeMaxDrawdown: -0.01,
    color: '#8B7FC7',
  },
};

/** Ordered keys for consistent display */
export const ASSET_CLASS_ORDER: AssetClassKey[] = [
  'globalStocks',
  'govBonds',
  'inflationBonds',
  'commodities',
  'cash',
];
