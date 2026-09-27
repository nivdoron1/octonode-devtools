import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync, lstatSync } from "node:fs";
import { join, resolve } from "node:path";
import { APP_SOURCE } from "./constants";
import { appManifest, readAppSource } from "./source";
import type { AppSource } from "./types";

const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
function extensionCode(target: "app.page" | "workspace.block") {
  return `import { defineExtension, Section } from "@octonodes/ui-extensions/react";
import { getAppSession } from "@octonodes/ui-extensions";
export default defineExtension(${JSON.stringify(target)}, function Notice() {
  return <Section title="Workspace notice">{getAppSession().configuration.message || "Welcome to the workspace"}</Section>;
});
`;
}
export function createApp(name: string, version: string, template = "extension"): string {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) throw new Error("App name must be lowercase alphanumeric/dash");
  if (!["extension", "full"].includes(template)) throw new Error("Choose --template extension or full");
  const root = resolve(name);
  mkdirSync(root);
  try {
    mkdirSync(join(root, "src/extensions"), { recursive: true });
    mkdirSync(join(root, "tests"));
    writeFileSync(
      join(root, APP_SOURCE),
      json({
        apiVersion: "octonode.app/v1",
        id: name,
        name,
        version: "0.1.0",
        ...(template === "full" ? { web: { entry: "src/server.ts" } } : {}),
        ...(template === "extension"
          ? { settings: [{ id: "message", label: "Message", defaultValue: "Welcome to the workspace" }] }
          : {}),
        extensions: [{ id: "notice", target: "workspace.block", entry: "src/extensions/notice.tsx" }],
      }),
    );
    writeFileSync(join(root, "src/extensions/notice.tsx"), extensionCode("workspace.block"));
    if (template === "full")
      writeFileSync(
        join(root, "src/server.ts"),
        `// Export a Fetch API handler. app dev and app serve adapt it to Node HTTP.
import { connectAppServer } from "@octonodes/ui-extensions/app/server";
export default async function handle(request: Request): Promise<Response> {
  const path = new URL(request.url).pathname;
  if (path === "/api/context") {
    const appId = process.env.OCTONODE_APP_ID;
    const baseUrl = process.env.OCTONODE_API_URL;
    if (!appId || !baseUrl) return new Response("App identity is not configured", { status: 503 });
    try {
      const token = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
      const app = await connectAppServer(token, { appId, baseUrl });
      return Response.json({ workspace: app.workspace });
    } catch { return new Response("App session required", { status: 401 }); }
  }
  if (path === "/api/hello") return Response.json({ message: "Hello from your app backend" });
  if (path !== "/") return new Response("Not found", { status: 404 });
  return new Response(\`<!doctype html><html><head><meta charset="utf-8"><title>My Octonode app</title></head>
<body><h1>My Octonode app</h1><p id="message" role="status">Loading…</p>
<script>const bearer = new URLSearchParams(location.hash.slice(1)).get('octonode_session');
history.replaceState(null, '', location.pathname + location.search);
const output = document.getElementById('message');
if (!bearer) output.textContent = 'Open this app from Octonode Apps to connect your workspace.';
else fetch('/api/context', {headers:{authorization:'Bearer '+bearer}}).then(async response=>{
  if(!response.ok) throw Error('Your session expired or access was revoked. Reopen this app from Octonode Apps.');
  const data=await response.json(); output.textContent='Connected to '+data.workspace.kind+':'+data.workspace.id;
}).catch(error=>output.textContent=error.message);</script></body></html>\`, { headers: { "content-type": "text/html; charset=utf-8" } });
}
`,
      );
    writeFileSync(
      join(root, "package.json"),
      json({
        name,
        private: true,
        type: "module",
        engines: { node: ">=24" },
        scripts: {
          dev: "octonodes app dev",
          ...(template === "full" ? { start: "octonodes app serve" } : {}),
          build: "tsc --noEmit && octonodes app build",
          test: "npm run build && node --test tests/*.test.cjs",
        },
        dependencies: { "@octonodes/ui-extensions": version, react: "^19.0.0", "react-dom": "^19.0.0" },
        devDependencies: {
          "@octonodes/cli": version,
          typescript: "5.9.3",
          "@types/react": "^19.0.0",
          "@types/node": "^24.0.0",
        },
      }),
    );
    writeFileSync(
      join(root, "tsconfig.json"),
      json({
        compilerOptions: {
          target: "ES2021",
          module: "ESNext",
          moduleResolution: "Bundler",
          jsx: "react-jsx",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
        },
        include: ["src/**/*.ts", "src/**/*.tsx"],
      }),
    );
    writeFileSync(join(root, ".gitignore"), "node_modules/\ndist/\n.env\n.env.*\n");
    writeFileSync(
      join(root, "tests/app.test.cjs"),
      `const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { createHash } = require("node:crypto");
test("release bundles match the manifest", () => {
  const root = ${JSON.stringify(`dist/apps/${name}`)};
  const { plugin } = JSON.parse(readFileSync(root + "/octonode.json", "utf8"));
  assert.equal(plugin.app.hosting, ${JSON.stringify(template === "full" ? "self-hosted" : "extension-only")});
  assert.ok(plugin.app.extensions.length);
  for (const extension of plugin.app.extensions) {
    const bytes = readFileSync(${JSON.stringify(template === "full" ? `dist/web/${name}/extensions/` : `dist/apps/${name}/extensions/`)} + extension.id + ".js");
    assert.equal(extension.sha256, "sha256:" + createHash("sha256").update(bytes).digest("hex"));
  }
});
`,
    );
    writeFileSync(
      join(root, "README.md"),
      `# ${name}

Run npm install, then npm run dev. Use --use-localhost to skip the HTTPS tunnel. Run npm test to validate the release. Edit src/extensions/notice.tsx and octonode.app.json.
Add a page with: octonodes app extension add overview --target app.page
Build: npm run build
Validate: octonodes app validate dist/apps/${name}

${template === "full" ? "Full app: edit src/server.ts (default-export a Fetch API handler). Set web.applicationUrl in octonode.app.json before release builds, or use app build --app-url https://your-host.example. Deploy dist/web/" + name + " with Node 24 and run node start.cjs in that directory. Restore the previous web artifact before clean CI builds to retain assets used by older installations. Development uses a temporary tunnel URL and never writes it to configuration. The /api/context example verifies an installation bearer using the SDK. Production requires OCTONODE_APP_ID and OCTONODE_API_URL; workspace development configures them automatically." : ""}

The source descriptor owns IDs, targets, entry paths, settings and version. Builds generate hashes;
do not edit dist/. App pages remain optional. Settings are shared workspace values, not secrets.

Preview in Studio: octonodes login, then octonodes app dev --workspace user:<your-id>.
Publish privately: octonodes app publish --workspace user:<your-id>.
For an update, increment the source version and pass --app-id <id> --revision <current-revision>.
Full apps must deploy their web build to web.applicationUrl before publication.
Install through Studio → Apps, then visit workspace home.
Existing installations stay pinned until an administrator approves an update.
`,
    );
    return root;
  } catch (error) {
    rmSync(root, { recursive: true, force: true });
    throw error;
  }
}
export function addAppExtension(directory: string, id: string, target: string) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) throw new Error("Extension ID must be lowercase alphanumeric/dash");
  if (target !== "workspace.block" && target !== "app.page")
    throw new Error("Choose --target workspace.block or app.page");
  const root = resolve(directory);
  const source = readAppSource(root);
  if (source.extensions.some((extension) => extension.id === id)) throw new Error("Duplicate extension ID");
  const entry = `src/extensions/${id}.tsx`;
  const next: AppSource = { ...source, extensions: [...source.extensions, { id, target, entry }] };
  appManifest(next);
  for (const path of ["src", "src/extensions"]) {
    const directory = join(root, path);
    if (!lstatSync(directory, { throwIfNoEntry: false })) mkdirSync(directory);
    if (!lstatSync(directory).isDirectory() || lstatSync(directory).isSymbolicLink())
      throw new Error("Unsafe extension directory");
  }
  const stage = mkdtempSync(join(root, ".app-edit-"));
  let created = false;
  try {
    writeFileSync(join(stage, APP_SOURCE), json(next));
    writeFileSync(join(root, entry), extensionCode(target), { flag: "wx" });
    created = true;
    renameSync(join(stage, APP_SOURCE), join(root, APP_SOURCE));
  } catch (error) {
    if (created) rmSync(join(root, entry));
    throw error;
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
  return { id, target, entry };
}
