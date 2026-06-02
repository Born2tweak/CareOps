# CareOps

Admin-first HCBS compliance **exception management** — one queue for what needs attention today.

## Features

- **Exception Queue** — what needs attention now, grouped by urgency (critical → expiring → missing → pending → resolved)
- **Dashboard** — compliance rate, expired count, expiring soon, onboarding status at a glance
- **Employee Management** — roster with status filtering, compliance checklist per employee
- **Compliance Items** — configurable items with categories, expiration rules, required flag
- **Follow-Up Tracking** — track contact status from NOT_CONTACTED through ESCALATED to RESOLVED
- **Email Reminders** — draft and send via Resend, with duplicate protection; copy-to-clipboard for SMS
- **Automated Alerts** — daily cron detects expirations and creates notifications at 30/14/7/0-day thresholds
- **Audit Log** — tracks all admin actions with timeline view on employee pages
- **CSV Export** — export all records, incomplete only, expiring, or exceptions
- **Mobile Responsive** — works on desktop and mobile with touch-friendly targets

## Prerequisites

- Node.js 20.19+ (22.x recommended)
- npm 10+
- Supabase project with Postgres

## Setup

1. **Clone and install**

   ```bash
   git clone <repo-url> careops
   cd careops
   npm install
   ```

2. **Environment**

   Create `.env.local` at the repo root (never commit this file):

   ```env
   DATABASE_URL=postgresql://...          # Supabase pooled connection
   DIRECT_URL=postgresql://...            # Supabase direct connection (migrations)
   NEXT_PUBLIC_SUPABASE_URL=https://...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...          # Server-only
   RESEND_API_KEY=re_...                  # For email reminders
   RESEND_FROM_ADDRESS=CareOps <noreply@yourdomain.com>  # Optional
   CRON_SECRET=...                        # Protects cron endpoint in production
   ```

3. **Database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Create admin user**

   ```bash
   node scripts/create-admin.mjs your@email.com YourPassword
   ```

   This creates a Supabase Auth user and links it as ADMIN in the database.

5. **Development**

   ```bash
   npm run dev
   ```

   - Landing: [http://localhost:3000](http://localhost:3000)
   - Login: [http://localhost:3000/login](http://localhost:3000/login)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

   > If port 3000 is busy: `npx next dev --port 3001`
   > If OOM on Windows: `NODE_OPTIONS="--max-old-space-size=4096" npx next dev --port 3001`

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx prisma generate` | Regenerate Prisma Client |
| `npx prisma db push` | Push schema to database |
| `npx prisma studio` | Prisma Studio (database browser) |

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma 7 with `@prisma/adapter-pg`
- **Auth**: Supabase Auth (`@supabase/ssr`)
- **Email**: Resend
- **Validation**: Zod

## Planning docs

| Document | Path |
|----------|------|
| Product brief | `PRODUCT_BRIEF.md` |
| PRD | `PRD.md` |
| Architecture | `ARCHITECTURE.md` |
| AI rules | `AI_RULES.md` |
| Live context | `PROJECT_CONTEXT.md` |
| Milestone roadmap | `MILESTONE_ROADMAP.md` |
| Milestone specs | `antigravity/milestones/` |

## Milestones

M0–M18 complete. M19 (Pilot Deployment) pending. See `MILESTONE_ROADMAP.md`.
