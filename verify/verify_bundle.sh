#!/usr/bin/env bash
set -e

# Usage:
# SUPABASE_URL="https://..." SUPABASE_ANON_KEY="..." bash verify/verify_bundle.sh

mkdir -p artifacts

echo "1) Running unit tests (vitest)"
npx vitest run --reporter silent || { echo "Tests failed"; exit 10; }
echo "unit tests passed"

echo "2) Running verify_run (creates worksheet + timeline in Supabase)"
node scripts/verify_run.cjs

echo "3) Exporting snapshot (HTML / PDF fallback)"
node scripts/export_snapshot.cjs

# Create a simple verification_report.json
cat > artifacts/verification_report.json <<'EOF2'
{
  "status": "ok",
  "artifacts": {
    "roi_response": "artifacts/roi_response.json",
    "smoke_html": "artifacts/smoke_test.html",
    "smoke_pdf": "artifacts/smoke_test.pdf"
  },
  "notes": "Check artifacts folder for outputs. If smoke_test.pdf missing, puppeteer was not installed."
}
EOF2

echo "Verification complete. Artifacts written to ./artifacts"
ls -la artifacts
