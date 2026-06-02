# CareOps — AI Rules (all agents)

## Role

You are building **CareOps MVP**: admin-first HCBS exception management. The primary screen is the **Exception Queue** (*What needs attention today?*).

## Hard constraints

### Do

- Execute **one milestone at a time** per `MILESTONE_ROADMAP.md`
- Read `PROJECT_CONTEXT.md` before starting work
- Read the active milestone file in `antigravity/milestones/`
- Use the correct sub-agent mindset (`antigravity/agents/`)
- Run `npm run lint` and `npm run build` before marking a milestone done
- Update `PROJECT_CONTEXT.md` after each milestone (context-agent rules)
- Keep changes scoped to the milestone

### Do not

- One-shot the entire application
- Jump ahead to later milestones
- Build employee portal, uploads, family portal, messaging, or scheduling
- Add microservices, event buses, or heavy abstractions
- Add npm packages without milestone justification
- Touch unrelated files
- Commit secrets or paste tokens in chat
- Mark milestones complete without acceptance criteria evidence

## Product truth

| In scope | Out of scope (MVP) |
|----------|-------------------|
| Exception Queue | Full EHR |
| Compliance + expiration | Scheduling |
| Follow-up coordination | Payroll |
| Admin reminders | Therap replacement |
| Audit + CSV export | Employee self-service |

**Philosophy:** Reduce coordination labor, not replicate Excel.

## Code standards

- TypeScript strict; no `any` without comment
- Match existing Next.js App Router patterns
- Prisma for all DB access
- shadcn/ui for components
- Server actions + Zod validation for mutations
- Small files; clear names; minimal comments

## Sub-agent routing

| Task type | Agent |
|-----------|--------|
| Pages, tables, UI | frontend-agent |
| Schema, API, auth, rules | backend-agent |
| Acceptance, lint, build | qa-agent |
| Hierarchy, status colors | design-agent |
| PROJECT_CONTEXT updates | context-agent |
| PRD/roadmap alignment | docs-agent |

## Token efficiency

- Read only files in milestone scope
- Prefer `grep` / targeted reads over full-repo loads
- Summarize in `PROJECT_CONTEXT.md`; do not duplicate long prose
- Keep `PROJECT_CONTEXT.md` under 8k characters

## Orchestration

- PM workspace: `antigravity/`
- Multi-agent comms: `.autoclaw/orchestrator/`
- Stop after milestone completion unless user says continue

## When blocked

1. State blocker in `PROJECT_CONTEXT.md`
2. Do not improvise scope changes
3. Ask user only for true external dependencies (credentials, business rules)

## Milestone completion checklist

- [ ] All acceptance criteria in milestone file met
- [ ] lint + build pass
- [ ] `PROJECT_CONTEXT.md` updated
- [ ] Roadmap checkbox updated in `MILESTONE_ROADMAP.md`
- [ ] No scope creep into deferred features
