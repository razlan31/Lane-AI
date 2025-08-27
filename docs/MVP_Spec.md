git clone https://github.com/razlan31/Lane-AI.git
cd Lane-AI
mkdir -p docs
cat > docs/MVP_Spec.md <<'EOF'
# LaneAI MVP Spec (Public Demo)

Must-have (v1):
- ROI Calculator: inputs → compute → save result to Supabase → show in AI HQ timeline → 1-click PDF export.
- Breakeven Calculator and Monthly Cashflow Calculator: same pattern as ROI (copy the ROI flow).
- AI HQ Timeline: shows events (insight/decision/artifact) from worksheets.
- Use Supabase for persistence (hosted free tier). No server required for MVP (frontend talks directly to Supabase).
- Export: simple PDF export from each worksheet.

Out of scope (v1):
- Stripe payments & SSO (Phase 2).
- Full 130 blocks surfaced in UI (keep the registry latent; surface only 3 hero blocks).
- Advanced adaptive ML features (Phase 2).

Deliverable for Lovable:
- Implement full ROI flow end-to-end (UI form, deterministic calculator, save to Supabase, timeline event, PDF export).
- Provide two extra worksheets (breakeven, cashflow) by duplicating the ROI pattern.
- Ensure README contains exact dev/run steps and Supabase keys placeholder.
EOF

git add docs/MVP_Spec.md
git commit -m "chore(docs): add MVP_Spec"
git push origin main
