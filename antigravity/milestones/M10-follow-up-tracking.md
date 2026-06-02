# M10 — Follow-Up State Tracking

## Objective

Track coordination state on each exception beyond raw compliance status.

## Scope

- Follow-up status enum on `ComplianceRecord` (not contacted → contacted → awaiting renewal → resolved)
- `followUpNotes`, `lastContactedAt` editable in admin UI
- RESOLVED removes item from active follow-up workload when issue cleared

## Out of scope

- Email send (M13)
- Queue sort tweaks (M9 may consume these fields)

## Acceptance criteria

- [ ] Admin can update follow-up status and notes
- [ ] Last contacted date optional but validated
- [ ] Queue can filter by follow-up state (wire in M9 if not done)

## Tests

- Set ESCALATED → appears in queue sort tier per PRD
- Set RESOLVED → excluded from open follow-up filter

## Stop condition

Coordinators can record outreach state without spreadsheets.
