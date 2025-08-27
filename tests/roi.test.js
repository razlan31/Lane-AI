import { describe, it, expect } from 'vitest';
import { computeROI } from '../packages/core/calc_engine/roi.js';

describe('computeROI', () => {
  it('computes ROI for positive monthly gain', () => {
    const result = computeROI({ monthlyRevenueIncrease: 5000, monthlyCostChange: 500, months: 12, initialInvestment: 20000 });
    expect(result.totalGain).toBe(4500 * 12);
    expect(result.net).toBe(34000);
    expect(Math.round(result.roiPct)).toBe(170);
    expect(result.paybackMonth).toBeGreaterThan(0);
    expect(Array.isArray(result.monthlyBalances)).toBe(true);
  });

  it('handles zero initial investment', () => {
    const r = computeROI({ monthlyRevenueIncrease: 1000, monthlyCostChange: 0, months: 6, initialInvestment: 0 });
    expect(r.roiPct).toBeNull();
  });
});
