import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { assetNames } from "./constants.mjs";
import { validateVersion } from "./source.mjs";

const [review, output, ...extra] = process.argv.slice(2);
if (!review || !output || extra.length) throw new Error("usage (Linux): node scripts/distribution/repository.mjs <review-directory> <new-repository-directory>");
const report = JSON.parse(readFileSync(resolve(review, "distribution.json")));
validateVersion(report.source.version);
const packages = report.assets.filter((asset) => /\.(deb|rpm)$/.test(asset.file));
const expected = ["linux-x64", "linux-arm64"].flatMap((target) => assetNames(report.source.version, target)).filter((file) => /\.(deb|rpm)$/.test(file));
if (packages.length !== 4 || expected.some((file) => packages.filter((asset) => asset.file === file).length !== 1))
  throw new Error("Both DEB and RPM architectures are required exactly once");
const verified = packages.map((asset) => {
  if (!/^octonodes[-_][A-Za-z0-9_.-]+\.(deb|rpm)$/.test(asset.file)) throw new Error("Unsafe repository package name");
  const path = resolve(review, "assets", asset.file);
  if (createHash("sha256").update(readFileSync(path)).digest("hex") !== asset.sha256) throw new Error("Repository package checksum mismatch");
  return { ...asset, path };
});
const directory = resolve(output);
mkdirSync(directory, { recursive: false });
const apt = resolve(directory, "apt");
const rpm = resolve(directory, "rpm");
const pool = resolve(apt, "pool/main/o/octonodes");
mkdirSync(pool, { recursive: true });
mkdirSync(rpm);
for (const asset of verified) cpSync(asset.path, resolve(asset.file.endsWith(".deb") ? pool : rpm, asset.file));
for (const arch of ["amd64", "arm64"]) {
  const index = resolve(apt, `dists/stable/main/binary-${arch}`);
  mkdirSync(index, { recursive: true });
  const data = execFileSync("dpkg-scanpackages", ["--arch", arch, "pool", "/dev/null"], { cwd: apt });
  writeFileSync(resolve(index, "Packages"), data);
  writeFileSync(resolve(index, "Packages.gz"), gzipSync(data));
}
const config = resolve(directory, "apt.conf");
writeFileSync(config, 'APT::FTPArchive::Release::Origin "Octonode";\nAPT::FTPArchive::Release::Label "Octonodes CLI";\nAPT::FTPArchive::Release::Suite "stable";\nAPT::FTPArchive::Release::Codename "stable";\nAPT::FTPArchive::Release::Architectures "amd64 arm64";\nAPT::FTPArchive::Release::Components "main";\n');
const release = execFileSync("apt-ftparchive", ["-c", config, "release", "dists/stable"], { cwd: apt });
writeFileSync(resolve(apt, "dists/stable/Release"), release);
execFileSync("createrepo_c", [rpm], { stdio: "inherit" });
process.stdout.write(`Prepared APT and DNF repository metadata in ${directory}; sign before publishing\n`);
