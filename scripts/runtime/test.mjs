import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";

// Hosted MCP documentation generation imports TypeScript directly and belongs to
// the Node 24 contributor gate. Everything else also runs on each consumer Node.
const files = readdirSync("tests")
  .filter((file) => file.endsWith(".test.mjs") && file !== "skill-references.test.mjs")
  .sort()
  .map((file) => `tests/${file}`);
execFileSync(process.execPath, ["--test", "--test-reporter=spec", ...files], {
  stdio: "inherit", timeout: 180_000,
});
