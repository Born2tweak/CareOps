# M6 — Auto-Create Employee Compliance Records

## Objective

When an employee is added, create one `ComplianceRecord` per required item.

## Scope

- On employee create (and optionally ONBOARDING → ACTIVE): insert records for all `isRequired` items
- Initial status: `MISSING` (or `PENDING` per PRD default)
- Idempotent: no duplicate employee×item rows

## Out of scope

- Bulk import
- Retroactive backfill UI (manual script OK if documented)

## Acceptance criteria

- [ ] New employee has N records where N = required items count
- [ ] Re-running create path does not duplicate
- [ ] Optional items excluded unless configured otherwise

## Tests

- Create employee → `ComplianceRecord` count matches required items
- DB unique constraint on employee+item respected

## Stop condition

Every active employee has a full compliance matrix skeleton.
