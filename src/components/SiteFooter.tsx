'use client';

/**
 * Shared site footer: navigation, source link, and the educational-use
 * disclaimer that has to appear on every page.
 */

import React from 'react';
import Link from 'next/link';
import styles from './SiteFooter.module.css';

const REPO_URL = 'https://github.com/TheJustas228/Startfolio';

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <span className={styles.brandName}>StartFolio</span>
            <p className={styles.tagline}>
              Choose a diversified portfolio you can stick with.
            </p>
          </div>

          <nav className={styles.columns} aria-label="Footer">
            <div className={styles.column}>
              <h2 className={styles.columnTitle}>Product</h2>
              <Link href="/onboarding">Find your portfolio</Link>
              <Link href="/portfolios">Model portfolios</Link>
              <Link href="/#how-it-works">How it works</Link>
            </div>
            <div className={styles.column}>
              <h2 className={styles.columnTitle}>Project</h2>
              <Link href="/developer-notes">Developer notes</Link>
              <Link href="/#under-the-hood">Under the hood</Link>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                Source on GitHub ↗
              </a>
            </div>
          </nav>
        </div>

        <p className={styles.disclaimer}>
          StartFolio is an educational tool. It does not provide personalized
          financial advice, does not predict markets, and does not guarantee
          returns. All figures shown are illustrative. Consult a qualified
          financial advisor for decisions specific to your situation.
        </p>
      </div>
    </footer>
  );
}
