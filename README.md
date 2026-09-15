# Octonode Devtools

Type-safe access to the public Octonode API through the `@octonode/sdk` package and the
`octonodes` command-line client. Both are generated from the same developer OpenAPI contract,
use `https://api.octonode.dev` by default, and enforce the permissions of the supplied user or
API token.

Requires Node.js 24 or newer.

## Packages

| Package | Use it when |
| --- | --- |
| `@octonode/sdk` | A TypeScript or JavaScript application needs typed Octonode API calls. |
| `@octonode/cli` | A developer, script, or CI job needs the same API from a terminal. |

Only compiled `dist` files, package metadata, and package README files are published. Source,
tests, generation scripts, and repository configuration are not included in the npm packages.

## SDK

### Install

```sh
npm install @octonode/sdk
```

### Create a client

```ts
import { createClient } from "@octonode/sdk";

const octonode = createClient(process.env.OCTONODE_TOKEN!);
const projects = await octonode.projects.api.get();
```

`createClient` is the short form. The class can also be constructed directly:

```ts
import { OctonodeClient } from "@octonode/sdk";

const octonode = new OctonodeClient(process.env.OCTONODE_TOKEN!);
```

The client stores the base URL, bearer token, and shared headers once. Every generated operation
under that instance uses the same configuration.

### URL and headers

The default API URL is exported as `OCTONODE_API_URL`. Override it for self-hosting or local
development and add headers when an integration needs request metadata:

```ts
import { createClient, OCTONODE_API_URL } from "@octonode/sdk";

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

| Credential | Intended use |
| --- | --- |
| Supabase user access token | Interactive calls as the signed-in Studio user. |
| Personal token (`octo_pat_`) | Local developer tools acting as one account. |
| Service token (`octo_svc_`) | Trusted backend or CI access to one workspace. |
| Public token (`octo_pub_`) | Intentionally public browser data-table reads from allowed origins. |
| Agent token (`octo_agent_`) | Scoped headless collaboration or agent access. |

Never put a personal, service, or agent token in browser code. A public token is intentionally
limited, but its allowed-origin check is not a replacement for keeping private data private.

## CLI

The CLI is a thin wrapper over the same generated SDK. It needs no local Octonode checkout.

### Run or install

Run without installing:

```sh
npx --yes @octonode/cli@latest --help
```

Or install it globally:

```sh
npm install --global @octonode/cli
octonodes --help
```

The npm package is `@octonode/cli`; the installed command is `octonodes` because the unscoped
`octonode` command name is already in use.

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

Call an operation by its SDK path and pass its generated input as JSON:

```sh
octonodes projects.api.get

octonodes projects.api.projectId.get \
  --input '{"path":{"projectId":"project-id"}}'

octonodes workflows.api.workflowId.run.post \
  --input '{"path":{"workflowId":"daily-report"},"body":{}}'
```

Normal responses are formatted JSON. Streaming operations, including workflow runs and execution
events, are consumed to completion and printed as one JSON value per line.

Use a different API deployment with either form:

```sh
octonodes projects.api.get --base-url http://localhost:4000
OCTONODE_URL=http://localhost:4000 octonodes projects.api.get
```

### Logout

```sh
octonodes logout
```

Logout revokes the saved Supabase refresh session and removes local credentials. Static API
tokens must still be revoked in Studio. The command cannot unset `OCTONODE_TOKEN` in the parent
shell.

### CLI environment variables

| Variable | Behavior |
| --- | --- |
| `OCTONODE_TOKEN` | Overrides all saved login credentials. |
| `OCTONODE_URL` | Overrides the default `https://api.octonode.dev`. |
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

Merges to `main` that change either package run the npm publish workflow. It verifies the repo,
publishes `@octonode/sdk` first, then publishes `@octonode/cli` with npm provenance. The repository
owner must add the `NPM_TOKEN` GitHub Actions secret before the first publish. No npm credential is
stored in this repository.

The Octonode repository also needs `DEVTOOLS_REPO_TOKEN` so its OpenAPI sync workflow can open and
auto-merge generated PRs here.

## License

MIT
