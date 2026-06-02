# M2 — Admin Auth

## Objective

Admin-only access via Supabase Auth; no employee-facing UI.

## Scope

- Supabase Auth (email/password or magic link per project choice)
- `User` sync / role check (`ADMIN` only for `/admin/*`)
- Middleware or layout guard on admin routes
- Sign-in, sign-out, session refresh

## Out of scope

- Employee login UI
- RLS policies (optional polish in M18)

## Acceptance criteria

- [x] Unauthenticated users cannot access admin routes
- [x] Non-`ADMIN` users are rejected
- [x] Admin can sign in and reach admin shell (stub OK until M3)
- [x] Session persists across refresh

## Tests

- Manual: anonymous → redirect/login
- Manual: admin user → access granted

## Stop condition

Auth gate works before building feature pages in M4+.

## Implementation notes (2026-05-22)

- Email/password via `signInWithPassword`
- `src/middleware.ts` + `src/lib/supabase/middleware.ts` for session refresh and login redirect
- `requireAdmin()` in `(admin)/layout.tsx` for `User.role === ADMIN`
- First admin: Supabase Auth user + `npm run db:seed-admin` (`ADMIN_EMAIL`, `ADMIN_SUPABASE_ID`)
