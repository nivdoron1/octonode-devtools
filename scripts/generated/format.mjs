import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../packages/sdk/src/gen/", import.meta.url));
// The generator emits indented empty lines for new accessors. Normalize its
// output in generation so review checks stay clean without manual source edits.
for (const name of readdirSync(root, { recursive: true })) {
  if (!name.endsWith(".ts")) continue;
  const path = join(root, name);
  const original = readFileSync(path, "utf8");
  const formatted = original.replace(/[\t ]+$/gm, "");
  if (original !== formatted) writeFileSync(path, formatted);
}
