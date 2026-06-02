# CareOps — Project Context

_Last updated: 2026-06-02_

## Product focus

**Admin-only exception management.** Primary screen: **Exception Queue** (`/admin/queue`). Not EHR, scheduling, employee portal, or spreadsheet replacement.

## Active milestone

| Field | Value |
|-------|--------|
| **Current** | M19 — Pilot Deployment |
| **Status** | Pending (requires Vercel + Supabase production setup) |
| **Previous** | M0–M18 (**all complete**) |

## What's built (M0–M18)

### Core Infrastructure (M0–M4)
- Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui
- Prisma 7 + Supabase PostgreSQL (`@prisma/adapter-pg` via `prisma-client-factory.ts`)
- Supabase Auth (session middleware, `requireAdmin()` gate)
- Admin layout shell with responsive sidebar nav (hamburger drawer on mobile)
- Employee CRUD: list with status filter, create, edit, deactivate

### Compliance Engine (M5–M8)
- **Compliance Items**: CRUD with categories, expiration rules, required flag
- **Auto-Create Records**: missing records created on employee add; backfill on new required item
- **Record Editing**: inline expand form with status, dates, notes
- **Expiration Logic**: `computeUrgency()`, `effectiveStatus()` — COMPLETE records past expiration treated as EXPIRED

### Exception Queue (M9)
- `/admin/queue` — grouped sections: Critical, Expiring Soon, Missing, Pending Follow-Ups, Recently Resolved
- `getExceptionGroups()` query in `src/lib/compliance/exceptions.ts`

### Follow-Up & Workflow (M10–M12)
- **Follow-Up Tracking**: followUpStatus (NOT_CONTACTED → ESCALATED → RESOLVED), followUpNotes, lastContactedDate on every compliance record
- **Dashboard Metrics**: `/admin` — stats cards (active employees, compliance rate, expired, expiring, onboarding incomplete)
- **Reminder Drafting**: template generator (expired/expiring/missing), email + SMS formats, copy-to-clipboard, inline in record edit form

### Communications (M13–M14)
- **Email Sending**: Resend integration, send reminder from record edit form, duplicate send protection (24h), ReminderLog model
- **Scheduled Automation**: `/api/cron/check-expirations` — daily cron creates notifications at 30/14/7/0-day thresholds, auto-emails at 14d and 7d
- **Notification System**: bell icon in header, `/admin/notifications` page, mark all read

### Audit & Export (M15–M16)
- **Audit Log**: `logAuditEvent()` on employee create/update/deactivate, compliance record update, reminder send; audit timeline on employee detail page
- **CSV Export**: `/api/export?type=all|incomplete|expiring|exceptions`; export buttons on employees and queue pages

### Production Readiness (M17–M18)
- **Mobile Responsiveness**: 44px touch targets, responsive grids, horizontal scroll tables
- **Production Hardening**: error boundary, loading skeleton, not-found page, env validation module

## Key files

| Area | Path |
|------|------|
| Prisma schema | `prisma/schema.prisma` |
| Prisma client factory | `src/lib/prisma-client-factory.ts` |
| Auth helpers | `src/lib/auth.ts` |
| Design tokens | `src/lib/design-tokens.ts` |
| Compliance logic | `src/lib/compliance/` (urgency, exceptions, auto-create, display, validation, follow-up) |
| Dashboard metrics | `src/lib/dashboard/metrics.ts` |
| Reminder templates | `src/lib/reminders/templates.ts` |
| Email client | `src/lib/email/resend.ts` |
| Notifications | `src/lib/notifications/` (create, queries) |
| Audit logging | `src/lib/audit.ts` |
| CSV export | `src/lib/export/csv.ts` |
| Admin create script | `scripts/create-admin.mjs` |
| Cron config | `vercel.json` |

## Database models

User, Employee, ComplianceItem, ComplianceRecord (with followUp fields), Notification, ReminderLog, AuditLog

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/login` | Supabase auth login |
| `/forbidden` | Unauthorized access |
| `/admin` | Dashboard with metrics grid |
| `/admin/queue` | Exception Queue (grouped by urgency) |
| `/admin/employees` | Employee list with status filter |
| `/admin/employees/new` | Create employee |
| `/admin/employees/[id]` | Edit employee + compliance checklist + audit timeline |
| `/admin/compliance-items` | Compliance item list with category filter |
| `/admin/compliance-items/new` | Create compliance item |
| `/admin/compliance-items/[id]` | Edit compliance item |
| `/admin/notifications` | Notification list with mark-all-read |
| `/api/cron/check-expirations` | Daily cron for expiration alerts |
| `/api/export` | CSV export (type param) |

## Admin account

Created via `scripts/create-admin.mjs` — creates Supabase Auth user + database User with ADMIN role.

## Blockers

None for M19. All code complete. Deployment requires Vercel project setup and production env vars.

## Deferred (post-MVP)

Employee portal, scheduling, EHR, family portal, Therap, AI summaries, document uploads.

## Implementation rule

One milestone at a time — `MILESTONE_ROADMAP.md` + `antigravity/milestones/`.

## Doc audit

| Doc | Status |
|-----|--------|
| `PRODUCT_BRIEF.md` | Current |
| `PRD.md` | Current |
| `ARCHITECTURE.md` | Updated M18 |
| `AI_RULES.md` | Current |
| `MILESTONE_ROADMAP.md` | M0–M18 complete |
| `README.md` | Updated M18 |
