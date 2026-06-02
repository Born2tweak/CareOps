# M15 — Audit Log

## Objective

Immutable trail of admin changes (FR-9).

## Scope

- Write `AuditLog` on create/update/delete: employees, items, records, follow-up changes
- Fields: actor user id, entity type, entity id, action, JSON details, timestamp
- Admin UI: searchable/filterable log (date range, entity)

## Out of scope

- Export of audit log (M16 covers compliance export)
- Employee-facing visibility

## Acceptance criteria

- [ ] Every mutation in M4–M10 paths produces audit row
- [ ] Log readable by admin only
- [ ] Details sufficient to reconstruct change

## Tests

- Edit record → audit entry with before/after in JSON
- Non-admin cannot read log API

## Stop condition

Compliance coordinator can answer “who changed this?”
