# CareOps — Architecture (MVP)

## Principles

1. **Monolith** — single Next.js application. No microservices.
2. **Admin-first** — route group `(admin)` protected by auth middleware.
3. **Postgres truth** — Prisma + Supabase PostgreSQL; Supabase Auth for identity only.
4. **Server-first** — prefer Server Components and server actions; client state only where needed.
5. **Boring stack** — proven libraries; no new dependency without documented reason.

## System context

```
┌─────────────┐     HTTPS      ┌──────────────────────────────┐
│ Admin user  │ ─────────────► │ Next.js (Vercel)             │
│ (browser)   │                │  App Router + Server Actions │
└─────────────┘                └───────────┬──────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
            ┌───────────────┐    ┌─────────────────┐    ┌─────────────┐
            │ Supabase Auth │    │ Prisma Client   │    │ Resend API  │
            │ (JWT/session) │    │ (@prisma/pg)    │    │ (email)     │
            └───────────────┘    └────────┬────────┘    └─────────────┘
                                          │
                                          ▼
                               ┌─────────────────────┐
                               │ Supabase PostgreSQL │
                               │ (pooler + direct)   │
                               └─────────────────────┘
```

## Repository layout

```
CareOps/
├── antigravity/              # PM workspace (agents, milestone specs)
├── prisma/
│   ├── schema.prisma         # 7 models: User, Employee, ComplianceItem,
│   │                         #   ComplianceRecord, Notification, ReminderLog, AuditLog
│   └── seed.ts
├── scripts/
│   └── create-admin.mjs      # Create Supabase Auth user + ADMIN app user
├── src/
│   ├── app/
│   │   ├── (admin)/           # Protected admin shell
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx           # Dashboard with metrics grid
│   │   │   │   ├── queue/             # Exception Queue
│   │   │   │   ├── employees/         # Employee CRUD + compliance checklist
│   │   │   │   ├── compliance-items/  # Compliance item CRUD
│   │   │   │   └── notifications/     # Notification list
│   │   │   ├── error.tsx              # Error boundary
│   │   │   ├── loading.tsx            # Loading skeleton
│   │   │   └── not-found.tsx          # 404
│   │   ├── (auth)/            # Login
│   │   └── api/
│   │       ├── cron/check-expirations/  # Daily cron route
│   │       └── export/                  # CSV export route
│   ├── components/
│   │   ├── ui/                # shadcn primitives + design system
│   │   └── admin/
│   │       ├── compliance/    # Checklist, record edit form, expiration indicator
│   │       ├── dashboard/     # Stats card, metrics grid
│   │       ├── employees/     # Employee form, deactivate panel, filter
│   │       ├── exceptions/    # Exception section
│   │       ├── export/        # Export button
│   │       ├── notifications/ # Bell, list, mark-all-read
│   │       ├── reminders/     # Reminder draft, copy button
│   │       └── audit/         # Audit timeline
│   └── lib/
│       ├── prisma.ts                  # Singleton via prisma-client-factory
│       ├── prisma-client-factory.ts   # @prisma/adapter-pg + pg Pool
│       ├── auth.ts                    # getAuthUser, requireAdmin
│       ├── audit.ts                   # logAuditEvent, getAuditLogsForEntity
│       ├── design-tokens.ts           # Typography, spacing, badge styles
│       ├── env.ts                     # Env validation
│       ├── compliance/                # urgency, exceptions, auto-create, display, validation, follow-up
│       ├── dashboard/                 # metrics query
│       ├── email/                     # Resend client
│       ├── employees/                 # display, validation
│       ├── export/                    # CSV generator
│       ├── notifications/             # create, queries
│       ├── reminders/                 # templates
│       └── supabase/                  # server, middleware, env
├── vercel.json                # Cron schedule (daily 11am UTC)
└── [planning docs at root]
```

## Auth model

- Supabase Auth stores credentials; `User.supabaseId` links to app user row.
- MVP: **only ADMIN users** can sign in to admin routes.
- Middleware checks session + `User.role === ADMIN`.
- Employee-linked users deferred (no employee login UI).
- Admin creation: `scripts/create-admin.mjs <email> <password>`

## Core domain logic

### Expiration service (`src/lib/compliance/urgency.ts`)

- `computeUrgency()` — returns level (critical/warning/normal/resolved) + daysUntilExpiration
- `effectiveStatus()` — COMPLETE records with past expiration → EXPIRED
- Thresholds: critical ≤7d, warning ≤30d, normal >30d

### Exception Queue (`src/lib/compliance/exceptions.ts`)

- `getExceptionGroups()` — queries all active/onboarding employee records
- Groups: critical, expiringSoon, missing, pending, recentlyResolved
- Resolved = COMPLETE status + RESOLVED followUpStatus

### Follow-Up Tracking

- FollowUpStatus enum: NOT_CONTACTED → CONTACTED → AWAITING_RENEWAL → PENDING_REVIEW → ESCALATED → RESOLVED
- Editable inline on compliance record form
- Follow-up badges shown on employee checklist rows

### Audit (`src/lib/audit.ts`)

- `logAuditEvent()` called from employee CRUD, compliance record updates, reminder sends
- Timeline rendered on employee detail page

### Notifications

- Created by daily cron at 30/14/7/0-day expiration thresholds
- Dedup by `dedupKey` in metadata JSON
- Bell with unread count in admin header; full list at `/admin/notifications`

### Email Reminders

- Resend integration (`src/lib/email/resend.ts`)
- Manual: draft + send from record edit form (with 24h duplicate protection)
- Automated: cron sends at 14d and 7d thresholds
- All sends logged to `ReminderLog` table

## API shape

**Server Actions** for all mutations. Route Handlers for:

- `/api/cron/check-expirations` — daily cron with `CRON_SECRET` auth
- `/api/export` — CSV download (type: all/incomplete/expiring/exceptions)

## Dependencies

| Package | Purpose |
|---------|---------|
| `next` 16.2.6 | App framework (Turbopack) |
| `@prisma/client` 7.8 | ORM |
| `@prisma/adapter-pg` | PostgreSQL driver adapter |
| `pg` | Connection pool |
| `@supabase/ssr` | Server-side auth |
| `@supabase/supabase-js` | Supabase client |
| `resend` | Email delivery |
| `zod` | Form validation |
| `class-variance-authority` | Component variants |
| `lucide-react` | Icons |

## Database

- **DATABASE_URL** — pooler (6543, pgbouncer) for app runtime
- **DIRECT_URL** — session/direct for migrations
- Schema managed via `prisma db push` (dev) / `prisma migrate deploy` (prod)

## Security

- Secrets in `.env.local` only (never commit)
- Service role key server-only
- CSRF via Next.js server actions defaults
- Input validation with Zod on all mutations
- Cron route authenticated via `CRON_SECRET` bearer token
- Export route should be auth-gated in production

## Deployment

- Vercel: production + preview
- Supabase: `careops` project (`us-east-2`)
- Env vars mirrored in Vercel project settings
- Cron: `vercel.json` → daily at 11:00 UTC

## What we are not building

- Event bus, message queue, separate API service, GraphQL layer, or multi-repo split.
