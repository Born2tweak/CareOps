# CareOps — Antigravity PM Workspace

This folder is the **project management and orchestration hub** for CareOps. The application code lives at the repository root (`src/`, `prisma/`, etc.).

## Planning documents (canonical)

| Document | Path |
|----------|------|
| Product Brief | [`../PRODUCT_BRIEF.md`](../PRODUCT_BRIEF.md) |
| PRD | [`../PRD.md`](../PRD.md) |
| Architecture | [`../ARCHITECTURE.md`](../ARCHITECTURE.md) |
| AI Rules | [`../AI_RULES.md`](../AI_RULES.md) |
| Milestone Roadmap | [`../MILESTONE_ROADMAP.md`](../MILESTONE_ROADMAP.md) |
| Live Context | [`../PROJECT_CONTEXT.md`](../PROJECT_CONTEXT.md) |

## Milestone specs

Detailed acceptance criteria per milestone: [`milestones/`](milestones/)

## Agent roles

Specialized sub-agent briefs: [`agents/`](agents/)

| Agent | Scope |
|-------|--------|
| frontend-agent | UI, layouts, Exception Queue tables, shadcn |
| backend-agent | Prisma, APIs, auth, business rules |
| qa-agent | Smoke tests, acceptance validation |
| design-agent | Operational clarity, dashboard hierarchy |
| context-agent | `PROJECT_CONTEXT.md` maintenance |
| docs-agent | Planning doc alignment |

## Orchestration (existing)

- `.autoclaw/orchestrator/` — multi-agent comms (registry, heartbeats)
- `.agent/rules/orchestrate.md` — sprint planning protocol

## Execution rules

1. **One milestone at a time** — see roadmap checklist.
2. **Do not start implementation** until M0 documentation audit is complete (this folder).
3. **Update `PROJECT_CONTEXT.md`** after every milestone (keep under 8k characters).
4. **Stop after milestone completion** unless explicitly told to continue.

## Product north star

**Exception Queue** — answers: *What needs attention today?*

Admin-first HCBS/waiver operational exception management. Not an EHR, scheduler, payroll system, or Therap replacement.
