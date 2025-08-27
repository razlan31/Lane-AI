const { createClient } = require('@supabase/supabase-js');
const { computeROI } = require('../packages/core/calc_engine/roi.js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_ANON_KEY when running this script.');
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(async () => {
  try {
    const inputs = { monthlyRevenueIncrease: 5000, monthlyCostChange: 500, months: 12, initialInvestment: 20000 };
    console.log('Running deterministic ROI locally...');
    const out = computeROI(inputs);
    const worksheetPayload = {
      venture_id: null,
      user_id: 'verify-script',
      type: 'roi',
      inputs,
      outputs: out
    };
    const { data: worksheetData, error: worksheetError } = await supabase.from('worksheets').insert([worksheetPayload]).select();
    console.log('worksheets insert result:', { worksheetError, worksheetData });

    const timelinePayload = {
      venture_id: null,
      user_id: 'verify-script',
      kind: 'insight',
      title: 'verify: ROI run',
      body: 'verify_run.cjs inserted this event',
      payload: { inputs, outputs: out }
    };
    const { data: timelineData, error: timelineError } = await supabase.from('timeline_events').insert([timelinePayload]).select();
    console.log('timeline insert result:', { timelineError, timelineData });

    const fs = require('fs');
    fs.mkdirSync('artifacts', { recursive: true });
    fs.writeFileSync('artifacts/roi_response.json', JSON.stringify({ worksheetData, timelineData, out }, null, 2));
    console.log('Wrote artifacts/roi_response.json');

    process.exit(0);
  } catch (err) {
    console.error('verify_run error', err);
    process.exit(3);
  }
})();
