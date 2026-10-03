import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { assetNames, TARGETS } from "../scripts/distribution/constants.mjs";
import { formula, generateManifests, validateBaseUrl } from "../scripts/distribution/manifests.mjs";
import { prepareSource, validateVersion, verifySource } from "../scripts/distribution/source.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "octonodes-distribution-"));
  const source = join(root, "source");
  mkdirSync(source);
  const data = Buffer.from("verified npm fixture");
  const metadata = { name: "@octonodes/cli", version: "1.2.3",
    url: "https://registry.npmjs.org/@octonodes/cli/-/cli-1.2.3.tgz",
    integrity: "sha512-" + createHash("sha512").update(data).digest("base64") };
  const verified = verifySource(metadata, data);
  writeFileSync(join(source, "cli.tgz"), data);
  writeFileSync(join(source, "source.json"), JSON.stringify(verified));
  const bundles = TARGETS.map((target) => {
    const directory = join(root, target);
    mkdirSync(directory);
    const files = assetNames("1.2.3", target);
    const assets = files.map((file) => {
      const contents = Buffer.from(file);
      writeFileSync(join(directory, file), contents);
      return { file, sha256: createHash("sha256").update(contents).digest("hex") };
    });
    writeFileSync(join(directory, "bundle.json"), JSON.stringify({ version: "1.2.3", target,
      nodeVersion: "v24.13.0", npmSha256: verified.sha256, assets }));
    return directory;
  });
  return { root, source, bundles, metadata, data, output: join(root, "review") };
}

function usingFixture(callback) {
  const f = fixture();
  try { callback(f); } finally { rmSync(f.root, { recursive: true, force: true }); }
}

test("release inputs reject non-exact versions, MSI overflow, and unsafe URLs", () => {
  assert.equal(validateVersion("0.2.23"), "0.2.23");
  for (const value of ["latest", "v1.2.3", "1.2.3-beta.1", "01.2.3", "256.1.0", "1.1.65536", "1.2.3; echo bad", "1.2.3\n", undefined])
    assert.throws(() => validateVersion(value));
  assert.equal(validateBaseUrl("https://example.test/releases/v1.2.3/"), "https://example.test/releases/v1.2.3");
  const credentialUrl = new URL("https://example.test");
  credentialUrl.username = "fixture-user";
  credentialUrl.password = "fixture-password";
  for (const value of ["http://example.test", credentialUrl.href, "https://example.test/path?q=1",
    "https://example.test/#fragment", "https://example.test/'bad", "https://example.test/../bad", "https://example.test/\nbad"])
    assert.throws(() => validateBaseUrl(value));
});

test("npm source requires the owned package, expected URL and authentic bytes", () => usingFixture((f) => {
  assert.match(verifySource(f.metadata, f.data).sha256, /^[a-f0-9]{64}$/);
  assert.throws(() => verifySource(f.metadata, Buffer.from("tampered")), /integrity mismatch/);
  assert.throws(() => verifySource({ ...f.metadata, name: "other" }, f.data), /Unexpected npm package/);
  assert.throws(() => verifySource({ ...f.metadata, url: "https://example.test/cli.tgz" }, f.data), /Unexpected npm tarball URL/);
  assert.throws(() => verifySource({ ...f.metadata, integrity: "sha512-bad" }, f.data), /SHA-512 integrity/);
  assert.throws(() => verifySource({ ...f.metadata, sha256: "0".repeat(64) }, f.data), /checksum mismatch/);
}));

test("source preparation rejects a registry-supplied untrusted URL before downloading", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return Response.json({ name: "@octonodes/cli", version: "1.2.3", dist: { tarball: "https://untrusted.test/package.tgz" } });
  };
  try {
    await assert.rejects(prepareSource("1.2.3", join(tmpdir(), "must-not-be-written")), /Unexpected npm tarball URL/);
    assert.equal(calls.length, 1);
  } finally { globalThis.fetch = originalFetch; }
});

test("Homebrew formula can be prepared before any portable builds", () => usingFixture((f) => {
  formula(f.source, f.output);
  const contents = readFileSync(join(f.output, "Formula/octonodes.rb"), "utf8");
  assert.match(contents, /depends_on "node@24"/);
  assert.match(contents, /cli-1\.2\.3\.tgz/);
  assert.match(contents, /std_npm_args/);
  assert.doesNotMatch(contents, /@[A-Z0-9_]+@/);
  assert.throws(() => formula(f.source, f.output), { code: "EEXIST" });
}));

test("complete review output pins every package manager to verified release assets", () => usingFixture((f) => {
  generateManifests(f.source, f.output, "https://downloads.example.test/1.2.3", f.bundles);
  const scoop = JSON.parse(readFileSync(join(f.output, "scoop/bucket/octonodes.json")));
  assert.equal(scoop.version, "1.2.3");
  assert.equal(scoop.bin, "bin/octonodes.cmd");
  assert.match(scoop.architecture["64bit"].hash, /^[a-f0-9]{64}$/);
  const report = JSON.parse(readFileSync(join(f.output, "distribution.json")));
  assert.equal(report.assets.length, 10);
  assert.equal(report.nodeVersion, "v24.13.0");
  for (const item of report.assets) {
    assert.equal(createHash("sha256").update(readFileSync(join(f.output, "assets", item.file))).digest("hex"), item.sha256);
    assert.match(item.url, /^https:\/\/downloads\.example\.test\/1\.2\.3\//);
  }
  assert.equal(readFileSync(join(f.output, "assets/SHA256SUMS"), "utf8").trim().split("\n").length, 10);
  for (const path of ["arch/PKGBUILD", "snap/snapcraft.yaml", "docker/Dockerfile", "install.sh", "install.ps1",
    "chocolatey/tools/chocolateyinstall.ps1", "winget/manifests/o/Octonode/CLI/1.2.3/Octonode.CLI.installer.yaml"]) {
    const contents = readFileSync(join(f.output, path), "utf8");
    assert.doesNotMatch(contents, /@[A-Z0-9_]+@/, path);
    assert.match(contents, /1\.2\.3/, path);
  }
  const winget = readFileSync(join(f.output, "winget/manifests/o/Octonode/CLI/1.2.3/Octonode.CLI.installer.yaml"), "utf8");
  assert.match(winget, /InstallerType: wix/);
  assert.match(winget, /win32-x64\.msi/);
  assert.throws(() => generateManifests(f.source, f.output, "https://example.test", f.bundles), { code: "EEXIST" });
}));

for (const [name, mutate, expected] of [
  ["tampered artifact", (b, f) => writeFileSync(join(f.bundles[0], b.assets[0].file), "tampered"), /checksum mismatch/],
  ["unsafe filename", (b) => { b.assets[0].file = "../../escape.tar.gz"; }, /Unsafe/],
  ["wrong release", (b) => { b.version = "1.2.4"; }, /exact npm release/],
  ["wrong npm checksum", (b) => { b.npmSha256 = "0".repeat(64); }, /exact npm release/],
  ["wrong Node runtime", (b) => { b.nodeVersion = "v22.0.0"; }, /Node 24/],
  ["mixed Node patches", (b) => { b.nodeVersion = "v24.12.0"; }, /same Node version/],
  ["wrong platform", (b) => { b.target = "win32-arm64"; }, /Unsupported/],
  ["missing MSI", (b) => { b.assets = b.assets.filter((item) => !item.file.endsWith(".msi")); }, /Missing release asset/],
  ["missing DEB", (b) => { b.assets = b.assets.filter((item) => !item.file.endsWith(".deb")); }, /Missing release asset/],
]) {
  test(`review rejects ${name} before writing output`, () => usingFixture((f) => {
    const index = name === "missing MSI" ? 4 : name === "missing DEB" ? 2 : 0;
    const path = join(f.bundles[index], "bundle.json");
    const bundle = JSON.parse(readFileSync(path));
    mutate(bundle, f);
    writeFileSync(path, JSON.stringify(bundle));
    assert.throws(() => generateManifests(f.source, f.output, "https://example.test", f.bundles), expected);
    assert.equal(existsSync(f.output), false);
  }));
}

test("review rejects incomplete and duplicated platform sets", () => usingFixture((f) => {
  assert.throws(() => generateManifests(f.source, f.output, "https://example.test", f.bundles.slice(1)), /five platform bundles/);
  assert.throws(() => generateManifests(f.source, f.output, "https://example.test", [...f.bundles, f.bundles[0]]), /duplicate bundle target/);
}));

test("repository generation rejects duplicate architectures and tampered packages before writing", () => usingFixture((f) => {
  generateManifests(f.source, f.output, "https://example.test", f.bundles);
  const path = join(f.output, "distribution.json");
  const report = JSON.parse(readFileSync(path));
  const output = join(f.root, "repositories");
  const run = () => spawnSync(process.execPath, ["scripts/distribution/repository.mjs", f.output, output], { encoding: "utf8" });
  const packages = report.assets.filter((asset) => /\.(deb|rpm)$/.test(asset.file));
  writeFileSync(path, JSON.stringify({ ...report, assets: [packages[0], packages[0], packages[2], packages[3]] }));
  const duplicate = run();
  assert.notEqual(duplicate.status, 0);
  assert.match(duplicate.stderr, /architectures are required exactly once/);
  assert.equal(existsSync(output), false);
  writeFileSync(path, JSON.stringify(report));
  writeFileSync(join(f.output, "assets", packages[0].file), "tampered");
  const tampered = run();
  assert.notEqual(tampered.status, 0);
  assert.match(tampered.stderr, /checksum mismatch/);
  assert.equal(existsSync(output), false);
}));

test("direct Unix installer verifies bytes, works through its command link, and rejects tampering", { skip: process.platform === "win32" }, () => usingFixture((f) => {
  const target = `${process.platform}-${process.arch}`;
  if (!TARGETS.includes(target)) return;
  const directory = f.bundles[TARGETS.indexOf(target)];
  const stage = join(f.root, "stage");
  mkdirSync(join(stage, "bin"), { recursive: true });
  writeFileSync(join(stage, "bin/octonodes"), '#!/bin/sh\nprintf "1.2.3\\n"\n');
  chmodSync(join(stage, "bin/octonodes"), 0o755);
  const path = join(directory, "bundle.json");
  const bundle = JSON.parse(readFileSync(path));
  const archive = join(directory, bundle.assets[0].file);
  execFileSync("tar", ["-czf", archive, "-C", stage, "."]);
  bundle.assets[0].sha256 = createHash("sha256").update(readFileSync(archive)).digest("hex");
  writeFileSync(path, JSON.stringify(bundle));
  generateManifests(f.source, f.output, "https://example.test/1.2.3", f.bundles);
  const tools = join(f.root, "tools");
  mkdirSync(tools);
  writeFileSync(join(tools, "curl"), '#!/bin/sh\nfor arg; do last=$arg; done\ncp "$FIXTURE_ARCHIVE" "$last"\n');
  chmodSync(join(tools, "curl"), 0o755);
  const env = { ...process.env, PATH: `${tools}:${process.env.PATH}`, FIXTURE_ARCHIVE: archive,
    OCTONODES_INSTALL_DIR: join(f.root, "user data"), OCTONODES_BIN_DIR: join(f.root, "user bin") };
  const result = spawnSync("sh", [join(f.output, "install.sh")], { env, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(execFileSync(join(env.OCTONODES_BIN_DIR, "octonodes"), ["--version"], { encoding: "utf8" }).trim(), "1.2.3");
  const repeated = spawnSync("sh", [join(f.output, "install.sh")], { env, encoding: "utf8" });
  assert.notEqual(repeated.status, 0);
  assert.match(repeated.stderr, /Already exists/);
  writeFileSync(archive, "tampered");
  const other = { ...env, OCTONODES_INSTALL_DIR: join(f.root, "other install"), OCTONODES_BIN_DIR: join(f.root, "other bin") };
  const bad = spawnSync("sh", [join(f.output, "install.sh")], { env: other, encoding: "utf8" });
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr, /checksum mismatch/);
  assert.equal(existsSync(other.OCTONODES_INSTALL_DIR), false);
}));
