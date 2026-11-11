// Generated from packages/schema/src/diagnostics/runtime.ts. Do not edit; run the Octonode SDK sync.
import { DIAGNOSTIC_MAX_CAUSES } from "./constants";
import type { RuntimeErrorIdentity } from "./schema";

/** Read data properties only: a thrown object's getters are still untrusted code. */
function field(value: object, key: string): unknown {
  let current: object | null = value;
  for (let depth = 0; current && depth < DIAGNOSTIC_MAX_CAUSES; depth++) {
    const descriptor = Object.getOwnPropertyDescriptor(current, key);
    if (descriptor) return "value" in descriptor ? descriptor.value : undefined;
    current = Object.getPrototypeOf(current);
  }
}

export function runtimeErrorIdentity(error: unknown): RuntimeErrorIdentity {
  const result: RuntimeErrorIdentity = {};
  const seen = new Set<object>();
  let current = error;
  try {
    while (current && typeof current === "object" && !seen.has(current) && seen.size < DIAGNOSTIC_MAX_CAUSES) {
      seen.add(current);
      const name = field(current, "name"),
        code = field(current, "code");
      const identity = {
        ...(typeof name === "string" ? { name: name.slice(0, 200) } : {}),
        ...(typeof code === "string" ? { code: code.slice(0, 200) } : {}),
      };
      if (seen.size === 1) {
        result.name = identity.name;
        result.systemCode = identity.code;
      } else if (identity.name || identity.code) (result.causes ??= []).push(identity);
      current = field(current, "cause");
    }
  } catch {
    // Metadata collection must never replace the original failure, including a throwing Proxy.
  }
  return result;
}
