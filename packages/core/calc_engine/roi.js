// packages/core/calc_engine/roi.js
// Deterministic ROI calculation used as the single source-of-truth.
// Input shape:
// { monthlyRevenueIncrease, monthlyCostChange = 0, months = 12, initialInvestment }
export function computeROI({ monthlyRevenueIncrease, monthlyCostChange = 0, months = 12, initialInvestment }) {
  // Validate inputs (basic)
  if (typeof monthlyRevenueIncrease !== 'number' || typeof initialInvestment !== 'number' || typeof months !== 'number') {
    throw new Error('Invalid input: monthlyRevenueIncrease, months and initialInvestment are required numbers');
  }

  // Compute monthly net gain (revenue - additional cost)
  const monthlyNet = monthlyRevenueIncrease - (monthlyCostChange || 0);

  // Cumulative gains month by month
  const monthlyBalances = [];
  let cumulative = 0;
  for (let m = 1; m <= months; m++) {
    cumulative += monthlyNet;
    monthlyBalances.push({ month: m, monthlyNet, cumulative });
  }

  const totalGain = monthlyNet * months; // simple deterministic total net over period
  const net = totalGain - initialInvestment; // net after investment
  const roiPct = initialInvestment === 0 ? null : (net / Math.abs(initialInvestment)) * 100;

  // Payback month (first month cumulative >= initialInvestment)
  let paybackMonth = null;
  if (monthlyNet > 0 && initialInvestment > 0) {
    let cum = 0;
    for (let i = 0; i < months; i++) {
      cum += monthlyNet;
      if (cum >= initialInvestment) { paybackMonth = i + 1; break; }
    }
  }

  return {
    totalGain,
    net,
    roiPct,
    paybackMonth,
    monthlyNet,
    monthlyBalances
  };
}
