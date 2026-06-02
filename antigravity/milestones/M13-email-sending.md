# M13 — Email Reminder Sending

## Objective

Send drafted reminders via Resend (or configured provider) and log outcomes.

## Scope

- Resend API integration (env `RESEND_API_KEY`)
- Send single/bulk from M12 drafts
- Persist `Notification` rows: sent time, status, provider id, error
- Rate-limit / batch safety for small pilot volumes

## Out of scope

- Scheduled automation (M14)
- Custom domains beyond Resend setup docs

## Acceptance criteria

- [ ] Successful send creates notification log
- [ ] Failed send surfaces error to admin
- [ ] No send without explicit admin action

## Tests

- Sandbox/test recipient receives email
- DB notification row matches send

## Stop condition

Manual reminder workflow end-to-end except scheduling.
