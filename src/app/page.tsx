'use client';

/**
 * Landing screen for StartFolio.
 *
 * Specista-inspired hero. Cursor-following glow is global (see CursorGlow in layout).
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.logoMark}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#9A12CA" />
                <stop offset="100%" stopColor="#6A35FF" />
              </linearGradient>
            </defs>
            <rect width="56" height="56" rx="14" fill="url(#logoGrad)" />
            <path
              d="M16 38V26L23 21L30 28L37 18V38H16Z"
              fill="white"
              opacity="0.9"
            />
            <circle cx="37" cy="18" r="3.5" fill="white" />
          </svg>
        </div>
        <h1 className={styles.title}>StartFolio</h1>
        <p className={styles.subtitle}>
          Choose a diversified portfolio you can stick with.
        </p>
        <p className={styles.description}>
          StartFolio provides model portfolios designed for different comfort
          levels. It does not predict markets and does not guarantee returns.
          Instead, it helps you find a simple, balanced starting point based on
          your time horizon and risk tolerance — so you can invest with clarity,
          not anxiety.
        </p>

        <div className={styles.actions}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => router.push('/onboarding')}
          >
            Start
          </button>
          <button
            className="btn btn-outline"
            onClick={() => router.push('/portfolios')}
          >
            Browse portfolios
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>
          StartFolio is an educational tool. It does not provide personalized
          financial advice. Consult a qualified financial advisor for decisions
          specific to your situation.
        </p>
      </footer>
    </main>
  );
}
