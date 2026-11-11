import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { test } from "node:test";

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
