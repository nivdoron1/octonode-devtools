import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { accessToken } from "../auth";
import { verifyBuild } from "./artifact";
import { buildPlugins } from "./build";
import { createPlugin } from "./create";
import { publishPlugin } from "./publish";

export { PLUGIN_HELP } from "./constants";

export async function pluginCommand(args: string[], version: string): Promise<void> {
  const command = args[0];
  const { values, positionals } = parseArgs({
    args: args.slice(1),
    allowPositionals: true,
    options: {
      input: { type: "string" },
      registry: { type: "string" },
      org: { type: "string" },
      team: { type: "string" },
    },
  });
  const [target, nodeId] = positionals;
  if (positionals.length > (command === "test" ? 2 : 1))
    throw new Error("Too many plugin command arguments");
  if (command === "build") {
    process.stdout.write(JSON.stringify(await buildPlugins(target), null, 2) + "\n");
    return;
  }
  if (!target)
    throw new Error(
      `plugin ${command ?? "command"} requires a target; run octonodes plugin --help`,
    );
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
    const output = execFileSync(process.execPath, ["dist/index.js", selected!], {
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
    const registry = values.registry ?? process.env.OCTONODE_MARKETPLACE_URL;
    if (!registry) throw new Error("Set OCTONODE_MARKETPLACE_URL or pass --registry <url>");
    const token = process.env.OCTONODE_MARKETPLACE_TOKEN ?? (await accessToken());
    if (!token) throw new Error('Run "octonodes login" or set OCTONODE_TOKEN');
    process.stdout.write(
      JSON.stringify(
        await publishPlugin(directory, registry, token, values.org, values.team),
        null,
        2,
      ) + "\n",
    );
    return;
  }
  throw new Error(`Unknown plugin command: ${command}`);
}
