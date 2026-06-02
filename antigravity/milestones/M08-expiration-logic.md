# M8 — Expiration Logic

## Objective

Automatically reflect expired compliance based on dates (no manual flagging).

## Scope

- Rule: `expirationDate < today` → status `EXPIRED`
- Trigger on record save and/or scheduled job (daily)
- Optional: EXPIRING_SOON window (config constant)
- Does not remove COMPLETE records without expiration

## Out of scope

- Email reminders (M12–M14)
- Queue UI (M9) — but enables correct queue data

## Acceptance criteria

- [ ] Past expiration → EXPIRED without admin toggle
- [ ] Future expiration + COMPLETE stays COMPLETE
- [ ] Job or hook documented in README/ARCHITECTURE

## Tests

- Seed record with yesterday expiration → EXPIRED after job/save
- Update expiration to future → status recalculated appropriately

## Stop condition

Exception queue (M9) can trust status field for expiration.
