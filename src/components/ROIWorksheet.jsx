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
      const out = computeROI(inputs);
      setResult(out);

      const payload = {
        venture_id: ventureId || null,
        user_id: userId || 'anonymous',
        type: 'roi',
        inputs,
        outputs: out
      };

      const { error: insertErr } = await supabase.from('worksheets').insert([payload]);
      if (insertErr) throw insertErr;

      await supabase.from('timeline_events').insert([{
        venture_id: ventureId || null,
        user_id: userId || 'anonymous',
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

  // Build a Strategy Snapshot HTML identical to verify export but client-side
  function buildSnapshotHtml(out) {
    const snapshot = {
      inputs,
      out
    };
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Strategy Snapshot — ROI</title>
  <style>
    body{font-family: Arial, Helvetica, sans-serif; padding:30px; color:#111}
    h1{font-size:20px;margin-bottom:8px}
    h2{font-size:14px;margin-top:18px}
    pre{background:#f7f7f7;padding:12px;border-radius:6px;overflow:auto}
    .section{margin-bottom:18px}
  </style>
</head>
<body>
  <h1>Strategy Snapshot — ROI</h1>
  <div class="section"><strong>Situation</strong>
    <div>ROI worksheet run</div>
  </div>
  <div class="section"><h2>Key Numbers</h2>
    <pre>${JSON.stringify(out, null, 2)}</pre>
  </div>
  <div class="section"><h2>Recommendation</h2>
    <div>Review payback month and net. Use this snapshot as a decision artifact.</div>
  </div>
  <div class="section"><h2>Next Actions</h2>
    <ul><li>Share with stakeholders</li><li>Run sensitivity scenarios</li></ul>
  </div>
  <div class="section"><h2>Assumptions</h2>
    <pre>${JSON.stringify(inputs, null, 2)}</pre>
  </div>
</body>
</html>`;
    return html;
  }

  function download(filename, content, mime = 'text/html') {
    const blob = new Blob([content], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function onExportSnapshot() {
    if (!result) return alert('Run the ROI first.');
    const html = buildSnapshotHtml(result);
    download('Strategy_Snapshot_ROI.html', html, 'text/html');
  }

  function onExportJSON() {
    if (!result) return alert('Run the ROI first.');
    const payload = { inputs, outputs: result };
    download('roi_response.json', JSON.stringify(payload, null, 2), 'application/json');
  }

  return (
    <div style={{ maxWidth: 760, padding: 18, background: 'var(--card, #fff)', borderRadius: 10 }}>
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
        <button onClick={onExportSnapshot} style={{ marginLeft: 8 }}>Export Snapshot (HTML)</button>
        <button onClick={onExportJSON} style={{ marginLeft: 8 }}>Export JSON</button>
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
