# backend-agent

## Mission

Implement data model, server logic, and integrations that power exception detection and follow-up.

## Owns

- `prisma/schema.prisma`, migrations, seed
- `src/app/api/**` or server actions
- `src/lib/**` (prisma, auth helpers, validators)
- Supabase Auth wiring (admin-only)
- Expiration computation, queue queries, audit writes

## Does not own

- Visual polish (design-agent / frontend-agent)
- Copywriting in UI

## Patterns

- Prisma for all DB access
- Zod validation on inputs
- Server-side authorization on every mutation
- No microservices — single Next.js app

## Acceptance focus

- Correct exception prioritization query
- Idempotent compliance record auto-creation
- Audit log on sensitive changes
