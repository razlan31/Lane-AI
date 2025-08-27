const fs = require('fs');
const path = require('path');

const inputPath = path.join(process.cwd(), 'artifacts', 'roi_response.json');
if (!fs.existsSync(inputPath)) {
  console.error('Missing artifacts/roi_response.json — run scripts/verify_run.cjs first.');
  process.exit(2);
}

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const outHtml = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Strategy Snapshot — Verify</title>
  <style>
    body{font-family: Arial, Helvetica, sans-serif; padding:30px; color:#111}
    h1{font-size:20px;margin-bottom:8px}
    h2{font-size:14px;margin-top:18px}
    pre{background:#f7f7f7;padding:12px;border-radius:6px;overflow:auto}
    .section{margin-bottom:18px}
  </style>
</head>
<body>
  <h1>Strategy Snapshot (Verify)</h1>
  <div class="section"><strong>Situation</strong>
    <div>Verification ROI run inserted by scripts/verify_run.cjs</div>
  </div>
  <div class="section"><h2>Key Numbers</h2>
    <pre>${JSON.stringify(data.out, null, 2)}</pre>
  </div>
  <div class="section"><h2>Recommendation</h2>
    <div>Based on deterministic ROI calculation — review payback month and net.</div>
  </div>
  <div class="section"><h2>Next Actions</h2>
    <ul><li>Review the worksheet in app</li><li>Export this snapshot for stakeholders</li></ul>
  </div>
  <div class="section"><h2>Assumptions</h2>
    <pre>${JSON.stringify(data.worksheetData?.[0]?.inputs || {}, null, 2)}</pre>
  </div>
</body>
</html>
`;
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/smoke_test.html', outHtml);
console.log('Wrote artifacts/smoke_test.html');

(async () => {
  try {
    let puppeteer;
    try {
      puppeteer = require('puppeteer');
    } catch (e) {
      puppeteer = null;
    }
    if (puppeteer) {
      const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(outHtml, { waitUntil: 'networkidle0' });
      const pdfPath = 'artifacts/smoke_test.pdf';
      await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
      await browser.close();
      console.log('Wrote artifacts/smoke_test.pdf');
    } else {
      console.log('Puppeteer not installed — skipping PDF generation. Use artifacts/smoke_test.html as fallback.');
    }
    process.exit(0);
  } catch (err) {
    console.error('export_snapshot error', err);
    process.exit(4);
  }
})();
