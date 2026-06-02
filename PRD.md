# CareOps — Product Requirements (MVP)

## 1. Overview

| Field | Value |
|-------|--------|
| Product | CareOps |
| Version | MVP 1.0 |
| Audience | Admin / compliance coordinator only |
| Platform | Web (desktop-first, responsive later) |

## 2. Goals

1. Surface **operational exceptions** (missing, expired, expiring, stuck follow-up) in one queue.
2. Track **follow-up coordination state** per exception.
3. Reduce manual scanning of spreadsheets and email.
4. Provide **auditability** for compliance actions.

## 3. Non-goals (MVP)

See `PRODUCT_BRIEF.md` — no EHR, scheduling, payroll, employee portal, family portal, or Therap replacement.

## 4. User stories (admin)

### Exception visibility

- As an admin, I see all items needing attention today sorted by severity so I know where to start.
- As an admin, I filter the queue by status, employee, compliance item, or follow-up state.
- As an admin, I open an exception and see employee + item + dates + notes + follow-up history.

### Compliance maintenance

- As an admin, I maintain the employee list (add, edit, deactivate).
- As an admin, I configure which compliance items apply (defaults seeded).
- As an admin, when I add an employee, required compliance records are created automatically.
- As an admin, I mark items complete with completion and expiration dates.
- As an admin, expired items appear in the queue without manual flagging.

### Follow-up coordination

- As an admin, I update follow-up status (not contacted → contacted → awaiting renewal → resolved).
- As an admin, I add follow-up notes and last-contacted date.

### Reminders (M12–M14)

- As an admin, I draft reminder emails for selected exceptions.
- As an admin, I send reminders via email provider.
- As an admin, I optionally schedule recurring reminder checks (cron).

### Reporting

- As an admin, I view dashboard counts (open exceptions, by category).
- As an admin, I export CSV for leadership or audit prep.
- As an admin, I view audit log of changes.

## 5. Functional requirements

### FR-1 Authentication

- Admin login via Supabase Auth.
- Only `ADMIN` role accesses admin routes.
- Employee role exists in schema but **no employee UI** in MVP.

### FR-2 Employees

- CRUD employees: name, email, phone, hire date, status, position, department.
- Employment statuses: ACTIVE, INACTIVE, ONBOARDING, TERMINATED.

### FR-3 Compliance items

- CRUD compliance item definitions (name, category, expiration rules, required flag).
- Seed default HCBS-relevant items (CPR, TB, license, insurance, BMV, citizenship, HCSP training, background check).

### FR-4 Compliance records

- One record per employee × item.
- Status: COMPLETE, PENDING, MISSING, EXPIRED.
- Fields: completed date, expiration date, notes, follow-up status, follow-up notes, last contacted.

### FR-5 Expiration engine

- On date change or daily job: set EXPIRED when `expirationDate < today`.
- Optional: EXPIRING_SOON notifications (configurable window).

### FR-6 Exception Queue (primary screen)

**Inclusion rules** (default):

- Status IN (`MISSING`, `EXPIRED`, `PENDING`) OR
- Follow-up status NOT IN (`RESOLVED`) with open compliance issue OR
- Expiring within N days (configurable)

**Sort** (default):

1. EXPIRED
2. MISSING
3. PENDING (incomplete)
4. Follow-up ESCALATED
5. Expiring soon
6. By expiration date ascending

### FR-7 Dashboard metrics

- Count open exceptions
- Count by status bucket
- Count by follow-up state (optional)

### FR-8 Reminders

- Generate email body from template + record context.
- Send via Resend (or configured provider).
- Log send in notifications table.

### FR-9 Audit

- Log create/update/delete on employees, records, items, follow-up changes.
- Store actor user id, entity, action, timestamp, JSON details.

### FR-10 Export

- CSV export of current queue or full compliance matrix.

## 6. Non-functional requirements

| NFR | Target |
|-----|--------|
| Performance | Queue loads < 2s for 500 employees |
| Security | RLS / server-side auth on all mutations |
| Availability | Vercel + Supabase SLA |
| Data | Postgres via Supabase; backups per Supabase plan |
| Accessibility | WCAG 2.1 AA on admin shell (M17 polish) |

## 7. Data entities

Aligned with `prisma/schema.prisma`: User, Employee, ComplianceItem, ComplianceRecord, Notification, AuditLog.

## 8. Milestone mapping

See `MILESTONE_ROADMAP.md` and `antigravity/milestones/`.

## 9. Open questions (post-MVP)

- Multi-tenant / multi-location?
- Custom compliance item sets per program?
- Read-only auditor role?
