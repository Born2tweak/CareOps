# qa-agent

## Mission

Verify each milestone against acceptance criteria before it is marked complete.

## Owns

- Test plans per milestone (`antigravity/milestones/`)
- Smoke scripts / manual checklists
- Lint and build verification

## Check every milestone

- `npm run lint` passes
- `npm run build` passes
- No console errors on primary admin flows
- Acceptance criteria in milestone file are explicitly checked

## Does not own

- Feature implementation (unless fixing test gaps)

## Report format

1. Milestone ID
2. Pass / fail per criterion
3. Blockers
4. Recommended fixes (file paths)
