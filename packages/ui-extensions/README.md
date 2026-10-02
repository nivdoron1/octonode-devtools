# Octonode UI extensions

Use `@octonodes/ui-extensions/react` to arrange a plugin node's existing inputs without taking ownership of values, expressions, connections, or saving.

```sh
npm install @octonodes/ui-extensions
```

```tsx
import { defineExtension, InputField, NodeForm, Section } from "@octonodes/ui-extensions/react";

function Inputs() {
  return (
    <NodeForm>
      <Section title="Message">
        <InputField name="channel" />
        <InputField name="text" appearance="multiline" />
      </Section>
    </NodeForm>
  );
}

export default defineExtension("node.inspector.inputs", Inputs);
```

Declare the entry on the node passed to `defineNode`:

```ts
ui: {
  apiVersion: "1",
  renderers: {
    focused: {
      label: "Focused form",
      targets: { "node.inspector.inputs": "src/slack-inputs.tsx" },
    },
  },
}
```

`octonodes plugin build` bundles the entry into the immutable plugin artifact. Octonode loads it only for the exact installed plugin version and renders real host-owned form controls inside an isolated, network-disabled sandbox.

The first public target is `node.inspector.inputs`. Undeclared or omitted inputs fall back to the standard inspector form.

## Native app contributions (v3)

Installed apps can add navbar/navigation/search launchers, panels, Octonode tabs,
workflow node bodies and context-menu actions, task badges/details, document and
editor operations, Git/table/execution views, and settings sections. A hosted app
page or backend is optional. These changes require the SDK and CLI built from the
accompanying branch; they are not published yet.

Views use `defineExtension(target, Component)` and `useExtension(target)` from
`@octonodes/ui-extensions/react`. Actions use `defineAction(target, handler)` from
`@octonodes/ui-extensions`. The CLI supplies `startExtension` or `startAction`,
verifies the definition's target/kind, and hashes each immutable browser bundle.

```tsx
import { defineExtension, useExtension, Section, Button } from "@octonodes/ui-extensions/react";
export default defineExtension("shell.panel", function Assistant() {
  const api = useExtension("shell.panel");
  return (
    <Section title="Claude Code">
      <Button onPress={() => void api.ui.openAssistant("Help with this resource.")}>Open assistant</Button>
    </Section>
  );
});
```

```ts
import { defineAction } from "@octonodes/ui-extensions";
export default defineAction("node.action", async (api) => {
  if (!api.signal.aborted) await api.ui.openAssistant(`Explain node ${api.context.nodeId}`);
});
```

The target context contains resource IDs, revisions, selection ranges, and bounded
metadata batches, never automatic document/file/task bodies. `ui.openPanel`
opens an own declared view; `ui.openAssistant` hands off to the existing native
assistant and its authorized tools. `tabs.list/update/undo` operate on registered
personal layout groups with revision checks. `edits.propose` opens native review
for a captured file/document draft; native Save owns persistence. Mutating host
commands require recent native user interaction. No raw filesystem/process or
private Studio API access is granted.

Node views and task badges return display-only sections named for captured IDs,
using one sandbox per canvas/task view and at most 100 resources. Other views can
use host-owned controls. An action has a captured invocation ID and abort signal;
it completes automatically and has a sixty-second deadline. Legacy node input
extensions still use protocol v1; native app contributions use protocol v2.

The full target catalog, runnable example, permissions, limits, and actual native
screenshots are in the engine's native extensions guide (`docs/app-extensions/README.md` in the engine checkout).
When using a local engine checkout, open `docs/app-extensions/README.md` for the
branch version. The older examples below describe the separate v1/v2 contracts.

## Extension-only apps

Apps can contribute only a workspace block; a page and backend are optional. Use the same
`defineExtension` / `startExtension` SDK with `workspace.block` or `app.page` and bundle as a
browser IIFE. Select **Extension only** in Partner and upload the JavaScript. Octonode stores
immutable bytes and checks the digest at publication and launch. The static sandbox has no
direct network access; the scoped host bridge below provides approved project actions.

Declare shared string settings in the v2 manifest and read them through
`getAppSession().configuration`. Customers configure or disable the app under its installation
settings. Blocks appear in workspace home; an `app.page` or self-hosted web app
can have an Open app link.
See `examples/workspace-notice-app` and `docs/plugins.md` in the engine repository.

## Self-hosted apps

This is also the SDK selected for Octonode's developer-authored app extensions. The engine owns its source in `packages/ui-extensions`; `scripts/sync-plugin-sdk.mjs` synchronizes the public package into `octonode-devtools`. Do not create a second app UI SDK.

Legacy self-hosted app targets are `app.page` and `workspace.block`. Register an app in Partner → Apps, publish its HTTPS application URL and extension bundle digests, then install it from Studio → App marketplace. Plugin marketplace remains dedicated to executable node plugins.

App controls use the same host design system: `NodeForm`, `Section`, `Button`, and `TextField`. `InputField` is only for node inspectors. Bundle your entry as a browser IIFE, including React and this SDK, and call `startExtension`:

```tsx
import { useState } from "react";
import { getAppSession } from "@octonodes/ui-extensions";
import { defineExtension, startExtension, NodeForm, Section, Button, TextField } from "@octonodes/ui-extensions/react";

function App() {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  async function save() {
    try {
      const session = getAppSession();
      const response = await fetch("https://your-app.example/notes", {
        method: "POST",
        headers: { authorization: `Bearer ${session.token}`, "content-type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (!response.ok) throw new Error("Save failed");
      setStatus("Saved");
    } catch {
      setStatus("Could not save. Reopen the app and try again.");
    }
  }
  return (
    <NodeForm>
      <Section title="Project notes">
        <TextField label="Note" value={note} onChange={setNote} />
        <Button onPress={() => void save()}>Save note</Button>
        {status}
      </Section>
    </NodeForm>
  );
}
startExtension(defineExtension("app.page", App));
```

Host the compiled JavaScript with CORS enabled for the Studio origin. Hash the exact response bytes with SHA-256 and publish the prefixed digest (`sha256:…`). Redirects and bundles larger than 2 MiB are rejected. The hidden iframe has an opaque origin: your backend must accept CORS `Origin: null` for authenticated SDK requests; never use Origin as authorization. Its CSP allows connections only to the registered application origin. Octonode credentials and parent DOM access are unavailable.

The five-minute `octo_app_` bearer is specific to the app installation, approved version, and opening user. Your backend must verify it on **every request** with `GET https://octonodes.com/api/apps/runtime/session`, then check that the returned `appId` equals your registered app ID. Use the verified workspace/user identity rather than values supplied by the browser. Never log the bearer or cache verification. Uninstall, consent changes, session expiry, and removed membership revoke subsequent access.

## Hosted pages and routing

Use `connectHostedApp()` once when the page mounts, subscribe to its snapshot, and
call `dispose()` on unmount. Studio displays the hosted page inline and delivers
short-lived sessions through an origin-checked, window-bound handshake. Tokens stay
in memory. `app.fetch("/api/projects")` sends the bearer only to your own backend;
that backend must still verify it with `connectAppServer` on every request.

For React apps, wrap the workspace UI in `OctonodeAppProvider` from
`@octonodes/ui-extensions/app/react`. It verifies `/api/context` before rendering
children. Pass every page route in `navigation`, including the overview (`/`), to
display them in Studio's app sidebar. Studio does not discover routes from your
hosting provider or browser router. An app can render its own top navbar inside
the provider; this does not replace sidebar registration. The generated React
app keeps its navbar off by default; render `<App showNavbar />` to enable it.
The generated server verifies this route with `connectAppServer`. A direct visit
without a session shows a translated access landing screen and no workspace UI.
The provider also shows connecting, expired-session, and verification-error states.
Customizing this UI does not replace backend session and installation checks.

In the Octonode source checkout, preview the screen with
`yarn workspace @octonode/ui-extensions dev` on port 5185, then open `/dev/` in your browser.
Use `?state=expired`, `?state=connecting`, or `?state=error` to preview the other states.
With that preview running, run `node --test packages/ui-extensions/tests/app-access.test.mjs`
to check mobile reflow, private-content protection, and recovery after a refreshed token.

```ts
import { connectHostedApp } from "@octonodes/ui-extensions/app";
const app = connectHostedApp();
const unsubscribe = app.subscribe(() => render(app.getSnapshot()));
app.navigate("/products?sort=name");
// On unmount: unsubscribe(); app.dispose();
```

Normal `history.pushState`, `replaceState`, and back/forward navigation work with
browser routers. Embedded paths appear in Studio’s `appPath` query parameter;
standalone pages use their own URL. Serve your app shell for nested page routes.
Do not use Studio’s `/studio/apps/...` path as your app router basename.

Development starts with zero data grants. Explicit administrator consent selects
actions and projects for one hour; heartbeats extend only the ten-minute idle
session, not the consent. Source edits on the same host retain consent; host or
action changes clear it. See the [development guide](https://playbook.octonodes.com/docs/apps/development).

The hosted page's HTML and static assets must be loadable before the iframe session handoff. Keep private workspace content behind the provider and private backend routes behind bearer verification. App backends can use `POST /api/apps/runtime/data` for consented project/table/row operations, and `POST /api/apps/runtime/executions` on the cloud gateway for workflow execution. Neither credential works as a general Octonode login. See the engine’s `docs/plugins.md` for request examples.

For legacy self-hosted v1 apps, developers host app backends and versioned extension assets themselves. Octonode-managed app hosting is reserved for a future paid service. App release metadata pins extension URLs and SHA-256 digests; publishing metadata does not deploy a backend.

## Project and workflow access

Installed `app.page` and `workspace.block` extensions can use the host bridge without a developer backend. It verifies the live installation, actor, and project grant on every action. A project-specific host can supply its current project; workspace-wide surfaces select a project automatically only when exactly one project is granted.

```ts
import { connectApp } from "@octonodes/ui-extensions/app";

const app = await connectApp();
const project = app.project ?? app.forProject(chosenProjectId);
const products = await project.tables.rows.list("products");
const run = await project.wf.run("sync-products", { source: "app" });
```

`app.projects` lists the granted project IDs for a project picker. `app.project` is undefined when no project is granted or several are granted without a current project. `forProject(id)` rejects ungranted IDs locally; Octonode still checks current grants on every request. `wf.run` queues a workflow and returns its execution summary. Pass an `idempotencyKey` option when retrying the same action.

A developer-hosted backend can use the same project API after verifying the browser's app bearer. Configure the API URL and your own registered app ID on the server; never accept either from an incoming request.

```ts
import { connectAppServer } from "@octonodes/ui-extensions/app/server";

const app = await connectAppServer(bearer, {
  appId: process.env.OCTONODE_APP_ID!,
  baseUrl: process.env.OCTONODE_API_URL!,
});
const project = app.project ?? app.forProject(chosenProjectId);
const products = await project.tables.rows.list("products");
```

The backend helper verifies the bearer on each `connectAppServer` call and uses that bearer only for the app runtime endpoints. Sessions expire after five minutes; background work requires a separately approved installation service identity.

## End-to-end app guides

The public Playbook is the source for the complete authoring path:
[quickstart](https://playbook.octonodes.com/docs/apps/quickstart),
[project configuration](https://playbook.octonodes.com/docs/apps/configuration),
[SDK imports and permissions](https://playbook.octonodes.com/docs/apps/sdk),
[hosting](https://playbook.octonodes.com/docs/apps/hosting), and
[publishing and updates](https://playbook.octonodes.com/docs/apps/publishing).
The CLI scaffold supplies a runnable extension-only or full app example.
