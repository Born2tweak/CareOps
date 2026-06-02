/**
 * Escape a CSV field value: wrap in quotes if it contains commas, quotes, or newlines.
 */
function escapeField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Convert an array of objects to a CSV string.
 */
export function toCsv(
  headers: string[],
  rows: string[][],
): string {
  const headerLine = headers.map(escapeField).join(",");
  const dataLines = rows.map((row) =>
    row.map((cell) => escapeField(cell ?? "")).join(","),
  );
  return [headerLine, ...dataLines].join("\n");
}
