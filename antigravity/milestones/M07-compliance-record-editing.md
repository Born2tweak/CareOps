# M7 — Compliance Record Editing

## Objective

Admins update individual compliance records (dates, status, notes).

## Scope

- Edit UI from employee detail or matrix view
- Fields: status, completed date, expiration date, notes
- Validation: expiration after completion when both set
- Follow-up fields stub OK (full M10)

## Out of scope

- Automated EXPIRED status (M8)
- Queue listing (M9)

## Acceptance criteria

- [ ] Admin can mark COMPLETE with dates
- [ ] Admin can set MISSING/PENDING explicitly
- [ ] Changes persist and reload correctly
- [ ] Mutations require admin auth

## Tests

- Mark complete → status COMPLETE + dates saved
- Clear expiration → validation where applicable

## Stop condition

Coordinators can maintain record-level truth before expiration automation.
