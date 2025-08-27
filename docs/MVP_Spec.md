# Lane AI — MVP Spec (Phase-1)

## Purpose
Lane AI converts a founder goal into an auditable workspace: seeded dashboards, deterministic calculators, traceable insights, and a CEO-ready Strategy Snapshot export. This document is the single source of truth for Phase-1.

## Must-have deliverables (Phase-1)
1. **End-to-end ROI flow** (must): UI form → deterministic calc → save to DB (worksheets) → emit timeline event (AI HQ) → 1-click Strategy Snapshot PDF export.
2. **Two additional worksheets** duplicating ROI pattern: **Break-Even** and **Cashflow Forecast** (same UI/DB/export pattern).
3. **blocks_registry.json** present in repo with 130 blocks (latent by default). Hero blocks (ROI, Cashflow, Break-Even, Hire, Pricing, CAC-LTV) visible=true; others visible=false.
4. **Supabase persistence**: use Supabase/Postgres for `ventures`, `worksheets`, `timeline_events`, `ai_audit`, `usage_ledger`, and `audit_logs`.
5. **Guardrails & calc_engine**: single deterministic `calc_engine` used by UI & APIs; `enforceGuardrails` validates inputs and returns structured 'insufficient data' responses.
6. **Hybrid insight contract**: every insight returns `structured_numbers`, `assumptions`, `confidence` and optional `narrative`. Narrative only when requested (metered).
7. **Export**: Strategy Snapshot PDF/XLSX with sections: Situation, Key Numbers, Recommendation, Next Actions, Assumptions.
8. **Admin & Founder Pack**: admin console for feature flags and allowlist; Founder Pack is private and must not be included in public dev handoff.
9. **Audit & Quota**: `ai_audit` logging of LLM calls (model, tokens), usage ledger & quota enforcement middleware.
10. **Verify & CI**: `.github/workflows/ci.yml` runs `verify_bundle.sh` which must produce smoke artifacts: `roi_response.json`, `roi_with_reasoning.json`, `smoke_test.pdf`, `verification_report.json`.
11. **Security**: RLS policies restrict access by `user_id`; Founder Mode endpoints require admin allowlist.

## Acceptance criteria
- Registry: `src/data/blocks_registry.json` exists, valid JSON, 130 entries (hero blocks visible=true).  
- DB: canonical migration executed on Supabase; RLS policies present.  
- Calc engine: ROI, Cashflow, Break-Even unit tests pass.  
- Worksheet flow: running ROI creates `worksheets` + `timeline_events`.  
- Export: Strategy Snapshot matches required sections and a golden sample for smoke test.  
- Guardrails: invalid / missing inputs return structured `insufficient data` and do NOT create timeline events.  
- Audit: any LLM call is logged to `ai_audit` before charging or decrementation.  
- Admin: feature flag toggles visibility and the UI reflects changes.

## Dev/run notes (quick)
- Branch for fixes: `phase1-repair` (work there until accepted).  
- Supabase envs: set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in deployment secrets (never in repo).  
- Local placeholder config: `src/api/config.js` should contain placeholder tokens until secrets are set in the environment.

## Handoff package (what to include in deliverable)
- `LaneAI_App_Phase1.zip`: repository snapshot (without Founder Pack), built assets & Dockerfile for Puppeteer export.  
- `LaneAI_Docs_Package.zip`: `PHASE1_ACCEPTANCE.md`, `PHASE1_LOVABLE_WIRING.md`, env template, verify scripts.  
- `LaneAI_Founder_Pack.zip` (separate, private; do not include in public repo).

## Notes and constraints
- Progressive disclosure is mandatory: surface only selected hero blocks on day one.  
- Deterministic math first — LLM only for optional narrative & synthesis.  
- Founder Pack must stay private; separate distribution process required.

*End of MVP spec.*
