# M19 — Pilot Deployment

## Objective

Deploy CareOps for a single HCBS agency pilot on Vercel + Supabase.

## Scope

- Vercel production project linked to repo
- Supabase production settings: auth redirect URLs, connection pooling
- Seed or import pilot employees/items (coordinated with agency)
- Coordinator training doc (1-pager)
- Support channel / feedback loop defined

## Out of scope

- Multi-agency onboarding
- Billing

## Acceptance criteria

- [ ] Production URL live with HTTPS
- [ ] Admin accounts provisioned for pilot coordinators
- [ ] M9 queue validated with real-ish data volume
- [ ] Rollback plan documented

## Tests

- Pilot user login → queue → edit record → export CSV
- 48-hour monitoring: no P1 errors

## Stop condition

Pilot agency actively using Exception Queue as primary coordination surface.
