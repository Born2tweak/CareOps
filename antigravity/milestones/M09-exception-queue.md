# M9 — Exception Queue (PRIMARY)

## Objective

Deliver the core product screen: prioritized list of compliance exceptions.

## Scope

- Route: `/admin/queue` (or admin home)
- Query per PRD FR-6 (missing, expired, pending, follow-up open)
- Sort by severity then expiration
- Filters: status, employee, item, follow-up state
- Row actions: link to record detail / edit

## Acceptance criteria

- [ ] Admin sees only exceptions (not all complete records)
- [ ] Default sort matches PRD
- [ ] Page answers “what needs attention today?” in one view
- [ ] Load time acceptable with 100+ seeded records
- [ ] Empty state when no exceptions

## Tests

- Seed mix of MISSING, EXPIRED, COMPLETE — verify queue contents
- Manual: coordinator walkthrough < 2 min to top 10

## Stop condition

This milestone is the MVP centerpiece; do not ship pilot without M9 complete.
