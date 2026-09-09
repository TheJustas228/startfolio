# StartFolio

**Choose a diversified portfolio you can stick with.**

StartFolio is a beginner-friendly investing web app that helps new investors pick a simple, diversified long-term portfolio—without jargon, hype, or stock-picking. It focuses on safety, clarity, and realistic expectations.

## Features

- **Model portfolios** — Four pre-built portfolios (Conservative Balanced, Core Balanced, Growth Focus, Inflation-Resilient) with clear allocations and plain-English explanations
- **Onboarding** — Short questionnaire (5 questions) that recommends a starting portfolio and slider position based on your time horizon and risk comfort
- **Customization** — Single “Safety ↔ Growth” slider with strict diversification guardrails; optional inflation diversifiers
- **Transparent content** — Per-portfolio sections on what each part does, what can go wrong, common mistakes, and time-horizon guidance
- **Illustrative metrics** — Placeholder volatility and worst-year estimates (clearly labeled); structure in place to plug in real historical data later
- **Marketing landing page** — Hero with a live product preview that renders the real portfolio data through the real metrics engine, so it cannot drift from the app
- **Galaxy-style UI** — Deep purple theme, cursor-following glow (desktop only), and optional “space with stars” background on inner pages
- **Accessible by default** — Shared sticky nav with a keyboard skip link, visible focus rings, and full `prefers-reduced-motion` support (the cursor glow and the auto-rotating preview both stand down)

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

- `src/app/` — Routes: landing, onboarding, portfolios, portfolio detail, customize, summary
- `src/components/` — Shared UI (site nav and footer, hero preview, allocation chart, portfolio cards, cursor glow, backgrounds)
- `src/hooks/` — `useReducedMotion` (single source of truth for motion preference)
- `src/context/` — App state (onboarding answers, selected portfolio, slider)
- `src/data/` — Portfolios, questions, asset classes
- `src/lib/` — Slider logic with guardrails, illustrative metrics

Data integration points, risk-score mapping, and the slider guardrails are documented in the comments at the top of `src/lib/metrics.ts`, `src/lib/sliderLogic.ts`, and `src/data/questions.ts`.

## Notes on the build

- Domain logic lives in `src/lib/` and is pure — the slider runs through a deterministic interpolation with hard diversification constraints, and portfolio volatility uses the full covariance formula rather than a weighted average.
- Portfolios, asset classes, and questionnaire scoring are typed data modules, so adding a portfolio is a data change and every screen (including the landing page) follows automatically.
- Illustrative figures are labelled as such wherever they appear, and each portfolio ships with "what can go wrong" and "common mistakes" alongside the upside.

## Disclaimer

StartFolio is an educational tool and does not provide personalized financial advice. Consult a qualified financial advisor before making investment decisions.
