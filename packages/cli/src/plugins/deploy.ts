import { realpathSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { basename, resolve } from "node:path";
import {
  PLUGIN_PUBLISH_AUDIENCE,
  PLUGIN_PUBLISH_MAX_BYTES,
  PluginConfigPath,
} from "@octonodes/sdk/plugins";
import { buildPlugins } from "./build";
import { readPluginRelease } from "./release";
import { packBuiltPlugin, publishPlugin } from "./publish";

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
    if (
      process.env.GITHUB_ACTIONS !== "true" ||
      !process.env.ACTIONS_ID_TOKEN_REQUEST_URL ||
      !process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
    )
      throw new Error("GitHub deployment requires Actions permissions: id-token: write");
    const repositoryPrefix = execFileSync("git", ["rev-parse", "--show-prefix"], {
      cwd: root,
      encoding: "utf8",
    }).trim();
    const configPath = PluginConfigPath.parse(
      repositoryPrefix + basename(release.path),
    );
    endpoint = new URL("/github/plugins/publish", url);
    endpoint.searchParams.set("config", configPath);
    identity = async () => {
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
    const check = await fetch(endpoint, {
      headers: { authorization: `Bearer ${await identity()}` },
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    });
    if (!check.ok)
      throw new Error(
        `Plugin connection check failed (${check.status}): ${(await check.text()).slice(0, 1000)}`,
      );
    const result = (await check.json()) as { status?: string; id?: string; version?: string };
    if (result.id !== release.config.id || result.version !== release.config.version)
      throw new Error("Local release file does not match the committed GitHub release");
    if (result.status === "unchanged")
      return { id: release.config.id, version: release.config.version, status: "unchanged" };
    if (result.status !== "ready") throw new Error("Unexpected plugin connection status");
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
  const { manifest, bundle } = packBuiltPlugin(built.directory);
  if (bundle.byteLength > PLUGIN_PUBLISH_MAX_BYTES - 1_048_576)
    throw new Error("Plugin bundle exceeds the upload limit");
  const sha256 = createHash("sha256").update(bundle).digest("hex");
  const form = new FormData();
  form.set("manifest", JSON.stringify(manifest));
  form.set("bundle", new Blob([bundle]), "bundle.tar.gz");
  const response = await fetch(endpoint!, {
    method: "POST",
    body: form,
    headers: { authorization: `Bearer ${await identity!()}`, "x-octonode-sha256": sha256 },
    redirect: "error",
    signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok)
    throw new Error(
      `Plugin deployment failed (${response.status}): ${(await response.text()).slice(0, 1000)}`,
    );
  const result = (await response.json()) as { sha256?: string };
  if (result.sha256 !== sha256)
    throw new Error("Registry archive hash does not match the uploaded bundle");
  return result;
}
