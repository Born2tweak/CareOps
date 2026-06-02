# CareOps MVP — Milestone Roadmap

## Progress

- [x] Milestone 0 — Project Setup
- [x] Milestone 1 — Database Foundation
- [x] Milestone 2 — Admin Auth
- [x] Milestone 3 — Admin Layout Shell
- [x] Milestone 4 — Employee CRUD
- [x] Milestone 5 — Compliance Item Setup
- [x] Milestone 6 — Auto-Create Employee Compliance Records
- [x] Milestone 7 — Compliance Record Editing
- [x] Milestone 8 — Expiration Logic
- [x] Milestone 9 — Exception Queue
- [x] Milestone 10 — Follow-Up State Tracking
- [x] Milestone 11 — Admin Dashboard Metrics
- [x] Milestone 12 — Reminder Drafting
- [x] Milestone 13 — Email Reminder Sending
- [x] Milestone 14 — Scheduled Reminder Automation
- [x] Milestone 15 — Audit Log
- [x] Milestone 16 — CSV Export
- [x] Milestone 17 — Mobile Responsiveness
- [x] Milestone 18 — Production Hardening
- [ ] Milestone 19 — Pilot Deployment
- [x] Milestone 20 — Document Vault

## M19 — Pilot Deployment

Remaining steps (configuration, not code):

1. Create Vercel project linked to this repo
2. Set production environment variables in Vercel dashboard
3. Run `prisma migrate deploy` against production database
4. Create first admin user via `scripts/create-admin.mjs`
5. Verify cron job fires at `/api/cron/check-expirations`
6. Smoke test: login → dashboard → queue → employee → compliance record → reminder

## Rule

One milestone at a time. Each milestone is narrow enough for safe AI-agent execution.
Do not start the next milestone until the current one passes all acceptance criteria.

## Full Details

Per-milestone specs: [`antigravity/milestones/`](antigravity/milestones/README.md) (scope, acceptance criteria, tests, stop conditions).
