import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { test } from "node:test";

test("colors are automatic in terminals and absent from redirected output", () => {
  const terminal = resolve("packages/cli/dist/terminal.js");
  const result = spawnSync(process.execPath, ["-e", `
    const { writeSync } = require("node:fs");
    const { terminal } = require(${JSON.stringify(terminal)});
    const output = [];
    process.stdout.isTTY = process.stderr.isTTY = true;
    process.stdout.write = process.stderr.write = (chunk) => { output.push(chunk); return true; };
    terminal.brand();
    terminal.rebuilt();
    process.stdout.isTTY = process.stderr.isTTY = false;
    terminal.brand();
    terminal.rebuilt();
    writeSync(1, JSON.stringify(output));
  `], { encoding: "utf8", env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" } });
  assert.equal(result.status, 0, result.stderr);
  const [coloredBrand, coloredRebuilt, plainRebuilt] = JSON.parse(result.stdout);
  assert.match(coloredBrand, /\x1b\[/);
  assert.match(coloredRebuilt, /\x1b\[/);
  assert.equal(plainRebuilt, "App rebuilt\n");
});
