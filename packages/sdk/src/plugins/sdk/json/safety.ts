// Generated from packages/common/src/json/safety.ts. Do not edit; run the Octonode SDK sync.
export function jsonSafetyError(value: unknown, path = "$", ancestors = new Set<object>()): string | undefined {
  if (value === null || typeof value === "string" || typeof value === "boolean") return undefined;
  if (typeof value === "number") return Number.isFinite(value) ? undefined : `${path} is not a finite number`;
  if (typeof value !== "object") return `${path} has type ${typeof value}`;
  if (ancestors.has(value)) return `${path} is cyclic`;
  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index++) {
        if (!(index in value)) return `${path}[${index}] is an array hole`;
        const error = jsonSafetyError(value[index], `${path}[${index}]`, ancestors);
        if (error) return error;
      }
      return undefined;
    }
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return `${path} is not a plain object`;
    if (Object.getOwnPropertySymbols(value).length) return `${path} has symbol keys`;
    for (const [key, item] of Object.entries(value)) {
      const error = jsonSafetyError(item, `${path}.${key}`, ancestors);
      if (error) return error;
    }
    return undefined;
  } finally {
    ancestors.delete(value);
  }
}
