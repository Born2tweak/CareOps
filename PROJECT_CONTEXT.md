# CareOps — Project Context

## Product Focus

**Current**: Admin-only exception management.

The core product is an **Exception Queue** — it answers: "What needs attention right now?"

This is NOT a spreadsheet clone. It is an operational coordination system that provides:
- Proactive visibility
- Automated follow-up
- Exception prioritization
- Reduced repetitive human coordination

## Deferred Features

Do NOT build these until admin exception management is fully working:
- Employee portal / self-service
- Document uploads
- Family portal
- Scheduling
- Mobile apps
- AI summaries
- Therap integration

## Implementation Rule

**One milestone at a time.** See `MILESTONE_ROADMAP.md` for the full sequential plan.

## Active Milestone

**Milestone 0 — Project Setup**

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ (App Router), TypeScript |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | Supabase Auth |
| UI | Tailwind CSS + shadcn/ui |
| Data Fetching | TanStack Query |
| Email | Resend |
| Deployment | Vercel |
