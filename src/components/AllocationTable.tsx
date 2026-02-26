'use client';

/**
 * Allocation table component — displays asset class names, weights,
 * and color indicators in a clean table format.
 */

import React from 'react';
import { PortfolioAllocation } from '@/data/portfolios';
import { ASSET_CLASSES } from '@/data/assetClasses';
import styles from './AllocationTable.module.css';

interface Props {
  allocations: PortfolioAllocation[];
}

export default function AllocationTable({ allocations }: Props) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Asset Class</th>
            <th style={{ textAlign: 'right' }}>Weight</th>
            <th style={{ width: '40%' }}></th>
          </tr>
        </thead>
        <tbody>
          {allocations
            .filter((a) => a.weight > 0)
            .map((a) => {
              const asset = ASSET_CLASSES[a.asset];
              return (
                <tr key={a.asset}>
                  <td>
                    <div className={styles.assetName}>
                      <span
                        className={styles.dot}
                        style={{ background: asset?.color ?? '#9CA3AF' }}
                      />
                      {asset?.name ?? a.asset}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    {a.weight.toFixed(1)}%
                  </td>
                  <td>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          width: `${a.weight}%`,
                          background: asset?.color ?? '#9CA3AF',
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
