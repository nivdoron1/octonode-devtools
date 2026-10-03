# Octonode Devtools

Type-safe access to the public Octonode API through the `@octonodes/sdk` package and the
`octonodes` command-line client. Both are generated from the same developer OpenAPI contract,
use `https://api.octonode.dev` by default, and enforce the permissions of the supplied user or
API token.

Requires Node.js 24 or newer.

## Plugin development

The same SDK also supports offline plugin authoring through `@octonodes/sdk/plugin`.
Define plugins and their nodes in TypeScript; the CLI generates `octonode.yml` and
a standalone artifact from each package root’s `octonode.plugin.ts`. Import generated
handles from `octonode.nodes.ts`; use `octonode.config.ts` for project appearance.

```sh
octonodes plugin create my-integrations
cd my-integrations
npm install
npm test
```

See the [plugin SDK guide](packages/sdk/PLUGINS.md) for typed definitions,
credentials, assets, testing, and marketplace publishing. The plugin contract and
runtime are synced from the main Octonode repository; generated API client files
remain separate.

## Create an app

`octonodes` creates a complete app project. The default is a full Vite app with a hosted page and backend. Use `--template extension`
for a navbar launcher and panel inside Octonode without a backend. Contributions are optional for full apps.
Run `octonodes app targets` to list supported views, actions, and launcher placements;
add a contextual entry with `octonodes app extension add explain-node --target node.action`.
The extension starter uses source descriptor `octonode.app/v2` and builds app manifest v3.
Use the branch-built packages and a matching host until this support is published.

```sh
npm install --global @octonodes/cli
octonodes app create workspace-notice
cd workspace-notice
npm install
npm test
npm run dev
```

The project contains `octonode.app.json`, a React page, a backend, a Projects route, and a
build check. The React page verifies the workspace session before showing content and registers its navigation in Studio. Yarn workspaces use the generated `installConfig.hoistingLimits: workspaces`. `app dev` runs a live preview and automatically provisions a
verified HTTPS tunnel. It needs no Cloudflare account or separate tunnel install.
Use `octonodes app dev --use-localhost` for offline UI work. To preview in a real
workspace, run `octonodes login` and `octonodes app dev --workspace user:<id>`.

```sh
# From the app directory, after signing in:
octonodes app publish --workspace user:<id>
# Install the release in Studio → Apps; extension starters add a navbar button.
```

For a hosted app, start with `octonodes app create inventory-labels --template
full`, set `web.applicationUrl` to a permanent HTTPS origin, build and publish,
then deploy the complete `dist/web/<app-id>` directory to a Node 24
host. The first publish returns `OCTONODE_APP_ID`; set it and
`OCTONODE_API_URL` on the host before inviting installations. Publication does
not deploy the backend. Read the [end-to-end Playbook](https://playbook.octonodes.com/docs/apps),
[CLI app commands](packages/cli/README.md#create-an-app),
[app SDK guide](packages/ui-extensions/README.md#hosted-pages-and-routing),
[native extension API guide](packages/ui-extensions/README.md#native-app-contributions-v3),
[CLI implementation notes](docs/app-cli-plan.md), and
[Shopify CLI comparison](docs/app-cli-shopify-comparison.md).

## Packages

| Package                                                        | Use it when                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [`@octonodes/sdk`](packages/sdk/README.md)                     | A TypeScript or JavaScript application needs typed Octonode API calls.                |
| [`@octonodes/cli`](packages/cli/README.md)                     | A developer, script, or CI job needs the same API from a terminal.                    |
| [`@octonodes/mcp`](packages/mcp/README.md)                     | An MCP client needs remote Octonode tools hosted on Cloudflare Workers.               |
| [`@octonodes/ui-extensions`](packages/ui-extensions/README.md) | Plugin inspector layouts and installed app launchers, panels, tabs, views, and actions. |

Only compiled `dist` files, package metadata, and package README files are published. Source,
tests, generation scripts, and repository configuration are not included in the npm packages.

## SDK

### Install

```sh
npm install @octonodes/sdk
```

### Create a client

```ts
import { createClient } from "@octonodes/sdk";

const octonode = createClient(process.env.OCTONODE_TOKEN!);
const projects = await octonode.projects.api.get();
```

`createClient` is the short form. The class can also be constructed directly:

```ts
import { OctonodeClient } from "@octonodes/sdk";

const octonode = new OctonodeClient(process.env.OCTONODE_TOKEN!);
```

The client stores the base URL, bearer token, and shared headers once. Every generated operation
under that instance uses the same configuration.

### URL and headers

The default API URL is exported as `OCTONODE_API_URL`. Override it for self-hosting or local
development and add headers when an integration needs request metadata:

```ts
import { createClient, OCTONODE_API_URL } from "@octonodes/sdk";

const octonode = createClient(process.env.OCTONODE_TOKEN!, {
  url: process.env.OCTONODE_URL ?? OCTONODE_API_URL,
  headers: {
    "x-client-name": "my-integration",
  },
});
```

The equivalent constructor is:

```ts
const octonode = new OctonodeClient(token, "http://localhost:4000", {
  "x-client-name": "local-development",
});
```

### Call operations

Operations follow the API path and finish with the HTTP method. Path, query, and body values use
the generated `path`, `query`, and `body` objects:

```ts
// GET /api/store/projects
await octonode.projects.api.get();

// GET /api/projects/{projectId}
await octonode.projects.api.projectId.get({
  path: { projectId: "project-id" },
});

// POST /api/workflows/{workflowId}/run
await octonode.workflows.api.workflowId.run.post({
  path: { workflowId: "daily-report" },
  body: {},
});
```

TypeScript checks required inputs and response types from the OpenAPI contract. HTTP failures are
thrown, so applications can handle them with normal `try`/`catch` logic:

```ts
try {
  const identity = await octonode.identity.api.get();
  console.log(identity);
} catch (error) {
  console.error("Octonode request failed", error);
}
```

The package also exports all generated request, response, and schema types.

### Authentication and token types

The SDK does not bypass Octonode authentication or authorization. The API validates the bearer
token, its scopes, workspace membership, optional project binding, expiration, and revocation on
every request.

| Credential                   | Intended use                                                        |
| ---------------------------- | ------------------------------------------------------------------- |
| Supabase user access token   | Interactive calls as the signed-in Studio user.                     |
| Personal token (`octo_pat_`) | Local developer tools acting as one account.                        |
| Service token (`octo_svc_`)  | Trusted backend or CI access to one workspace.                      |
| Public token (`octo_pub_`)   | Intentionally public browser data-table reads from allowed origins. |
| Agent token (`octo_agent_`)  | Scoped headless collaboration or agent access.                      |

Never put a personal, service, or agent token in browser code. A public token is intentionally
limited, but its allowed-origin check is not a replacement for keeping private data private.

## CLI

The CLI is a thin wrapper over the same generated SDK. It needs no local Octonode checkout.
For Claude Code, Codex, Cursor, and compatible agents, see the [agent plugin](octonode-plugin/README.md)
for shared skills and MCP setup.

### Run or install

Run without installing:

```sh
npx --yes @octonodes/cli@latest --help
```

Or install it globally:

```sh
npm install --global @octonodes/cli
octonodes --help
```

The npm package is `@octonodes/cli`; the installed command is `octonodes` because the unscoped
`octonode` command name is already in use.

[CLI installation infrastructure](docs/cli-installation.md) prepares Homebrew, WinGet,
Scoop, Chocolatey, Linux packages, Snap, Docker, and direct installers for a maintainer
to publish. The preparation workflow creates downloadable review artifacts only.

### Login

For an interactive user, browser login is the default:

```sh
octonodes login
```

The command loads the public Supabase configuration from Octonode, opens the existing Studio
GitHub provider, completes a PKCE exchange through a temporary `127.0.0.1` callback, and stores
the refreshable session in `~/.octonode/session.json`. The browser never receives the saved CLI
session. If it cannot open automatically, the CLI prints the URL.

Supabase must allow this redirect pattern:

```text
http://127.0.0.1:*/auth/callback/**
```

For a remote terminal or email-code login:

```sh
octonodes login --email you@example.com
```

For a personal, service, public, or agent API token:

```sh
octonodes login --token "$OCTONODE_TOKEN"
```

Saved credentials use user-only filesystem permissions. Supabase sessions refresh automatically.
For non-interactive automation, set `OCTONODE_TOKEN`; it overrides saved credentials.

### Discover and call operations

List every command or narrow the list with a filter:

```sh
octonodes operations
octonodes operations projects
```

Use `--help` at each level to browse commands, then pass the generated input as JSON:

```sh
octonodes projects --help
octonodes projects api --help
octonodes projects api projectId --help
```

Call an operation by its SDK path:

```sh
octonodes projects api get

octonodes projects api projectId get \
  --input '{"path":{"projectId":"project-id"}}'

octonodes workflows api workflowId run post \
  --input '{"path":{"workflowId":"daily-report"},"body":{}}'
```

Normal responses are formatted JSON. Streaming operations, including workflow runs and execution
events, are consumed to completion and printed as one JSON value per line.

Use a different API deployment with either form:

```sh
octonodes projects api get --base-url http://localhost:4000
OCTONODE_URL=http://localhost:4000 octonodes projects api get
```

### Logout

```sh
octonodes logout
```

Logout revokes the saved Supabase refresh session and removes local credentials. Static API
tokens must still be revoked in Studio. The command cannot unset `OCTONODE_TOKEN` in the parent
shell.

### CLI environment variables

| Variable              | Behavior                                                  |
| --------------------- | --------------------------------------------------------- |
| `OCTONODE_TOKEN`      | Overrides all saved login credentials.                    |
| `OCTONODE_URL`        | Overrides the default `https://api.octonode.dev`.         |
| `OCTONODE_CONFIG_DIR` | Overrides the default `~/.octonode` credential directory. |

Use `-h`, `--h`, or `--help` globally or after a command.

## Development

Install dependencies and verify generated code, types, SDK behavior, authentication, and CLI
behavior:

```sh
corepack enable
yarn install --immutable
yarn check
```

Regenerate the client after replacing `packages/sdk/openapi.json`:

```sh
yarn gen
```

The main Octonode repository filters its internal OpenAPI document to developer-safe operations.
When that contract changes, its sync workflow opens an automated PR here, regenerates the SDK,
and bumps both public packages together.

## Publishing

Publishing is manual and restricted to `nivdoron1`. After merging, use the PR's CLI release
control comment, or **Actions → Publish npm packages → Run workflow** on `main` with its exact
40-character commit SHA. New pushes and merges never publish automatically. The workflow verifies
the repo and publishes missing stable versions of `@octonodes/sdk`, `@octonodes/ui-extensions`,
then `@octonodes/cli`, using short-lived OIDC credentials and npm provenance. Each package must trust
`nivdoron1/octonode-devtools`, workflow `publish.yml`, environment `npm-publish`.
The currently disabled npm workflow must be enabled manually after this change lands.
See [CLI installation and release controls](docs/cli-installation.md) for preparing Homebrew and
other installation channels; those submissions remain manual.

The Octonode repository also needs `DEVTOOLS_REPO_TOKEN` so its OpenAPI sync workflow can open and
auto-merge generated PRs here.

See the [changelog](CHANGELOG.md) for release history.

## License

MIT
