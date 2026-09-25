import { deployPlugin } from "./deploy";
import { updatePluginRelease } from "./release";
import { PLUGIN_PUBLISH_AUDIENCE } from "@octonodes/sdk/plugins";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { accessToken } from "../auth";
import { verifyBuild } from "./artifact";
import { buildPlugins } from "./build";
import { createPlugin } from "./create";
import { publishPlugin } from "./publish";
import { generateNodeCatalog } from "@octonodes/sdk/definitions/compiler";
import { runPluginLifecycle } from "../../runtime/plugin-lifecycle.cjs";

export { PLUGIN_HELP } from "./help.constants";

export async function pluginCommand(args: string[], version: string): Promise<void> {
  const command = args[0];
  const { values, positionals } = parseArgs({
    args: args.slice(1),
    allowPositionals: true,
    options: {
      github: { type: "boolean" },
      input: { type: "string" },
      registry: { type: "string" },
      org: { type: "string" },
      team: { type: "string" },
      check: { type: "boolean" },
      cwd: { type: "string" },
      alias: { type: "string" },
      scope: { type: "string" },
      version: { type: "string" },
      migrate: { type: "boolean" },
      "dry-run": { type: "boolean" },
      frozen: { type: "boolean" },
      "artifacts-only": { type: "boolean" },
      offline: { type: "boolean" },
    },
  });
  const [target, nodeId] = positionals;
  if (["install", "update", "remove", "restore", "recover", "list"].includes(command)) {
    const token = process.env.OCTONODE_MARKETPLACE_TOKEN ?? (await accessToken());
    process.stdout.write(JSON.stringify(await runPluginLifecycle(command, target, { ...values, token }), null, 2) + "\n");
    return;
  }
  if (command === "nodes") {
    generateNodeCatalog(process.cwd(), undefined, values.check);
    process.stdout.write(values.check ? "Node inventory is current\n" : "Node inventory generated\n");
    return;
  }
  if (positionals.length > (command === "test" ? 2 : 1)) throw new Error("Too many plugin command arguments");
  if (command === "build") {
    process.stdout.write(JSON.stringify(await buildPlugins(target), null, 2) + "\n");
    return;
  }
  if (command === "deploy") {
    const token = values.github
      ? undefined
      : (process.env.OCTONODE_MARKETPLACE_TOKEN ?? (await accessToken()));
    process.stdout.write(
      JSON.stringify(
        await deployPlugin(
          target ?? ".",
          values.registry ?? process.env.OCTONODE_MARKETPLACE_URL ?? PLUGIN_PUBLISH_AUDIENCE,
          token,
          values.github,
        ),
        null,
        2,
      ) + "\n",
    );
    return;
  }
  if (command === "version") {
    if (!target) throw new Error("Choose patch, minor, major or an exact version");
    const result = updatePluginRelease(
      values.cwd ?? process.cwd(),
      ["patch", "minor", "major"].includes(target)
        ? { bump: target as "patch" | "minor" | "major" }
        : { version: target },
    );
    if (!result) throw new Error("Add a plugin.octonode.json or .yml release file first");
    process.stdout.write(result.config.version + "\n");
    return;
  }
  if (!target) throw new Error(`plugin ${command ?? "command"} requires a target; run octonodes plugin --help`);
  if (command === "create") {
    process.stdout.write(
      `Created ${createPlugin(target, version)}\nNext: npm install, then npm test in that directory.\n`,
    );
    return;
  }
  const directory = resolve(target);
  if (command === "validate") {
    process.stdout.write(JSON.stringify(verifyBuild(directory).manifest, null, 2) + "\n");
    return;
  }
  if (command === "test") {
    const { manifest } = verifyBuild(directory);
    const selected = nodeId ?? (manifest.nodes.length === 1 ? manifest.nodes[0].id : undefined);
    if (!manifest.nodes.some((node) => node.id === selected))
      throw new Error(`Choose a node: ${manifest.nodes.map((node) => node.id).join(", ")}`);
    const output = execFileSync(process.execPath, ["--experimental-import-meta-resolve", "dist/index.js", selected!], {
      cwd: directory,
      encoding: "utf8",
      timeout: 30_000,
      input:
        JSON.stringify({
          octonode: "1",
          type: "invoke",
          invocationId: "plugin-test",
          inputs: JSON.parse(values.input ?? "{}"),
        }) + "\n",
    });
    process.stdout.write(output);
    if (JSON.parse(output).status !== "ok") throw new Error("Plugin test failed");
    return;
  }
  if (command === "publish") {
    const registry = values.registry ?? process.env.OCTONODE_MARKETPLACE_URL ?? PLUGIN_PUBLISH_AUDIENCE;
    if (!registry) throw new Error("Set OCTONODE_MARKETPLACE_URL or pass --registry <url>");
    const token = process.env.OCTONODE_MARKETPLACE_TOKEN ?? (await accessToken());
    if (!token) throw new Error('Run "octonodes login" or set OCTONODE_TOKEN');
    process.stdout.write(
      JSON.stringify(await publishPlugin(directory, registry, token, values.org, values.team), null, 2) + "\n",
    );
    return;
  }
  throw new Error(`Unknown plugin command: ${command}`);
}
