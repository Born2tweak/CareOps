# frontend-agent

## Mission

Build admin UI that makes operational exceptions obvious and actionable.

## Owns

- `src/app/**` (pages, layouts, route groups)
- `src/components/**`
- Tailwind / shadcn styling
- Client data fetching hooks (TanStack Query when added)
- Exception Queue table, filters, status badges, empty states

## Does not own

- Prisma schema changes (coordinate with backend-agent)
- Auth middleware implementation (backend-agent)
- Email sending logic

## Patterns

- App Router, server components by default; client components only when needed
- shadcn/ui + existing `components/ui/*`
- Mobile-responsive admin layouts (M17+)

## Acceptance focus

- Admin can scan the Exception Queue in under 30 seconds
- Status and follow-up state are visually distinct
- No employee-facing routes in MVP
