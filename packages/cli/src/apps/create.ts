import { NODE_ENGINE_RANGE } from "@octonodes/sdk/plugins";
import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync, lstatSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { join, resolve } from "node:path";
import { APP_SOURCE } from "./constants";
import { appManifest, readAppSource } from "./source";
import type { AppSource } from "./types";
import { appCss, welcomeHtml, welcomeReact } from "./welcome";
import {APP_ACTION_TARGETS,APP_VIEW_TARGETS,type ContributionApp} from "@octonodes/sdk/plugins";

const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
function extensionCode(target: ContributionApp["extensions"][number]["target"]) {
  if((APP_ACTION_TARGETS as readonly string[]).includes(target)) return `import {defineAction} from "@octonodes/ui-extensions";\nexport default defineAction(${JSON.stringify(target)}, async api => { await api.ui.openAssistant("Explain this selection and suggest improvements."); });\n`;
  if(target === "node.view") return `import {defineExtension,Section,useExtension} from "@octonodes/ui-extensions/react";\nexport default defineExtension("node.view",function Nodes(){const api=useExtension("node.view");return <>{api.context.nodes?.map(node=><Section key={node.id} title={node.id}>{node.label || node.id}</Section>)}</>;});\n`;
  if(target === "task.card.badge") return `import {Fragment} from "react";\nimport {defineExtension,Section,useExtension} from "@octonodes/ui-extensions/react";\nexport default defineExtension("task.card.badge",function Badges(){const api=useExtension("task.card.badge");return <Fragment>{api.context.tasks?.map(task=><Section key={task.itemId} title={task.itemId}>Ready for review</Section>)}</Fragment>;});\n`;
  if(target !== "workspace.block" && target !== "app.page") return `import {defineExtension,Section,Button,useExtension} from "@octonodes/ui-extensions/react";\nexport default defineExtension(${JSON.stringify(target)},function Tool(){const api=useExtension(${JSON.stringify(target)});return <Section title="Workspace assistant"><Button onPress={()=>void api.ui.openAssistant("Help me with this workspace.")}>Open assistant</Button></Section>;});\n`;
  return `import { defineExtension, Section } from "@octonodes/ui-extensions/react";
import { getAppSession } from "@octonodes/ui-extensions";
export default defineExtension(${JSON.stringify(target)}, function Notice() {
  return <Section title="Workspace notice">{getAppSession().configuration.message || "Welcome to the workspace"}</Section>;
});
`;
}
export function createApp(name: string, version: string, template = "full", platform: string | undefined = template === "full" ? "vite" : undefined): string {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) throw new Error("App name must be lowercase alphanumeric/dash");
  if (!["extension", "full"].includes(template)) throw new Error("Choose --template extension or full");
  if (platform && !["plain", "vite", "next"].includes(platform)) throw new Error("Choose --platform plain, vite or next");
  if (platform && template !== "full") throw new Error("--platform requires --template full");
  const framework = platform === "vite" || platform === "next";
  const appId = randomUUID();
  const root = resolve(name);
  mkdirSync(root);
  try {
    mkdirSync(join(root, "src/extensions"), { recursive: true });
    mkdirSync(join(root, "tests"));
    writeFileSync(
      join(root, APP_SOURCE),
      json({
        apiVersion: template === "extension" ? "octonode.app/v2" : "octonode.app/v1",
        id: appId,
        name,
        version: "0.1.0",
        ...(template === "full" ? { web: { entry: "src/server.ts", ...(platform ? { platform } : {}) } } : {}),
        ...(template === "extension"
          ? { settings: [{ id: "message", label: "Message", defaultValue: "Welcome to the workspace" }] }
          : {}),
        extensions: template === "extension" ? [{ id: "assistant", target: "shell.panel", title:"Workspace assistant",entry: "src/extensions/assistant.tsx" }] : [],
        ...(template === "extension" ? {launchers:[{id:"open-assistant",target:"shell.navbar.action",title:"Workspace assistant",icon:"terminal",opens:"assistant"}]} : {}),
      }),
    );
    if (template === "extension") writeFileSync(join(root, "src/extensions/assistant.tsx"), extensionCode("shell.panel"));
    if (template === "full") {
      if (!framework) writeFileSync(join(root, "src/welcome.html"), welcomeHtml(name));
      if (!framework) writeFileSync(join(root, "src/hosted.ts"), `import { connectHostedApp } from "@octonodes/ui-extensions/app";
const app = connectHostedApp();
const output = document.getElementById("message")!;
let token: string | undefined;
const update = () => {
  const current = app.getSnapshot();
  if (current.status === "expired") output.textContent = "Session expired. Reopen the app from Studio.";
  if (current.status !== "ready" || current.token === token) return;
  token = current.token;
  app.fetch("/api/context").then(async response => {
    if (!response.ok) throw Error("Could not load context (" + response.status + ").");
    const data = await response.json(); output.textContent = "Connected to " + data.workspace.kind + ":" + data.workspace.id;
  }).catch(error => { output.textContent = error.message; });
};
output.textContent = "Open this app from Studio to connect your workspace.";
app.subscribe(update); update();
`);
      writeFileSync(
        join(root, "src/server.ts"),
        `// Export a Fetch API handler. app dev and app serve adapt it to Node HTTP.
import { connectAppServer, AppRequestError } from "@octonodes/ui-extensions/app/server";
${framework ? "" : 'import { readFileSync } from "node:fs";\nimport { join } from "node:path";'}
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
    } catch (error) { return new Response("Could not load app context", { status: error instanceof AppRequestError ? error.status : 502 }); }
  }
  if (path === "/api/projects") {
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
    const appId = process.env.OCTONODE_APP_ID;
    const baseUrl = process.env.OCTONODE_API_URL;
    if (!appId || !baseUrl) return new Response("App identity is not configured", { status: 503 });
    try {
      const app = await connectAppServer(request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "", { appId, baseUrl });
      const ids = [...new Set(app.grants.filter(grant => grant.action === "projects:read").map(grant => grant.projectId))];
      const results = await Promise.allSettled(ids.map(id => app.forProject(id).get()));
      const authError = results.find(result => result.status === "rejected" && result.reason instanceof AppRequestError && result.reason.status === 401);
      if (authError?.status === "rejected") throw authError.reason;
      return Response.json({ projects: results.flatMap(result => result.status === "fulfilled" ? [result.value] : []), failed: results.filter(result => result.status === "rejected").length });
    } catch (error) { return new Response("Could not load granted projects", { status: error instanceof AppRequestError ? error.status : 502 }); }
  }
  if (path === "/api/hello") return Response.json({ message: "Hello from your app backend" });
  if (path !== "/") return new Response("Not found", { status: 404 });
  ${framework ? 'return new Response("Not found", { status: 404 });' : 'return new Response(readFileSync(join(__dirname, "welcome.html"), "utf8"), { headers: { "content-type": "text/html; charset=utf-8" } });'}
}
`,
      );
      if (framework) {
        mkdirSync(join(root, "src/web"), { recursive: true });
        writeFileSync(join(root, "src/web/App.tsx"), welcomeReact(name));
        writeFileSync(join(root, "src/web/welcome.css"), appCss + "\n");
        if (platform === "vite") {
          writeFileSync(join(root, "index.html"), `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name} · Octonode</title></head><body><div id="root"></div><script type="module" src="/src/web/main.tsx"></script></body></html>\n`);
          writeFileSync(join(root, "src/web/main.tsx"), 'import { createRoot } from "react-dom/client";\nimport App from "./App";\nimport "./welcome.css";\ncreateRoot(document.getElementById("root")!).render(<App />);\n');
          writeFileSync(join(root, "vite.config.mjs"), 'export default { build: { outDir: "web-dist" } };\n');
        } else {
          mkdirSync(join(root, "app"));
          writeFileSync(join(root, "app/page.tsx"), 'import App from "../src/web/App";\nexport default App;\n');
          writeFileSync(join(root, "app/layout.tsx"), `import "../src/web/welcome.css";\nexport const metadata = { title: "${name} · Octonode" };\nexport default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }\n`);
          writeFileSync(join(root, "next.config.mjs"), 'export default { output: "export" };\n');
        }
      }
    }
    writeFileSync(
      join(root, "package.json"),
      json({
        name,
        private: true,
        type: "module",
        engines: { node: NODE_ENGINE_RANGE },
        installConfig: { hoistingLimits: "workspaces" },
        scripts: {
          dev: "octonodes app dev",
          ...(template === "full" ? { start: "octonodes app serve" } : {}),
          build: "tsc --noEmit && octonodes app build",
          test: `tsc --noEmit && octonodes app build${template === "full" ? " --app-url https://development.example" : ""} && node --test tests/*.test.cjs`,
        },
        dependencies: { "@octonodes/ui-extensions": version, react: "^19.0.0", "react-dom": "^19.0.0" },
        devDependencies: {
          "@octonodes/cli": version,
          typescript: "5.9.3",
          "@types/react": "^19.0.0",
          ...(platform === "vite" ? { "@types/react-dom": "^19.0.0" } : {}),
          "@types/node": "^20.19.0",
          ...(platform === "vite" ? { vite: "8.3.1" } : {}),
          ...(platform === "next" ? { next: "16.3.6" } : {}),
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
        include: ["src/**/*.ts", "src/**/*.tsx", ...(platform === "next" ? ["app/**/*.tsx"] : [])],
      }),
    );
    writeFileSync(join(root, ".gitignore"), "node_modules/\ndist/\nweb-dist/\n.next/\nout/\n.env\n.env.*\n");
    writeFileSync(
      join(root, "tests/app.test.cjs"),
      `const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { createHash } = require("node:crypto");
test("release bundles match the manifest", () => {
  const root = ${JSON.stringify(`dist/apps/${appId}`)};
  const { plugin } = JSON.parse(readFileSync(root + "/octonode.json", "utf8"));
  assert.equal(plugin.app.hosting, ${JSON.stringify(template === "full" ? "self-hosted" : "extension-only")});
  assert.ok(Array.isArray(plugin.app.extensions));
  for (const extension of plugin.app.extensions) {
    const bytes = readFileSync(${JSON.stringify(template === "full" ? `dist/web/${appId}/extensions/` : `dist/apps/${appId}/extensions/`)} + extension.id + ".js");
    assert.equal(extension.sha256, "sha256:" + createHash("sha256").update(bytes).digest("hex"));
  }
});
`,
    );
    writeFileSync(
      join(root, "README.md"),
      `# ${name}

An Octonode app created by \`octonodes app create\`. ${template === "full" ? "It includes a hosted page and backend. Contributions are optional." : "It includes a panel launched from the Octonode navbar. Add contextual actions and tabs with `app extension add`."}

## Work locally

${template === "full" ? `Yarn workspaces use the generated \`installConfig.hoistingLimits: workspaces\`. Keep it
and run \`yarn install\` at the workspace root. Full React apps verify the
workspace session before showing content and register Overview (\`/\`) and
Projects (\`/projects\`) routes in Studio’s sidebar. The top navbar is optional: render
\`<App showNavbar />\` in \`src/web/main.tsx\` to enable it for Vite, or render
\`<App showNavbar />\` from \`app/page.tsx\` for Next.js. Sidebar registration is always enabled.` : `The extension starter has no hosted page or backend. Its declared navbar launcher
opens a sandboxed panel inside Octonode. Use \`octonodes app targets\` to discover
supported contextual contributions.`}

\`\`\`sh
npm install
npm test
npm run dev
\`\`\`

The CLI opens a live HTTPS preview and downloads a verified tunnel helper on first
use. Development opens a public Quick Tunnel automatically. No Cloudflare account or separate installation is needed. Use
\`octonodes app dev --use-localhost\` for offline UI work.
Edit \`octonode.app.json\` and the generated source files. ${framework ? `The ${platform === "next" ? "Next.js" : "Vite"} welcome page lives in \`src/web/App.tsx\`. ` : ""}The descriptor owns
app identity, version, extension targets and entry files. Do not edit \`dist/\`.
${template === "extension" ? "Add a page with `octonodes app extension add overview --target app.page`." : "Add a contribution with `octonodes app extension add notice --target workspace.block`."}

## Preview and publish in Octonode

\`\`\`sh
octonodes login
octonodes app dev --workspace user:<your-user-id>
npm test
octonodes app validate dist/apps/${appId}
octonodes app publish --workspace user:<your-user-id>
\`\`\`

Use \`team:<id>\` or \`org:<id>\` if that is the publisher workspace. Studio
preview is private and expiring. It starts without project grants; use Studio to explicitly consent to selected development projects for up to one hour. The first publication
returns the registered app ID and revision. Install through **Studio → Apps**;
the extension starter appears as a navbar button that opens its panel. An administrator can change shared settings
or disable an extension-only installation. Shared settings are not secrets.

For updates, change the source version, run \`npm test\`, then publish with
\`--app-id <registered-app-id> --revision <current-revision>\`. Existing
installations stay pinned until an administrator approves an update.

${template === "full" ? `## Host the full app

Edit \`src/server.ts\`, which default-exports a Fetch API handler. Set
\`web.applicationUrl\` in \`octonode.app.json\` to a permanent HTTPS origin
before building and publishing. Add only the \`web.requestedActions\` your
app needs. The generated \`/api/context\` route verifies an installed app
bearer through \`@octonodes/ui-extensions/app/server\`.

${framework ? `The ${platform === "next" ? "Next.js" : "Vite"} page is a native React project. \`octonodes app dev\` builds its static output and serves it together with the Octonode backend. Static export does not support server-only framework features; use \`src/server.ts\` for app API routes.\n\n` : ""}

Publishing registers metadata but does not deploy the backend. After the first
publish returns the app ID, copy the entire \`dist/web/${appId}\` directory
to a Node 20.19+, 22.12+, or newer supported host. Configure HTTPS, \`PORT\`, \`OCTONODE_APP_ID\` and
\`OCTONODE_API_URL\`, then run \`node start.cjs\` from that directory.
Check the public page and every hashed \`/extensions/<hash>.js\` asset
before inviting installation. Restore the previous web artifact before clean
CI builds, or retain older hash-named assets at the host for pinned installs.
The development tunnel URL is temporary and must not be published.

` : ""}## SDK and deployment guides

- [App quickstart](https://playbook.octonodes.com/docs/apps/quickstart)
- [Configuration](https://playbook.octonodes.com/docs/apps/configuration)
- [App SDKs](https://playbook.octonodes.com/docs/apps/sdk)
- [Hosting](https://playbook.octonodes.com/docs/apps/hosting)
- [Publishing and updates](https://playbook.octonodes.com/docs/apps/publishing)
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
  const root = resolve(directory);
  const source = readAppSource(root);
  if(!(APP_VIEW_TARGETS as readonly string[]).includes(target) && !(APP_ACTION_TARGETS as readonly string[]).includes(target)) throw new Error("Unsupported extension target");
  if(source.apiVersion === "octonode.app/v1" && target !== "workspace.block" && target !== "app.page") throw new Error("Upgrade the descriptor to octonode.app/v2 to add contextual targets");
  const contributionTarget=target as ContributionApp["extensions"][number]["target"];
  if (source.extensions.some((extension) => extension.id === id)) throw new Error("Duplicate extension ID");
  const entry = `src/extensions/${id}.tsx`;
  const next: AppSource = { ...source, extensions: [...source.extensions, { id, target:contributionTarget, entry,...(source.apiVersion === "octonode.app/v2" ? {title:id} : {}) }] };
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
    writeFileSync(join(root, entry), extensionCode(contributionTarget), { flag: "wx" });
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
