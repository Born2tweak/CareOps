# M16 — CSV Export

## Objective

Export queue or full compliance matrix for leadership / audit prep (FR-10).

## Scope

- Export current queue filter as CSV
- Optional: full employee×item matrix export
- UTF-8, header row, stable column order
- Download via authenticated admin route

## Out of scope

- Excel formatting, PDF
- Scheduled exports

## Acceptance criteria

- [ ] CSV opens correctly in Excel/Sheets
- [ ] Row count matches UI filter
- [ ] PII only accessible to admin

## Tests

- Export 10 rows → file has 10 data rows + header
- Special characters in names escaped properly

## Stop condition

Pilot agency can share weekly snapshot without copy-paste.
