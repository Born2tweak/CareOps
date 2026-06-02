# M0 — Project Setup

## Objective

Establish a runnable monorepo scaffold, Supabase connectivity, PM documentation, and quality gates — without feature UI.

## Scope

- Next.js App Router + TypeScript + Tailwind + shadcn base
- Prisma schema (domain models)
- `.env.local` with Supabase project `careops`
- Planning docs + `antigravity/` PM workspace
- ESLint + Prettier scripts

## Out of scope

- Admin routes, auth, Exception Queue
- Prisma migrations applied to remote DB (M1)
- Supabase client packages (M2)

## Acceptance criteria

- [x] Next.js app runs (`npm run dev`)
- [x] Prisma schema matches PRD entities
- [x] Seed file defines default compliance items
- [x] Supabase project created (`ivqveyxqnucfdmxookdg`, us-east-2)
- [x] `.env.local` with DATABASE_URL, DIRECT_URL, Supabase keys
- [x] `PRODUCT_BRIEF.md`, `PRD.md`, `ARCHITECTURE.md`, `AI_RULES.md` exist
- [x] `antigravity/` workspace with agents + milestone specs
- [x] `PROJECT_CONTEXT.md` current
- [x] `npm run lint` passes
- [x] `npm run build` passes
- [x] Prisma 7 config resolved (`prisma.config.ts`; M1 may add adapter if needed)
- [x] `README.md` with setup instructions

## Test checklist

```bash
npm run lint
npm run build
npm run dev   # landing page loads
```

## Stop condition

Do not start M1 until all unchecked criteria above are checked or explicitly deferred with a note in `PROJECT_CONTEXT.md`.

## Notes (2026-05-22)

- Added `prisma.config.ts` (Prisma 7); datasource URLs moved out of `schema.prisma`.
- Milestone detail specs live in `antigravity/milestones/` (replaces `.claude/plans/compressed-foraging-thunder.md`).
- M0 complete — proceed to M1 per `PROJECT_CONTEXT.md`.
