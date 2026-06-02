# M5 — Compliance Item Setup

## Objective

Configure compliance item definitions (seed defaults + admin edits).

## Scope

- List compliance items (seed + custom)
- CRUD: name, description, category, `expiresAfterDays`, `isRequired`, sort order
- Protect default items from destructive delete if seeded (`isDefault`)

## Out of scope

- Per-employee records (M6–M7)
- Exception queue (M9)

## Acceptance criteria

- [ ] Eight default HCBS items visible after M1 seed
- [ ] Admin can add/edit non-destructive fields
- [ ] Required flag drives M6 auto-create behavior

## Tests

- Seed count = 8 defaults
- Add custom item → available for new employee records

## Stop condition

Item catalog correct before auto-record creation.
