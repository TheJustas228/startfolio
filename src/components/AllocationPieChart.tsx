'use client';

/**
 * Allocation pie chart component using Recharts.
 * Deep purple theme — coordinated with Specista palette.
 */

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PortfolioAllocation } from '@/data/portfolios';
import { ASSET_CLASSES } from '@/data/assetClasses';

interface Props {
  allocations: PortfolioAllocation[];
  size?: number;
  showLegend?: boolean;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function AllocationPieChart({ allocations, size = 280, showLegend = true }: Props) {
  const data: ChartData[] = allocations
    .filter((a) => a.weight > 0)
    .map((a) => ({
      name: ASSET_CLASSES[a.asset]?.name ?? a.asset,
      value: Math.round(a.weight * 10) / 10,
      color: ASSET_CLASSES[a.asset]?.color ?? '#6E5F99',
    }));

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: ChartData }> }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
      <div
        style={{
          background: '#14103A',
          border: '1px solid #2D1B69',
          borderRadius: 10,
          padding: '8px 14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
          fontSize: 14,
          color: '#FFFFFF',
        }}
      >
        <span style={{ color: item.payload.color, fontWeight: 600 }}>
          {item.name}
        </span>
        : {item.value}%
      </div>
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: size + 40 }}>
      <ResponsiveContainer width="100%" height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.22}
            outerRadius={size * 0.42}
            paddingAngle={2}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
            stroke="#0B0520"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {showLegend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'center', marginTop: 8 }}>
          {data.map((entry) => (
            <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: entry.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: '#A89EC4' }}>{entry.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
