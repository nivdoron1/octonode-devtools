import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assetNames, HOMEPAGE, TARGETS } from "./constants.mjs";
import { readSource } from "./source.mjs";

export function validateBaseUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash ||
      value.split("/").some((segment) => segment === "." || segment === "..") ||
      !/^https:\/\/[A-Za-z0-9.-]+(?::\d+)?(?:\/[A-Za-z0-9._~-]+)*\/?$/.test(value))
    throw new Error("Use an HTTPS asset directory URL without credentials, query, or fragment");
  return value.replace(/\/$/, "");
}

function render(template, values) {
  return readFileSync(resolve(import.meta.dirname, "../../packaging", template), "utf8")
    .replace(/@([A-Z0-9_]+)@/g, (_, key) => {
      if (!(key in values)) throw new Error(`Missing template value: ${key}`);
      return values[key];
    });
}

function write(directory, path, content) {
  const target = resolve(directory, path);
  mkdirSync(resolve(target, ".."), { recursive: true });
  writeFileSync(target, content, { flag: "wx" });
}

export function formula(sourceDirectory, output) {
  const source = readSource(sourceDirectory);
  write(output, "Formula/octonodes.rb", render("homebrew/octonodes.rb.in", {
    HOMEPAGE, VERSION: source.version, NPM_URL: source.url, NPM_SHA256: source.sha256,
  }));
}

export function generateManifests(sourceDirectory, output, base, directories) {
  const baseUrl = validateBaseUrl(base);
  const source = readSource(sourceDirectory);
  const targets = new Map();
  const assets = new Map();
  let nodeVersion;
  for (const directory of directories) {
    const bundle = JSON.parse(readFileSync(resolve(directory, "bundle.json"), "utf8"));
    if (bundle.version !== source.version || bundle.npmSha256 !== source.sha256)
      throw new Error("Bundles must match the exact npm release and checksum");
    if (!TARGETS.includes(bundle.target) || targets.has(bundle.target)) throw new Error("Unsupported or duplicate bundle target");
    if (!/^v24\.\d+\.\d+$/.test(bundle.nodeVersion)) throw new Error("Bundles require Node 24");
    nodeVersion ??= bundle.nodeVersion;
    if (bundle.nodeVersion !== nodeVersion) throw new Error("Bundles must use the same Node version");
    const expected = assetNames(source.version, bundle.target);
    for (const asset of bundle.assets) {
      if (!expected.includes(asset.file) || assets.has(asset.file))
        throw new Error("Unsafe or duplicate release asset");
      const data = readFileSync(resolve(directory, asset.file));
      if (createHash("sha256").update(data).digest("hex") !== asset.sha256) throw new Error("Release asset checksum mismatch");
      assets.set(asset.file, { ...asset, directory, target: bundle.target });
    }
    for (const name of expected) if (!assets.has(name)) throw new Error(`Missing release asset: ${name}`);
    targets.set(bundle.target, bundle);
  }
  if (TARGETS.some((target) => !targets.has(target))) throw new Error("All five platform bundles are required");
  const asset = (target, extension) => {
    const name = `octonodes-${source.version}-${target}.${extension}`;
    const found = assets.get(name);
    if (!found || found.target !== target) throw new Error(`Missing release asset: ${name}`);
    return { ...found, url: `${baseUrl}/${name}` };
  };
  const windows = asset("win32-x64", "zip");
  const msi = asset("win32-x64", "msi");
  const values = { HOMEPAGE, VERSION: source.version, BASE_URL: baseUrl,
    WINDOWS_ZIP_URL: windows.url, WINDOWS_ZIP_SHA256: windows.sha256 };
  for (const target of TARGETS.filter((target) => target !== "win32-x64")) {
    const archive = asset(target, "tar.gz");
    const key = target.replaceAll("-", "_").toUpperCase();
    values[`${key}_URL`] = archive.url;
    values[`${key}_SHA256`] = archive.sha256;
  }
  // Resolve every required artifact before creating review output.
  mkdirSync(output, { recursive: false });
  formula(sourceDirectory, output);
  const scoop = { version: source.version, description: "Octonode API and plugin development CLI", homepage: HOMEPAGE,
    license: "MIT", architecture: { "64bit": { url: windows.url, hash: windows.sha256 } },
    bin: "bin/octonodes.cmd", notes: "App development also requires npm or another project package manager." };
  write(output, "scoop/bucket/octonodes.json", JSON.stringify(scoop, null, 2) + "\n");
  for (const file of ["octonodes.nuspec", "chocolateyinstall.ps1", "chocolateyuninstall.ps1"])
    write(output, `chocolatey/${file.endsWith(".ps1") ? "tools/" : ""}${file}`, render(`chocolatey/${file}.in`, values));
  write(output, "arch/PKGBUILD", render("arch/PKGBUILD.in", values));
  write(output, "snap/snapcraft.yaml", render("snap/snapcraft.yaml.in", values));
  write(output, "docker/Dockerfile", render("docker/Dockerfile.in", values));
  cpSync(resolve(sourceDirectory, "cli.tgz"), resolve(output, "docker/cli.tgz"));
  write(output, "install.sh", render("install/install.sh.in", values));
  write(output, "install.ps1", render("install/install.ps1.in", values));
  const wingetPath = `winget/manifests/o/Octonode/CLI/${source.version}`;
  const common = `PackageIdentifier: Octonode.CLI\nPackageVersion: ${source.version}\n`;
  write(output, `${wingetPath}/Octonode.CLI.yaml`, `${common}DefaultLocale: en-US\nManifestType: version\nManifestVersion: 1.9.0\n`);
  write(output, `${wingetPath}/Octonode.CLI.locale.en-US.yaml`, `${common}PackageLocale: en-US\nPublisher: Octonode\nPackageName: Octonodes CLI\nLicense: MIT\nPackageUrl: ${HOMEPAGE}\nShortDescription: Octonode API and plugin development CLI\nMoniker: octonodes\nManifestType: defaultLocale\nManifestVersion: 1.9.0\n`);
  write(output, `${wingetPath}/Octonode.CLI.installer.yaml`, `${common}InstallerType: wix\nScope: machine\nUpgradeBehavior: install\nCommands:\n  - octonodes\nInstallers:\n  - Architecture: x64\n    InstallerUrl: ${msi.url}\n    InstallerSha256: ${msi.sha256.toUpperCase()}\nManifestType: installer\nManifestVersion: 1.9.0\n`);
  const list = [...assets.values()].sort((a, b) => a.file.localeCompare(b.file));
  for (const entry of list) {
    mkdirSync(resolve(output, "assets"), { recursive: true });
    cpSync(resolve(entry.directory, entry.file), resolve(output, "assets", entry.file));
  }
  write(output, "assets/SHA256SUMS", list.map((entry) => `${entry.sha256}  ${entry.file}`).join("\n") + "\n");
  write(output, "distribution.json", JSON.stringify({ source, nodeVersion,
    assets: list.map(({ file, sha256, target }) => ({ file, sha256, target, url: `${baseUrl}/${file}` })) }, null, 2) + "\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, source, output, base, ...directories] = process.argv.slice(2);
  if (command === "formula" && source && output && !base) formula(source, output);
  else if (command === "all" && source && output && base && directories.length)
    generateManifests(source, resolve(output), base, directories);
  else throw new Error("usage: node scripts/distribution/manifests.mjs formula <source-dir> <output-dir> | all <source-dir> <new-output-dir> <https-asset-base> <bundle-dir> [...]");
  process.stdout.write(`Prepared installation manifests in ${output}; nothing published\n`);
}
