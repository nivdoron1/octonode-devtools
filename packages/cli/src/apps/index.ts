import { parseArgs } from "node:util";
import { resolve } from "node:path";
import { verifyBuild } from "../plugins/artifact";
import { buildAppProject } from "./build";
import { createApp, addAppExtension } from "./create";
import { publishApp } from "./publish";
import { startAppDev, serveApp } from "./dev";
import { APP_HELP } from "./constants";
export async function appCommand(args: string[], version: string): Promise<void> {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      cwd: { type: "string" },
      target: { type: "string" },
      template: { type: "string" },
      port: { type: "string" },
      "use-localhost": { type: "boolean" },
      "tunnel-url": { type: "string" },
      "no-open": { type: "boolean" },
      "app-url": { type: "string" },
      workspace: { type: "string" },
      "app-id": { type: "string" },
      revision: { type: "string" },
      distribution: { type: "string" },
      "base-url": { type: "string" },
      "studio-url": { type: "string" },
    },
  });
  const [command, target, id] = positionals;
  if (command === "publish" && positionals.length <= 2 && values.workspace) {
    process.stdout.write(
      JSON.stringify(
        await publishApp(target ?? values.cwd ?? ".", {
          workspace: values.workspace,
          appId: values["app-id"],
          revision: values.revision === undefined ? undefined : Number(values.revision),
          distribution: values.distribution,
          baseUrl: values["base-url"],
        }),
        null,
        2,
      ) + "\n",
    );
    return;
  }
  if (["dev", "serve"].includes(command) && positionals.length <= 2) {
    const port = values.port === undefined ? undefined : Number(values.port);
    if (port !== undefined && (!Number.isInteger(port) || port < 0 || port > 65535))
      throw new Error("--port must be an integer from 0 to 65535");
    if (command === "serve") {
      await serveApp(target ?? values.cwd ?? ".", port ?? Number(process.env.PORT ?? 3000));
      return;
    }
    await startAppDev(target ?? values.cwd ?? ".", {
      port,
      localhost: values["use-localhost"],
      tunnelUrl: values["tunnel-url"],
      open: !values["no-open"],
      workspace: values.workspace,
      baseUrl: values["base-url"],
      studioUrl: values["studio-url"],
    });
    return;
  }
  if (command === "create" && target && positionals.length === 2 && !values.cwd && !values.target) {
    process.stdout.write(
      `Created ${createApp(target, version, values.template)}\nNext: npm install, then npm run dev in that directory.\n`,
    );
    return;
  }
  if (command === "extension" && target === "add" && id && positionals.length === 3) {
    process.stdout.write(JSON.stringify(addAppExtension(values.cwd ?? ".", id, values.target ?? ""), null, 2) + "\n");
    return;
  }
  if (command === "build" && positionals.length <= 2 && !values.cwd && !values.target) {
    process.stdout.write(JSON.stringify(await buildAppProject(target ?? ".", values["app-url"]), null, 2) + "\n");
    return;
  }
  if (command === "validate" && target && positionals.length === 2 && !values.cwd && !values.target) {
    const result = verifyBuild(resolve(target));
    if (!result.manifest.app) throw new Error("Artifact is not an app");
    process.stdout.write(JSON.stringify(result.manifest, null, 2) + "\n");
    return;
  }
  throw new Error(APP_HELP);
}
