import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PACKAGE } from "./constants.mjs";

export function validateVersion(version) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version ?? ""))
    throw new Error("Specify an exact stable npm version, such as 0.2.23");
  const [major, minor, patch] = version.split(".").map(Number);
  if (major > 255 || minor > 255 || patch > 65535) throw new Error("Version exceeds MSI limits");
  return version;
}

export function verifySource(metadata, data) {
  validateVersion(metadata.version);
  if (metadata.name !== PACKAGE) throw new Error("Unexpected npm package");
  const expected = `https://registry.npmjs.org/@octonodes/cli/-/cli-${metadata.version}.tgz`;
  if (metadata.url !== expected) throw new Error("Unexpected npm tarball URL");
  if (!/^sha512-[A-Za-z0-9+/]{86}==$/.test(metadata.integrity ?? ""))
    throw new Error("npm SHA-512 integrity is required");
  const integrity = "sha512-" + createHash("sha512").update(data).digest("base64");
  if (integrity !== metadata.integrity) throw new Error("npm tarball integrity mismatch");
  const sha256 = createHash("sha256").update(data).digest("hex");
  if (metadata.sha256 && metadata.sha256 !== sha256) throw new Error("npm tarball checksum mismatch");
  return { ...metadata, sha256 };
}

export function readSource(directory) {
  const metadata = JSON.parse(readFileSync(resolve(directory, "source.json"), "utf8"));
  return verifySource(metadata, readFileSync(resolve(directory, "cli.tgz")));
}

async function download(url) {
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(120_000) });
  if (!response.ok) throw new Error(`Download failed: ${url} (${response.status})`);
  return response;
}

export async function prepareSource(version, directory) {
  validateVersion(version);
  const pkg = await (await download(`https://registry.npmjs.org/@octonodes%2fcli/${version}`)).json();
  const metadata = { name: pkg.name, version: pkg.version, url: pkg.dist?.tarball, integrity: pkg.dist?.integrity };
  // Validate the destination before following any URL supplied by the registry response.
  if (metadata.url !== `https://registry.npmjs.org/@octonodes/cli/-/cli-${version}.tgz`)
    throw new Error("Unexpected npm tarball URL");
  const data = Buffer.from(await (await download(metadata.url)).arrayBuffer());
  const verified = verifySource(metadata, data);
  mkdirSync(directory, { recursive: false });
  writeFileSync(resolve(directory, "cli.tgz"), data, { flag: "wx" });
  writeFileSync(resolve(directory, "source.json"), JSON.stringify(verified, null, 2) + "\n", { flag: "wx" });
  return verified;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [version, output, ...extra] = process.argv.slice(2);
  if (!version || !output || extra.length) throw new Error("usage: node scripts/distribution/source.mjs <version> <new-directory>");
  const metadata = await prepareSource(version, resolve(output));
  process.stdout.write(`Prepared ${PACKAGE}@${metadata.version} with verified npm integrity\n`);
}
