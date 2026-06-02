# CareOps — Product Brief

## One sentence

CareOps is an **admin-first operational exception management system** for HCBS and waiver providers that answers *what needs attention today* — without replacing spreadsheets, EHRs, or scheduling tools.

## Problem

Compliance coordinators and office admins track certifications, expirations, and missing documents across spreadsheets, email threads, sticky notes, and memory. The work is not storing data — it is **repeatedly discovering, prioritizing, and chasing** exceptions across employees.

## Solution

A single **Exception Queue** backed by compliance records with:

- Expiration and missing-item detection
- Follow-up state tracking
- Reminder drafting and sending (later milestones)
- Audit trail for accountability

## Primary user (MVP)

**Office admin / compliance coordinator** — not direct support staff, not employees, not families.

## Core philosophy

> The software does not replace spreadsheets by storing data better.  
> It reduces the **human coordination labor** around the data.

## MVP delivers

| Capability | Outcome |
|------------|---------|
| Employee registry | Who we track compliance for |
| Compliance item templates | What must be tracked (CPR, TB, license, etc.) |
| Per-employee records | Status per requirement |
| Expiration logic | Auto-flag EXPIRED / expiring soon |
| Exception Queue | Prioritized “needs attention” list |
| Follow-up tracking | Contacted, awaiting renewal, escalated, resolved |
| Admin metrics | Counts by severity |
| Reminders | Draft → send → optional schedule |
| Audit + export | Accountability and reporting |

## Explicitly NOT in MVP

- Full EHR / clinical documentation
- Scheduling or shift management
- Payroll
- Therap replacement or deep integration
- Employee self-service portal
- Employee document uploads
- Family portal
- In-app messaging
- Mobile-native apps (responsive web only in M17)
- AI-generated summaries

## Success metrics (pilot)

- Admin opens app → sees actionable queue in one screen
- Time to identify top 10 exceptions < 2 minutes
- Follow-up state reduces duplicate outreach
- Coordinators report less “what am I forgetting?” anxiety

## Deployment context

Ohio-region HCBS/waiver provider; admin users in office; Supabase + Vercel stack.
