# M11 — Admin Dashboard Metrics

## Objective

Summary counts so admins see workload at a glance (FR-7).

## Scope

- `/admin/dashboard` or home widgets
- Metrics: open exceptions count, by status bucket, optional by follow-up state
- Server-side queries (no client-side full table scan)

## Out of scope

- Charts library heavy polish (M17)
- Historical trends

## Acceptance criteria

- [ ] Counts match queue query definitions
- [ ] Page loads < 2s with seeded data
- [ ] Links drill into filtered queue where useful

## Tests

- Seed known counts → dashboard numbers match
- After M8 expiration run → EXPIRED count updates

## Stop condition

Leadership can answer “how bad is it?” without opening the full queue.
