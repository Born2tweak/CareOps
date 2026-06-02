# M4 — Employee CRUD

## Objective

Maintain the employee roster that compliance records attach to.

## Scope

- List employees (filter by status optional)
- Create / edit: name, email, phone, hire date, status, position, department
- Deactivate (status → INACTIVE/TERMINATED) without hard delete
- Server actions with `requireAdmin()` + Zod validation
- Design system foundation (tokens, badges, table shell) for M4+

## Out of scope

- Auto-create compliance records (M6)
- Employee self-service
- Exception Queue (M9)

## Implementation notes

| Area | Path |
|------|------|
| List | `src/app/(admin)/admin/employees/page.tsx` |
| Create | `src/app/(admin)/admin/employees/new/page.tsx` |
| Edit | `src/app/(admin)/admin/employees/[id]/page.tsx` |
| Actions | `src/app/(admin)/admin/employees/actions.ts` |
| Validation | `src/lib/employees/validation.ts` |
| Display helpers | `src/lib/employees/display.ts` |
| UI | `src/components/admin/employees/*`, `src/components/ui/*` |
| Tokens | `src/lib/design-tokens.ts`, `src/app/globals.css` |

## Acceptance criteria

- [x] CRUD matches `Employee` model fields
- [x] Email uniqueness enforced
- [x] Only admins can mutate
- [x] List shows ACTIVE by default

## Tests

- [x] Create employee → appears in list (manual)
- [x] Edit status → persisted (manual)
- [x] Invalid email → validation error (manual)

## QA checklist (M4)

- [x] `npm run lint` passes
- [x] `npm run build` passes
- [x] Nav: Employees no longer marked placeholder
- [x] Table scannable: name, email, status badge, department, hire date
- [x] Status filter tabs: Active (default), All, Onboarding, Inactive, Terminated
- [x] Deactivate panel on edit; no hard delete
- [x] No compliance records created on employee create

## Stop condition

Employee master data stable before compliance items/records. **Met — proceed to M5.**
