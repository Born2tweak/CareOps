# M18 — Production Hardening

## Objective

Security, reliability, and ops readiness before pilot go-live.

## Scope

- RLS or server-only data access review on Supabase
- Env validation at startup (required keys)
- Error boundaries, logging, health check route
- Rate limits on sensitive routes
- Dependency audit / critical CVEs addressed
- Backup/restore notes in docs

## Out of scope

- Multi-tenant
- SOC2 certification

## Acceptance criteria

- [ ] No secrets in client bundle
- [ ] All mutations require authenticated admin
- [ ] Production build + deploy checklist documented
- [ ] Smoke test script or doc for post-deploy

## Tests

- Attempt anonymous API mutation → 401/403
- `npm run build` on CI-like clean env

## Stop condition

Comfortable exposing app to real agency data in pilot.
