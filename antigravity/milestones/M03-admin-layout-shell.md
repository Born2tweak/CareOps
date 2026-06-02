# M3 — Admin Layout Shell

## Objective

Consistent admin chrome and navigation for all feature routes.

## Scope

- `/admin` layout: sidebar or top nav
- Links: Queue (placeholder), Employees, Items, Dashboard, Settings (as needed)
- Active route styling, page title region
- shadcn/ui primitives aligned with design tokens

## Out of scope

- Real queue data (M9)
- Dashboard metrics (M11)

## Acceptance criteria

- [x] All admin routes share one layout
- [x] Navigation reflects MVP sections from PRD
- [x] Responsive enough for desktop coordinator workflow
- [x] Placeholder pages load without errors

## Implementation notes (2026-05-22)

- `AdminShell` + `AdminNav` (sidebar, mobile drawer, active route via `usePathname`)
- Nav config: Dashboard (live), Queue / Employees / Compliance Items (placeholder pages)
- Sign out in sidebar footer; `requireAdmin()` unchanged in `(admin)/layout.tsx`
- Routes: `/admin`, `/admin/queue`, `/admin/employees`, `/admin/compliance-items`

## Tests

- Manual: navigate all nav items
- `npm run build` still passes

## Stop condition

Shell ready for CRUD milestones M4–M8.

**Status:** Complete
