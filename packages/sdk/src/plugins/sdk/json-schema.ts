// Generated from sdks/typescript/src/json-schema.ts. Do not edit; run the Octonode SDK sync.
/**
 * A deliberately tiny JSON Schema validator covering the common subset Octonode
 * nodes use to describe their I/O: `type`, `required`, `properties`, `items`,
 * and `enum`. It is intentionally NOT a full JSON Schema implementation — the
 * point is that every language SDK can carry an equivalent ~80-line validator
 * with zero dependencies, so the contract is enforced identically everywhere.
 *
 * Unknown/unsupported keywords are ignored (treated as "no constraint"), so a
 * richer schema still validates its supported parts rather than failing hard.
 */
export type JsonSchema = Record<string, unknown>;

export interface ValidationError {
  path: string;
  message: string;
}

export function validate(schema: JsonSchema | undefined, data: unknown): ValidationError[] {
  if (!schema) return [];
  const errors: ValidationError[] = [];
  walk(schema, data, "$", errors);
  return errors;
}

function walk(schema: JsonSchema, data: unknown, path: string, errors: ValidationError[]): void {
  const allowed = normalizeTypes(schema.type);
  if (allowed.length > 0 && !allowed.some((t) => matchesType(t, data))) {
    errors.push({ path, message: `expected type ${allowed.join("|")}, got ${jsonType(data)}` });
    return; // type is wrong; nested checks would be noise
  }

  if (Array.isArray(schema.enum) && !schema.enum.some((v) => deepEqual(v, data))) {
    errors.push({ path, message: `value is not one of the allowed enum values` });
  }

  if (isPlainObject(data)) {
    const required = Array.isArray(schema.required) ? (schema.required as string[]) : [];
    for (const key of required) {
      if (!(key in data)) errors.push({ path: `${path}.${key}`, message: `missing required property` });
    }
    const props = isPlainObject(schema.properties) ? schema.properties : undefined;
    if (props) {
      for (const [key, sub] of Object.entries(props)) {
        if (key in data && isPlainObject(sub)) {
          walk(sub as JsonSchema, (data as Record<string, unknown>)[key], `${path}.${key}`, errors);
        }
      }
    }
  }

  if (Array.isArray(data) && isPlainObject(schema.items)) {
    data.forEach((item, i) => walk(schema.items as JsonSchema, item, `${path}[${i}]`, errors));
  }
}

function normalizeTypes(type: unknown): string[] {
  if (typeof type === "string") return [type];
  if (Array.isArray(type)) return type.filter((t): t is string => typeof t === "string");
  return [];
}

function matchesType(type: string, data: unknown): boolean {
  switch (type) {
    case "object":
      return isPlainObject(data);
    case "array":
      return Array.isArray(data);
    case "string":
      return typeof data === "string";
    case "number":
      return typeof data === "number" && Number.isFinite(data);
    case "integer":
      return typeof data === "number" && Number.isInteger(data);
    case "boolean":
      return typeof data === "boolean";
    case "null":
      return data === null;
    default:
      return true; // unknown declared type → don't constrain
  }
}

function jsonType(data: unknown): string {
  if (data === null) return "null";
  if (Array.isArray(data)) return "array";
  return typeof data;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
