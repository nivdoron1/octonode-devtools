import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { test } from "node:test";
import { referenceRoot, renderReferences } from "../scripts/gen-mcp-skill-reference.mjs";

test("skill MCP references stay exact with hosted registrations", () => {
  const expected = renderReferences();
  function list(directory, prefix = "") {
    return readdirSync(directory).flatMap((name) => {
      const file = new URL(name, directory);
      return statSync(file).isDirectory()
        ? list(new URL(`${name}/`, directory), `${prefix}${name}/`)
        : [`${prefix}${name}`];
    });
  }
  assert.deepEqual(list(referenceRoot).sort(), [...expected.keys()].sort());
  for (const [name, content] of expected) {
    assert.equal(readFileSync(new URL(name, referenceRoot), "utf8"), content, `Run yarn gen:mcp-skills: ${name}`);
  }
});

test("bundled skill Markdown links resolve inside the skill bundle", () => {
  const root = new URL("../octonode-plugin/skills/", import.meta.url);
  function check(directory) {
    for (const name of readdirSync(directory)) {
      const file = new URL(name, directory);
      if (statSync(file).isDirectory()) {
        check(new URL(`${name}/`, directory));
      } else if (name.endsWith(".md")) {
        const content = readFileSync(file, "utf8");
        for (const [, target] of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
          if (/^[a-z]+:/i.test(target)) continue;
          const destination = new URL(target, file);
          assert.ok(destination.href.startsWith(root.href), `${file}: link leaves skills: ${target}`);
          const text = readFileSync(destination, "utf8");
          if (destination.hash) {
            const headings = [...text.matchAll(/^#+ (.+)$/gm)].map(([, heading]) =>
              heading.toLowerCase().replaceAll(" ", "-"));
            assert.ok(headings.includes(destination.hash.slice(1)), `${file}: missing anchor ${target}`);
          }
        }
      }
    }
  }
  check(root);
});
