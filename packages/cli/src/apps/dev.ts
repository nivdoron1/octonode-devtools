import { watch, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { spawn } from "node:child_process";
import { build } from "esbuild";
import { buildAppProject, verifyWebBuild } from "./build";
import { readAppSource } from "./source";
import { createAppServer } from "./server";
import { publicOrigin, startTunnel } from "./tunnel";
import { createDevelopmentSession } from "./development";
import type { DevOptions } from "./types";

export async function startAppDev(directory: string, options: DevOptions = {}) {
  if (options.localhost && options.tunnelUrl) throw new Error("Choose --use-localhost or --tunnel-url");
  if (options.workspace && options.localhost)
    throw new Error("Studio preview requires an HTTPS tunnel; omit --use-localhost");
  const development = options.workspace
    ? await createDevelopmentSession(options.workspace, options.baseUrl, options.studioUrl)
    : undefined;
  const root = resolve(directory);
  let source = readAppSource(root);
  const preview = await build({
    stdin: {
      contents: `import { previewClient } from ${JSON.stringify(require.resolve("./preview.mjs"))}; previewClient();`,
      resolveDir: __dirname,
    },
    bundle: true,
    platform: "browser",
    format: "iife",
    write: false,
    logLevel: "silent",
  });
  const host = createAppServer({
    port: options.port ?? 0,
    previewScript: preview.outputFiles[0].text,
    source,
    development: true,
  });
  let tunnel: ReturnType<typeof startTunnel> | undefined;
  let watcher: ReturnType<typeof watch> | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let heartbeat: ReturnType<typeof setInterval> | undefined;
  let closed = false;
  let buildTask = Promise.resolve();
  const close = async () => {
    if (closed) return;
    closed = true;
    clearTimeout(timer);
    watcher?.close();
    clearInterval(heartbeat);
    tunnel?.stop();
    await host.close();
    await buildTask;
    await development?.close();
    process.off("SIGINT", onSignal);
    process.off("SIGTERM", onSignal);
  };
  const onSignal = () => {
    void close();
  };
  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);
  try {
    const port = await host.listen();
    const origin = options.localhost
      ? `http://127.0.0.1:${port}`
      : options.tunnelUrl
        ? publicOrigin(options.tunnelUrl)
        : await (tunnel = startTunnel(port)).url;
    host.setOrigin(origin);
    if (!options.localhost) {
      let reachable = false;
      for (let attempt = 0; attempt < 30; attempt++) {
        try {
          const response = await fetch(`${origin}/_octonode/ping`, {
            signal: AbortSignal.timeout(3000),
            redirect: "error",
          });
          if (response.ok && (await response.text()) === host.challenge) {
            reachable = true;
            break;
          }
        } catch {}
        await delay(2000);
      }
      if (!reachable)
        throw new Error("Tunnel URL does not reach this app server; check DNS or your custom tunnel's local port");
    }
    const rebuild = () => {
      buildTask = buildTask.then(async () => {
        if (closed) return;
        try {
          source = readAppSource(root);
          const built = await buildAppProject(
            root,
            origin.startsWith("https:") ? origin : "https://development.example",
          );
          if (closed) return;
          const web = "webDirectory" in built ? built.webDirectory : undefined;
          await development?.sync(source, built, web ?? built.directory);
          let backend;
          if (web) {
            const entry = join(web, "server.cjs");
            delete require.cache[require.resolve(entry)];
            backend = require(entry).default;
            if (typeof backend !== "function") throw new Error("web.entry must default-export a Fetch API handler");
          }
          host.update(source, web ?? built.directory, backend);
          process.stderr.write("App rebuilt\n");
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          host.fail(message);
          process.stderr.write(`Build failed: ${message}\n`);
        }
      });
      return buildTask;
    };
    await rebuild();
    if (development && !development.url)
      throw new Error("Workspace preview could not start; see the development error above");
    watcher = watch(root, { recursive: true }, (_event, filename) => {
      const file = String(filename ?? "").replaceAll("\\", "/");
      if (file !== "octonode.app.json" && !file.startsWith("src/")) return;
      clearTimeout(timer);
      timer = setTimeout(() => void rebuild(), 150);
    });
    tunnel?.process.on("exit", () => {
      if (!closed) {
        process.stderr.write("Tunnel stopped; closing app development session\n");
        process.exitCode = 1;
        void close();
      }
    });
    heartbeat = development
      ? setInterval(() => {
          void development.sync().catch((error) => process.stderr.write(`${error.message}\n`));
        }, 60_000)
      : undefined;
    const previewUrl = `${origin}/_octonode/#preview=${host.secret}`;
    process.stdout.write(
      JSON.stringify({
        url: origin,
        previewUrl,
        port,
        studioUrl: development?.url,
        mode: options.localhost ? "localhost" : "tunnel",
      }) + "\n",
    );
    if (options.open !== false) {
      const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
      const openUrl = development?.url ?? previewUrl;
      const args = process.platform === "win32" ? ["/c", "start", "", openUrl] : [openUrl];
      const browser = spawn(command, args, { stdio: "ignore" });
      browser.on("error", () => {});
      browser.unref();
    }
    return { ...host, close, origin, previewUrl, rebuild };
  } catch (error) {
    await close();
    throw error;
  }
}

export async function serveApp(directory: string, port: number) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("Port must be an integer from 0 to 65535");
  const root = resolve(directory);
  const web = existsSync(join(root, "octonode-web.json")) ? root : join(root, "dist/web", readAppSource(root).id);
  const app = verifyWebBuild(web);
  if (app.hosting !== "self-hosted") throw new Error("Expected a self-hosted web build");
  const backend = require(join(web, "server.cjs")).default;
  if (typeof backend !== "function") throw new Error("web.entry must default-export a Fetch API handler");
  const source = {
    apiVersion: "octonode.app/v1" as const,
    id: "web",
    name: "App",
    version: "1.0.0",
    extensions: app.extensions.map((extension) => ({
      id: extension.id,
      target: extension.target,
      entry: `src/${extension.id}.tsx`,
    })),
  };
  const host = createAppServer({ port, source, development: false });
  const actualPort = await host.listen();
  host.setOrigin(app.applicationUrl);
  host.update(source, web, backend);
  process.stdout.write(`Serving ${app.applicationUrl} on port ${actualPort}\n`);
  const close = async () => {
    process.off("SIGINT", stop);
    process.off("SIGTERM", stop);
    await host.close();
  };
  const stop = () => {
    void close();
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  return { ...host, close, port: actualPort };
}
