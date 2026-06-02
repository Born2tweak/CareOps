# M12 — Reminder Drafting

## Objective

Generate reminder email bodies from templates and record context (no send yet).

## Scope

- Template per compliance item or global template with placeholders
- Draft UI from queue row or bulk selection
- Preview: employee name, item, expiration, notes
- Store draft in UI state or `Notification` as DRAFT

## Out of scope

- Resend delivery (M13)
- Cron (M14)

## Acceptance criteria

- [ ] Admin sees editable draft before send
- [ ] Placeholders resolve from selected records
- [ ] No email leaves the system in this milestone

## Tests

- Select 3 exceptions → 3 distinct drafts
- Missing email on employee → clear error

## Stop condition

Copy-ready reminders without manual mail merge.
