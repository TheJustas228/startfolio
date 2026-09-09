/**
 * Onboarding questionnaire definitions for StartFolio.
 *
 * Each question has options with associated risk-score points.
 * The total risk score ranges from 0 (most conservative) to 100
 * (most growth-oriented). The complete mapping is documented in
 * the Risk Score Mapping comment below.
 *
 * --- Risk Score Mapping ---
 * Each answer contributes 0–25 points (5 questions × 25 max = 125 possible,
 * but we use 0–20 per question to keep it within 0–100 total).
 * The final score is clamped to 0–100.
 *
 * Score → Portfolio recommendation:
 *   0–25  → Conservative Balanced (slider default: 25)
 *  26–50  → Core Balanced         (slider default: 45)
 *  51–75  → Growth Focus          (slider default: 65)
 *  76–100 → Inflation-Resilient   (slider default: 55)
 *
 * The Inflation-Resilient portfolio is recommended at higher scores because
 * users with long horizons and high loss tolerance often benefit from
 * inflation diversification. However, the slider default is moderate (55)
 * because the portfolio already has built-in diversification.
 */

export interface QuestionOption {
  label: string;
  /** Points added to risk score (0–20) */
  points: number;
}

export interface Question {
  id: string;
  /** Displayed question text */
  text: string;
  /** Type of input */
  type: 'choice' | 'slider';
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: 'horizon',
    text: 'When might you need this money?',
    type: 'choice',
    options: [
      { label: 'Within 1–3 years', points: 0 },
      { label: '3–7 years', points: 7 },
      { label: '7–15 years', points: 14 },
      { label: '15+ years', points: 20 },
    ],
  },
  {
    id: 'lossReaction',
    text: 'If your account dropped 20% temporarily, what would you most likely do?',
    type: 'choice',
    options: [
      { label: 'Sell to stop the loss', points: 0 },
      { label: 'Feel stressed but hold', points: 7 },
      { label: 'Do nothing and keep investing', points: 14 },
      { label: 'Buy more', points: 20 },
    ],
  },
  {
    id: 'liquidity',
    text: 'How important is it that you can access this money quickly without selling at a bad time?',
    type: 'choice',
    options: [
      { label: 'Very important', points: 0 },
      { label: 'Somewhat important', points: 10 },
      { label: 'Not important', points: 20 },
    ],
  },
  {
    id: 'simplicity',
    text: 'How simple do you want this to be?',
    type: 'choice',
    options: [
      { label: 'As simple as possible', points: 0 },
      { label: 'A few funds is fine', points: 10 },
      { label: "I'm comfortable with multiple pieces", points: 20 },
    ],
  },
  {
    id: 'worstYear',
    text: 'What is the largest one-year drop you think you could tolerate without panicking?',
    type: 'slider',
    options: [
      { label: 'Up to 10%', points: 0 },
      { label: 'Up to 20%', points: 7 },
      { label: 'Up to 30%', points: 14 },
      { label: 'Up to 40%+', points: 20 },
    ],
  },
];

/**
 * Compute risk score from questionnaire answers.
 * @param answers - map of question id → selected option index
 * @returns risk score clamped to 0–100
 */
export function computeRiskScore(answers: Record<string, number>): number {
  let score = 0;
  for (const q of QUESTIONS) {
    const selectedIndex = answers[q.id];
    if (selectedIndex !== undefined && q.options[selectedIndex]) {
      score += q.options[selectedIndex].points;
    }
  }
  return Math.min(100, Math.max(0, score));
}

export interface Recommendation {
  portfolioId: string;
  sliderDefault: number;
  explanation: string;
}

/**
 * Map a risk score to a portfolio recommendation and default slider position.
 *
 * The thresholds are easily editable. Change the ranges below to adjust
 * which score brackets map to which portfolios.
 */
export function getRecommendation(riskScore: number): Recommendation {
  if (riskScore <= 25) {
    return {
      portfolioId: 'conservative',
      sliderDefault: 25,
      explanation:
        'Based on your answers, you prefer stability and are cautious about large declines. A conservative balanced portfolio aims to keep volatility low while still participating in long-term growth.',
    };
  }
  if (riskScore <= 50) {
    return {
      portfolioId: 'core',
      sliderDefault: 45,
      explanation:
        'Your answers suggest a moderate comfort level with risk and a medium-to-long time horizon. A core balanced portfolio offers a classic blend of growth and stability that suits most beginner investors.',
    };
  }
  if (riskScore <= 75) {
    return {
      portfolioId: 'growth',
      sliderDefault: 65,
      explanation:
        'You seem comfortable with significant fluctuations and have a long time horizon. A growth-focused portfolio aims to maximize long-term returns, accepting deeper drawdowns along the way.',
    };
  }
  return {
    portfolioId: 'inflation',
    sliderDefault: 55,
    explanation:
      'Your answers indicate a long horizon, high loss tolerance, and comfort with complexity. An inflation-resilient balanced portfolio adds diversifiers like inflation-protected bonds and commodities to help preserve purchasing power across different economic environments.',
  };
}
