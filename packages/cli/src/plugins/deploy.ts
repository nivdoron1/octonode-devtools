import { existsSync, readFileSync, realpathSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { basename, dirname, join, resolve } from "node:path";
import {
  PLUGIN_PUBLISH_AUDIENCE,
  PLUGIN_PUBLISH_MAX_BYTES,
  PluginConfigPath,
  PluginManifest,
} from "@octonodes/sdk/plugins";
import { buildPlugins } from "./build";
import { readPluginRelease } from "./release";
import { packBuiltPlugin, publishPlugin } from "./publish";

async function githubPublishing(configPath: string, registry: string) {
  const url = new URL(registry);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/")
    throw new Error("Registry must be an HTTPS origin");
  if (
    process.env.GITHUB_ACTIONS !== "true" ||
    !process.env.ACTIONS_ID_TOKEN_REQUEST_URL ||
    !process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
  )
    throw new Error("GitHub deployment requires Actions permissions: id-token: write");
  const endpoint = new URL("/github/plugins/publish", url);
  endpoint.searchParams.set("config", PluginConfigPath.parse(configPath));
  const identity = async () => {
    const oidc = new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL!);
    oidc.searchParams.set("audience", PLUGIN_PUBLISH_AUDIENCE);
    const result = await fetch(oidc, {
      headers: { authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` },
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    });
    if (!result.ok) throw new Error(`GitHub identity request failed (${result.status})`);
    const body = (await result.json()) as { value?: string };
    if (!body.value) throw new Error("GitHub did not return an identity token");
    return body.value;
  };
  return { endpoint, identity };
}

async function githubStatus(endpoint: URL, identity: () => Promise<string>, id: string, version: string) {
  const check = await fetch(endpoint, {
    headers: { authorization: `Bearer ${await identity()}` },
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
  if (!check.ok)
    throw new Error(`Plugin connection check failed (${check.status}): ${(await check.text()).slice(0, 1000)}`);
  const result = (await check.json()) as { status?: string; id?: string; version?: string };
  if (result.id !== id || result.version !== version)
    throw new Error("Local plugin version does not match the committed GitHub manifest");
  if (result.status !== "ready" && result.status !== "unchanged")
    throw new Error("Unexpected plugin connection status");
  return result.status;
}

async function uploadGithubBuild(directory: string, endpoint: URL, identity: () => Promise<string>) {
  const { manifest, bundle } = packBuiltPlugin(directory);
  if (bundle.byteLength > PLUGIN_PUBLISH_MAX_BYTES - 1_048_576)
    throw new Error("Plugin bundle exceeds the upload limit");
  const sha256 = createHash("sha256").update(bundle).digest("hex");
  const form = new FormData();
  form.set("manifest", JSON.stringify(manifest));
  form.set("bundle", new Blob([bundle]), "bundle.tar.gz");
  const response = await fetch(endpoint, {
    method: "POST",
    body: form,
    headers: { authorization: `Bearer ${await identity()}`, "x-octonode-sha256": sha256 },
    redirect: "error",
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok)
    throw new Error(`Plugin deployment failed (${response.status}): ${(await response.text()).slice(0, 1000)}`);
  const result = (await response.json()) as { sha256?: string };
  if (result.sha256 !== sha256)
    throw new Error("Registry archive hash does not match the uploaded bundle");
  return result;
}

/** Publish every tracked plugin source, using the repository's already built artifacts for legacy packages. */
export async function deployAllPlugins(registry = PLUGIN_PUBLISH_AUDIENCE, cwd = process.cwd()) {
  const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd, encoding: "utf8" }).trim();
  const files = execFileSync("git", ["ls-files", "-z"], { cwd: root }).toString().split("\0");
  const candidates = files.filter((path) => PluginConfigPath.safeParse(path).success);
  const releaseRoots = candidates
    .filter((path) => basename(path) !== "octonode.plugin.json" && path.includes("/"))
    .map((path) => dirname(path) + "/");
  const paths = candidates.filter(
    (path) => basename(path) !== "octonode.plugin.json" || !releaseRoots.some((root) => path.startsWith(root)),
  );
  if (!paths.length) throw new Error("No tracked Octonode plugin manifests were found");
  const results = [];
  for (const path of paths) {
    const source = join(root, path);
    if (basename(path) !== "octonode.plugin.json") {
      results.push(await deployPlugin(dirname(source), registry, undefined, true));
      continue;
    }
    const manifest = PluginManifest.parse(JSON.parse(readFileSync(source, "utf8")));
    const directory = [join(root, "dist/marketplace", manifest.id), join(dirname(source), "dist/plugins", manifest.id)]
      .find((candidate) => existsSync(candidate));
    if (!directory) throw new Error(`Build plugin ${manifest.id} before publishing; no artifact was found`);
    const { endpoint, identity } = await githubPublishing(path, registry);
    const status = await githubStatus(endpoint, identity, manifest.id, manifest.version);
    results.push(status === "unchanged"
      ? { id: manifest.id, version: manifest.version, status }
      : await uploadGithubBuild(directory, endpoint, identity));
  }
  return results;
}

export async function deployPlugin(
  root: string,
  registry = PLUGIN_PUBLISH_AUDIENCE,
  token?: string,
  github = false,
) {
  root = realpathSync(resolve(root));
  const release = readPluginRelease(root);
  if (!release) throw new Error("Add plugin.octonode.json or plugin.octonode.yml before deploying");
  const url = new URL(registry);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error("Registry must be an HTTPS origin");
  let identity: (() => Promise<string>) | undefined;
  let endpoint: URL | undefined;
  if (github) {
    const repositoryPrefix = execFileSync("git", ["rev-parse", "--show-prefix"], {
      cwd: root,
      encoding: "utf8",
    }).trim();
    const configPath = PluginConfigPath.parse(
      repositoryPrefix + basename(release.path),
    );
    ({ endpoint, identity } = await githubPublishing(configPath, registry));
    const status = await githubStatus(endpoint, identity, release.config.id, release.config.version);
    if (status === "unchanged")
      return { id: release.config.id, version: release.config.version, status: "unchanged" };
  } else if (!token) throw new Error('Run "octonodes login" before deploying');
  const [built] = await buildPlugins(undefined, root);
  if (!github)
    return publishPlugin(
      built.directory,
      registry,
      token!,
      release.config.orgId,
      release.config.teamId,
    );
  return uploadGithubBuild(built.directory, endpoint!, identity!);
}
