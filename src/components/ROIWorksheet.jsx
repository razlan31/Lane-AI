// src/components/ROIWorksheet.jsx
import React, { useState } from 'react';
import { computeROI } from '../../packages/core/calc_engine/roi.js';
import { supabase } from '../lib/supabaseClient';

export default function ROIWorksheet({ ventureId, userId }) {
  const [inputs, setInputs] = useState({
    monthlyRevenueIncrease: 0,
    monthlyCostChange: 0,
    months: 12,
    initialInvestment: 0
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function onChange(e) {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: Number(value) }));
  }

  async function runAndSave() {
    setError(null);
    setLoading(true);
    try {
      // Deterministic calc (single source)
      const out = computeROI(inputs);
      setResult(out);

      // Save to worksheets table
      const payload = {
        venture_id: ventureId || null,
        user_id: userId || null,
        type: 'roi',
        inputs,
        outputs: out
      };

      const { error: insertErr } = await supabase.from('worksheets').insert([payload]);
      if (insertErr) throw insertErr;

      // Emit timeline event
      await supabase.from('timeline_events').insert([{
        venture_id: ventureId || null,
        kind: 'insight',
        title: 'ROI run',
        body: `ROI run saved.`,
        payload: { inputs, outputs: out }
      }]);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error saving result');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 760, padding: 18, background: 'var(--card, #0b1220)', borderRadius: 10 }}>
      <h3>ROI Worksheet</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <label>
          Monthly revenue increase
          <input name="monthlyRevenueIncrease" type="number" value={inputs.monthlyRevenueIncrease} onChange={onChange} />
        </label>

        <label>
          Monthly cost change
          <input name="monthlyCostChange" type="number" value={inputs.monthlyCostChange} onChange={onChange} />
        </label>

        <label>
          Months
          <input name="months" type="number" value={inputs.months} onChange={onChange} />
        </label>

        <label>
          Initial investment
          <input name="initialInvestment" type="number" value={inputs.initialInvestment} onChange={onChange} />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={runAndSave} disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Running...' : 'Run & Save'}
        </button>
        <button onClick={() => { setResult(null); setError(null); }} style={{ marginLeft: 8 }}>Reset</button>
      </div>

      {error && <div style={{ color: 'salmon', marginTop: 12 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 14 }}>
          <h4>Result</h4>
          <div><strong>Total gain:</strong> {result.totalGain}</div>
          <div><strong>Net:</strong> {result.net}</div>
          <div><strong>ROI %:</strong> {result.roiPct === null ? '—' : result.roiPct.toFixed(1)}</div>
          <div><strong>Payback month:</strong> {result.paybackMonth ?? 'N/A'}</div>
          <details style={{ marginTop: 8 }}>
            <summary>Monthly balances</summary>
            <pre style={{ maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(result.monthlyBalances, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
