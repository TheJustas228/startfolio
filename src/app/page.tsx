'use client';

/**
 * Landing page.
 *
 * Every number and portfolio shown here is read from the same data and
 * logic modules the app itself uses, so the page cannot drift out of sync
 * with the product.
 */

import React from 'react';
import Link from 'next/link';
import { PORTFOLIOS } from '@/data/portfolios';
import { ASSET_CLASSES, ASSET_CLASS_ORDER } from '@/data/assetClasses';
import { QUESTIONS } from '@/data/questions';
import HeroPreview from '@/components/HeroPreview';
import styles from './page.module.css';

const REPO_URL = 'https://github.com/TheJustas228/Startfolio';

const STEPS = [
  {
    n: '01',
    title: 'Answer a few questions',
    body: `${QUESTIONS.length} short questions about your time horizon and how you would react to a drop. No account, no email, no personal data leaves your browser.`,
  },
  {
    n: '02',
    title: 'Get a starting portfolio',
    body: 'You are matched to one of four model portfolios, with a plain-English explanation of what each holding is for and what can go wrong with it.',
  },
  {
    n: '03',
    title: 'Tune safety against growth',
    body: 'One slider shifts the allocation along the risk spectrum. Diversification guardrails stop it from collapsing into a single-asset bet.',
  },
];

const UNDER_THE_HOOD = [
  {
    title: 'Deterministic allocation engine',
    body: 'The Safety ↔ Growth slider runs through a pure interpolation module with hard diversification constraints, so the same input always yields the same allocation and no position can run away.',
    file: 'src/lib/sliderLogic.ts',
  },
  {
    title: 'Portfolio risk maths',
    body: 'Volatility uses the full covariance formula σₚ = √(Σ wᵢwⱼσᵢσⱼρᵢⱼ) across an assumed correlation matrix — not a weighted average — with a documented seam for swapping in real historical returns.',
    file: 'src/lib/metrics.ts',
  },
  {
    title: 'Content as typed data',
    body: 'Portfolios, asset classes, and questionnaire logic are typed data modules rather than markup, so a new portfolio is a data change and the UI follows automatically.',
    file: 'src/data/portfolios.ts',
  },
  {
    title: 'Honest by construction',
    body: 'Every estimate is labelled illustrative at the point it is displayed, and each portfolio ships with a "what can go wrong" and "common mistakes" section instead of only upside.',
    file: 'src/app/summary/page.tsx',
  },
];

export default function LandingPage() {
  return (
    <main>
      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden />
              Educational tool · no advice, no predictions
            </span>

            <h1 className={styles.title}>
              Choose a diversified portfolio{' '}
              <span className={styles.titleAccent}>you can stick with.</span>
            </h1>

            <p className={styles.subtitle}>
              StartFolio helps new investors pick a simple, balanced starting
              point based on time horizon and risk tolerance — so the hard part
              becomes staying invested, not choosing.
            </p>

            <div className={styles.actions}>
              <Link href="/onboarding" className="btn btn-primary btn-lg">
                Find your portfolio
              </Link>
              <Link href="/portfolios" className="btn btn-outline btn-lg">
                Browse all four
              </Link>
            </div>

            <ul className={styles.stats}>
              <li>
                <strong>{PORTFOLIOS.length}</strong>
                <span>model portfolios</span>
              </li>
              <li>
                <strong>{ASSET_CLASS_ORDER.length}</strong>
                <span>asset classes</span>
              </li>
              <li>
                <strong>0</strong>
                <span>stock picks</span>
              </li>
            </ul>
          </div>

          <div className={styles.heroPreview}>
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>How it works</span>
          <h2>Three steps, about two minutes</h2>
          <p>
            No sign-up and no brokerage connection. StartFolio never executes
            trades or holds funds — it only helps you decide what to hold.
          </p>
        </div>

        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li key={step.n} className={styles.step}>
              <span className={styles.stepNumber}>{step.n}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Portfolios ---------- */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>The portfolios</span>
          <h2>Four starting points, fully explained</h2>
          <p>
            Each one is built from broad, liquid asset classes and comes with
            what it is designed for, what can go wrong, and the mistakes people
            most often make with it.
          </p>
        </div>

        <div className={styles.portfolioGrid}>
          {PORTFOLIOS.map((portfolio) => (
            <Link
              key={portfolio.id}
              href={`/portfolios/${portfolio.id}`}
              className={styles.portfolioCard}
              style={{ ['--accent' as string]: portfolio.accent }}
            >
              <span className={styles.portfolioAccent} aria-hidden />
              <h3 className={styles.portfolioName}>{portfolio.name}</h3>
              <p className={styles.portfolioPurpose}>{portfolio.shortPurpose}</p>

              {/* Stacked allocation bar, drawn from the real weights */}
              <div className={styles.bar} aria-hidden>
                {portfolio.allocations.map((a) => (
                  <span
                    key={a.asset}
                    className={styles.barPart}
                    style={{
                      width: `${a.weight}%`,
                      background: ASSET_CLASSES[a.asset].color,
                    }}
                  />
                ))}
              </div>

              <p className={styles.portfolioWeights}>
                {portfolio.allocations
                  .map((a) => `${a.weight}% ${ASSET_CLASSES[a.asset].shortName}`)
                  .join(' · ')}
              </p>

              <span className={styles.portfolioLink}>Read the breakdown →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Under the hood ---------- */}
      <section id="under-the-hood" className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>Under the hood</span>
          <h2>How it is built</h2>
          <p>
            Next.js 14 App Router, React 18 and TypeScript, with the domain
            logic kept out of the components and documented for whoever picks
            it up next.
          </p>
        </div>

        <div className={styles.hoodGrid}>
          {UNDER_THE_HOOD.map((item) => (
            <article key={item.title} className={styles.hoodCard}>
              <h3 className={styles.hoodTitle}>{item.title}</h3>
              <p>{item.body}</p>
              <code className={styles.hoodFile}>{item.file}</code>
            </article>
          ))}
        </div>

        <div className={styles.hoodActions}>
          <Link href="/developer-notes" className="btn btn-secondary">
            Read the developer notes
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            View the source ↗
          </a>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className={styles.section}>
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Pick something boring and stay in it.</h2>
          <p className={styles.ctaBody}>
            The portfolio you keep through a bad year beats the one you abandon
            in month three. Start with a structure you actually understand.
          </p>
          <Link href="/onboarding" className="btn btn-primary btn-lg">
            Find your portfolio
          </Link>
        </div>
      </section>
    </main>
  );
}
