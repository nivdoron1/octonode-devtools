import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmodSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { PACKAGE, TARGETS, UPGRADE_CODE } from "./constants.mjs";
import { readSource } from "./source.mjs";

const [source, output, ...extra] = process.argv.slice(2);
if (!source || !output || extra.length) throw new Error("usage: node scripts/distribution/bundle.mjs <source-directory> <new-directory>");
if (Number(process.versions.node.split(".")[0]) !== 24) throw new Error("Package with Node 24");
const target = `${process.platform}-${process.arch}`;
if (!TARGETS.includes(target)) throw new Error(`Unsupported target: ${target}`);
const metadata = readSource(source);
const directory = resolve(output);
mkdirSync(directory, { recursive: false });
const stage = resolve(directory, "stage");
mkdirSync(stage);
const npm = [
  resolve(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js"),
  resolve(dirname(process.execPath), "../lib/node_modules/npm/bin/npm-cli.js"),
].find(existsSync);
if (!npm) throw new Error("Use the official Node 24 distribution with npm");
const run = (command, args, options = {}) => execFileSync(command, args, { stdio: "inherit", ...options });
writeFileSync(resolve(stage, "package.json"), JSON.stringify({ private: true, name: "octonodes-distribution", version: metadata.version }));
run(process.execPath, [npm, "install", "--prefix", stage, "--omit=dev", "--no-audit", "--no-fund", resolve(source, "cli.tgz")]);
const installed = JSON.parse(readFileSync(resolve(stage, "node_modules/@octonodes/cli/package.json")));
if (installed.name !== PACKAGE || installed.version !== metadata.version) throw new Error("Installed package does not match release");
rmSync(resolve(stage, "node_modules/.bin"), { recursive: true, force: true });
mkdirSync(resolve(stage, "runtime"));
mkdirSync(resolve(stage, "bin"));
const runtime = resolve(stage, "runtime", process.platform === "win32" ? "node.exe" : "node");
cpSync(process.execPath, runtime);
const license = await fetch(`https://raw.githubusercontent.com/nodejs/node/${process.version}/LICENSE`, { redirect: "error", signal: AbortSignal.timeout(120_000) });
if (!license.ok) throw new Error("Unable to include the Node runtime license");
writeFileSync(resolve(stage, "runtime/LICENSE"), await license.text());
cpSync(resolve(import.meta.dirname, "../../LICENSE"), resolve(stage, "LICENSE"));
if (process.platform === "win32") {
  writeFileSync(resolve(stage, "bin/octonodes.cmd"), '@echo off\r\n"%~dp0..\\runtime\\node.exe" "%~dp0..\\node_modules\\@octonodes\\cli\\dist\\index.js" %*\r\n');
} else {
  writeFileSync(resolve(stage, "bin/octonodes"), '#!/bin/sh\nset -eu\nscript=$0\nwhile [ -L "$script" ]; do\n  directory=$(CDPATH= cd -- "$(dirname -- "$script")" && pwd)\n  script=$(readlink "$script")\n  case "$script" in /*) ;; *) script=$directory/$script ;; esac\ndone\nroot=$(CDPATH= cd -- "$(dirname -- "$script")/.." && pwd)\nexec "$root/runtime/node" "$root/node_modules/@octonodes/cli/dist/index.js" "$@"\n');
  chmodSync(resolve(stage, "bin/octonodes"), 0o755);
  chmodSync(runtime, 0o755);
}
const entry = resolve(stage, "node_modules/@octonodes/cli/dist/index.js");
const version = execFileSync(runtime, [entry, "--version"], { encoding: "utf8" }).trim();
if (version !== metadata.version) throw new Error("Bundled CLI version check failed");
run(runtime, [entry, "--help"]);
// Exercise the architecture-specific esbuild dependency, not just JS startup.
run(runtime, ["-e", 'require("esbuild").transformSync("const x: number = 1", {loader:"ts"})'], { cwd: stage });
const stem = `octonodes-${metadata.version}-${target}`;
const archive = stem + (process.platform === "win32" ? ".zip" : ".tar.gz");
if (process.platform === "win32") {
  run("tar.exe", ["-a", "-cf", resolve(directory, archive), "-C", stage, "."]);
  const template = readFileSync(resolve(import.meta.dirname, "../../packaging/windows/package.wxs"), "utf8");
  const wix = template.replaceAll("@VERSION@", metadata.version).replaceAll("@UPGRADE_CODE@", UPGRADE_CODE);
  writeFileSync(resolve(directory, "package.wxs"), wix);
  run("wix", ["build", resolve(directory, "package.wxs"), "-arch", "x64", "-b", `Payload=${stage}`, "-o", resolve(directory, stem + ".msi")]);
} else {
  run("tar", ["-czf", resolve(directory, archive), "-C", stage, "."]);
}
const filenames = [archive, ...(process.platform === "win32" ? [stem + ".msi"] : [])];
const assets = filenames.map((file) => ({ file, sha256: createHash("sha256").update(readFileSync(resolve(directory, file))).digest("hex") }));
writeFileSync(resolve(directory, "bundle.json"), JSON.stringify({ version, target, nodeVersion: process.version, npmSha256: metadata.sha256, assets }, null, 2) + "\n");
process.stdout.write(`Prepared ${target} installation artifacts in ${directory}\n`);
