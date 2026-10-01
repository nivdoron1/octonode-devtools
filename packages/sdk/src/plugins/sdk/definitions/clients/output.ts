// Generated from packages/plugin/src/clients/output.ts. Do not edit; run the Octonode SDK sync.
import ts from "typescript";

/** Shared portable helper for both editable TypeScript wrappers and standalone adapters. */
export function clientOutputSource(language: "typescript" | "javascript") {
  const source = `type __Collected<T> = T extends AsyncIterable<infer Item> ? Item[] : T extends object ? { [Key in keyof T]: __Collected<T[Key]> } : T;
async function __collectClientOutput<T>(value: T, paths: string[][]): Promise<__Collected<T>> {
  let result: unknown = value;
  for (const path of paths) {
    let owner: Record<string, unknown> | undefined;
    let stream: unknown = result;
    if (path.length) {
      if (typeof result !== "object" || result === null) throw new Error("Missing SDK stream");
      result = { ...result };
      owner = result as Record<string, unknown>;
      for (const key of path.slice(0, -1)) {
        const child = owner[key];
        if (typeof child !== "object" || child === null) throw new Error("Missing SDK stream");
        owner[key] = { ...child };
        owner = owner[key] as Record<string, unknown>;
      }
      stream = owner[path[path.length - 1]];
    }
    if (stream === undefined || stream === null) continue;
    if (typeof (stream as AsyncIterable<unknown>)[Symbol.asyncIterator] !== "function") throw new Error("Invalid SDK stream");
    const items: unknown[] = [];
    for await (const item of stream as AsyncIterable<unknown>) {
      // ponytail: bounded collection, use incremental execution if streams exceed 10,000 events.
      if (items.length >= 10_000) throw new Error("SDK stream exceeds the node output limit");
      items.push(item);
    }
    if (owner) owner[path[path.length - 1]] = items;
    else result = items;
  }
  return result as __Collected<T>;
}
`;
  return language === "typescript"
    ? source
    : ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ESNext } }).outputText;
}
