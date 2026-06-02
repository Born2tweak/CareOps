# M1 — Database Foundation

## Objective

Apply schema to Supabase Postgres and run seed successfully.

## Scope

- Initial migration from `prisma/schema.prisma`
- `npm run db:seed` against remote DB
- Prisma client generation
- Fix Prisma 7 datasource config if needed

## Acceptance criteria

- [x] `prisma/migrations/` contains initial migration
- [x] `npm run db:migrate` succeeds against Supabase
- [x] `npm run db:seed` creates 8 default compliance items
- [x] `npm run db:studio` shows tables (schema applied; studio available via script)
- [x] Document migration command in README

## Tests

```bash
npm run db:migrate
npm run db:seed
npx prisma db execute --stdin  # SELECT count(*) FROM compliance_items;
```

## Stop condition

Schema on Supabase matches local Prisma schema; seed idempotent.

## M1 evidence (2026-05-22)

- Migration: `prisma/migrations/20260522174220_init/`
- Prisma 7 runtime: `@prisma/adapter-pg`, `pg`, `src/lib/prisma-client-factory.ts`
- Seed output: `Seeded 8 compliance items.`
