// Generated from packages/schema/src/diagnostics/location.ts. Do not edit; run the Octonode SDK sync.
/** Columns and offsets use editor/TypeScript UTF-16 units, including CRLF and Unicode line separators. */
export function diagnosticOffset(source: string, line: number, column: number): number | undefined {
  if (!Number.isInteger(line) || !Number.isInteger(column) || line < 1 || column < 1) return;
  let current = 1,
    start = 0;
  for (const match of source.matchAll(/\r\n|[\n\r\u2028\u2029]/g)) {
    if (current === line) break;
    start = match.index! + match[0].length;
    current++;
  }
  if (current !== line) return;
  const next = source.slice(start).search(/[\n\r\u2028\u2029]/);
  const length = next === -1 ? source.length - start : next;
  return column <= length + 1 ? start + column - 1 : undefined;
}
