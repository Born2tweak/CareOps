# M14 — Scheduled Reminder Automation

## Objective

Optional recurring check for items needing reminders (cron / Vercel cron / Supabase).

## Scope

- Scheduled job: find expiring/expired/open follow-up candidates
- Create draft notifications or enqueue send per policy
- Config: days-before-expiration, quiet hours (minimal)
- Admin toggle to enable/disable automation

## Out of scope

- Complex drip campaigns
- SMS

## Acceptance criteria

- [ ] Job runs on schedule in staging
- [ ] Does not double-send same record within window
- [ ] Logs visible for last run status

## Tests

- Manual trigger of job handler in dev
- Verify idempotency with duplicate run

## Stop condition

Pilot site can run weekly reminder pass without manual cron scripts.
