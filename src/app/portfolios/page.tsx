'use client';

/**
 * Portfolio selection screen — shows all 4 model portfolios as cards.
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { PORTFOLIOS } from '@/data/portfolios';
import { useAppContext } from '@/context/AppContext';
import PortfolioCard from '@/components/PortfolioCard';
import styles from './page.module.css';

export default function PortfoliosPage() {
  const router = useRouter();
  const { recommendation, selectPortfolio } = useAppContext();

  const handleSelect = (id: string) => {
    selectPortfolio(id);
    router.push(`/customize`);
  };

  return (
    <main className={styles.main}>
      <div className="container-wide">
        <div className="page-header">
          <h1>Model Portfolios</h1>
          <p>
            Four diversified portfolios designed for different comfort levels.
            Each uses broad, liquid asset classes — no individual stock picking,
            no market predictions.
          </p>
        </div>

        {/* Portfolio grid */}
        <div className={styles.grid}>
          {PORTFOLIOS.map((portfolio) => (
            <PortfolioCard
              key={portfolio.id}
              portfolio={portfolio}
              isRecommended={recommendation?.portfolioId === portfolio.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className={styles.footerNote}>
          All portfolios are starting points designed for illustration. They do
          not constitute personalized financial advice. Allocations can be
          adjusted using the customization slider after selecting a portfolio.
        </p>
      </div>
    </main>
  );
}
