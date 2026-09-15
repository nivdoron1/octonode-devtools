import { cpSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function syncOpenApi(source, root = resolve(import.meta.dirname, "..")) {
  const target = resolve(root, "packages/sdk/openapi.json");
  if (readFileSync(source).equals(readFileSync(target))) return undefined;

  const sdkPath = resolve(root, "packages/sdk/package.json");
  const cliPath = resolve(root, "packages/cli/package.json");
  const sdk = JSON.parse(readFileSync(sdkPath, "utf8"));
  const cli = JSON.parse(readFileSync(cliPath, "utf8"));
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(sdk.version);
  if (!match) throw new Error(`cannot bump SDK version "${sdk.version}"`);

  const version = `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
  sdk.version = version;
  cli.version = version;
  cpSync(source, target);
  writeFileSync(sdkPath, `${JSON.stringify(sdk, null, 2)}\n`);
  writeFileSync(cliPath, `${JSON.stringify(cli, null, 2)}\n`);
  return version;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = process.argv[2];
  if (!source) throw new Error("usage: node scripts/sync-openapi.mjs <openapi.json>");
  const version = syncOpenApi(resolve(source));
  process.stdout.write(version ? `synced OpenAPI and bumped packages to ${version}\n` : "OpenAPI is current\n");
}
