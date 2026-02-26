# StartFolio

**Choose a diversified portfolio you can stick with.**

StartFolio is a beginner-friendly investing web app that helps new investors pick a simple, diversified long-term portfolio—without jargon, hype, or stock-picking. It focuses on safety, clarity, and realistic expectations.

## Features

- **Model portfolios** — Four pre-built portfolios (Conservative Balanced, Core Balanced, Growth Focus, Inflation-Resilient) with clear allocations and plain-English explanations
- **Onboarding** — Short questionnaire (5 questions) that recommends a starting portfolio and slider position based on your time horizon and risk comfort
- **Customization** — Single “Safety ↔ Growth” slider with strict diversification guardrails; optional inflation diversifiers
- **Transparent content** — Per-portfolio sections on what each part does, what can go wrong, common mistakes, and time-horizon guidance
- **Illustrative metrics** — Placeholder volatility and worst-year estimates (clearly labeled); structure in place to plug in real historical data later
- **Galaxy-style UI** — Deep purple theme, cursor-following glow (desktop only), and optional “space with stars” background on inner pages

## Tech stack

- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **Recharts** for allocation pie charts
- **CSS modules** + global design tokens

## Getting started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm)

### Install and run

```bash
# Clone the repo
git clone https://github.com/TheJustas228/Startfolio.git
cd Startfolio

# Install dependencies
npm install

# Run the dev server (http://localhost:3000)
npm run dev
```

### Build for production

```bash
npm run build
npm start
```

## Deploy

The app is set up for [Vercel](https://vercel.com): connect your GitHub repo and deploy. No extra config needed.

## Project structure

- `src/app/` — Routes: landing, onboarding, portfolios, portfolio detail, customize, summary, developer-notes
- `src/components/` — Shared UI (e.g. allocation chart, portfolio cards, cursor glow, backgrounds)
- `src/context/` — App state (onboarding answers, selected portfolio, slider)
- `src/data/` — Portfolios, questions, asset classes
- `src/lib/` — Slider logic with guardrails, illustrative metrics

For more on data integration points, theme tokens, and risk-score mapping, see the **Developer Notes** page in the app (`/developer-notes`) or the comments in the codebase.

## Disclaimer

StartFolio is an educational tool and does not provide personalized financial advice. Consult a qualified financial advisor before making investment decisions.
