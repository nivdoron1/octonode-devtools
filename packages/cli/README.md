# @octonodes/cli

Command-line access to the public [Octonode cloud API](https://octonodes.com/api/docs). The CLI
wraps `@octonodes/sdk`, so every generated SDK operation is available without writing TypeScript.

## Create and publish plugins

```sh
octonodes plugin create my-integrations
cd my-integrations
npm install
npm test
octonodes plugin validate dist/plugins/my-integrations
```

Define one plugin in `octonode.plugin.ts` using `@octonodes/sdk/plugin`.
`octonodes plugin nodes` generates typed handles in `octonode.nodes.ts`; add
`--check` to detect drift. `octonodes plugin build` regenerates local handles,
type-checks definitions, and creates `dist/plugins/<id>`. `octonodes plugin test <directory> <node-id> --input
'{...}'` invokes a built node and reports failures with a nonzero exit code.

Set `scope: ["public"]` in the definition for community discovery, rebuild, then:

```sh
octonodes login
octonodes plugin publish dist/plugins/my-integrations --registry https://your-marketplace.example
```

Use `OCTONODE_MARKETPLACE_URL` to save the registry endpoint. Publishing uploads
the built artifact through the existing marketplace protocol; it never publishes
to npm. `OCTONODE_MARKETPLACE_TOKEN` overrides normal CLI authentication. Use
`--org` and `--team` for organization/group scopes. Each plugin has an independent
version, and unchanged build hashes are required before upload.

## Run

Use it directly with `npx`:

```sh
npx @octonodes/cli --help
```

Or install it globally. The installed command is `octonodes`:

```sh
npm install --global @octonodes/cli
octonodes --version
```

## Sign in

The default login opens GitHub authentication in your browser and signs in as the same user as
Octonode Studio:

```sh
octonodes login
```

If the browser cannot open, visit the URL printed by the command. The CLI receives the result on a
temporary loopback callback, stores the refreshable session in `~/.octonode/session.json`, and
refreshes expired access tokens automatically.

For terminal-only login, request an email code:

```sh
octonodes login --email you@example.com
```

You can also save an existing personal, service, public, or agent API token:

```sh
octonodes login --token octo_pat_...
```

For CI and temporary shell sessions, set `OCTONODE_TOKEN` instead of saving a login:

```sh
export OCTONODE_TOKEN=octo_svc_...
octonodes projects.api.get
```

Authentication is resolved in this order: `OCTONODE_TOKEN`, a saved API token, then a saved Studio
session.

## Find operations

List every operation or filter by name:

```sh
octonodes operations
octonodes operations projects
octonodes operations workflows
```

Operation names follow the SDK property path and HTTP method. For example,
`GET /api/projects/{projectId}` becomes `projects.api.projectId.get`. Use the
[API reference](https://octonodes.com/api/docs) to find endpoints and their parameters.

## Call the API

Pass path parameters, query parameters, and request bodies together as JSON through `--input`:

```sh
# List projects
octonodes projects.api.get

# Read one project
octonodes projects.api.projectId.get \
  --input '{"path":{"projectId":"project_123"}}'

# List runs with query parameters
octonodes runs.api.get \
  --input '{"query":{"workflowId":"daily-report","limit":20}}'

# Search project knowledge
octonodes knowledge.api.search.post \
  --input '{"query":{"workspace":"acme","project":"support"},"body":{"query":"refund policy","topK":5}}'

# Cancel an execution
octonodes executions.api.runId.cancel.post \
  --input '{"path":{"runId":"run_123"}}'
```

Normal responses are printed as formatted JSON. Server-sent event operations print one JSON value
per line, which works well with `jq` and shell pipelines:

```sh
octonodes workflows.api.workflowId.run.post \
  --input '{"path":{"workflowId":"daily-report"},"body":{"input":{"date":"2026-09-18"}}}' \
  | jq -c .
```

Run `octonodes <operation> --help` for the accepted flags. The exact input shape for each operation
is defined by the exported TypeScript types in `@octonodes/sdk`. For workflow behavior and setup,
see the [Playbook documentation](https://playbook.octonodes.com/docs); for shared examples, browse
the [Octonode community](https://community.octonodes.com/community).

## Configuration

| Variable | Purpose |
| --- | --- |
| `OCTONODE_TOKEN` | Overrides every saved login. |
| `OCTONODE_URL` | Overrides `https://api.octonode.dev`. |
| `OCTONODE_CONFIG_DIR` | Overrides the default `~/.octonode` directory. |

Use `--base-url <url>` to override the API URL for one login or API command:

```sh
octonodes projects.api.get --base-url http://localhost:4000
```

## Log out

```sh
octonodes logout
```

Logout revokes a saved Studio refresh session and removes saved CLI credentials. Static API tokens
must still be revoked in Studio. The command cannot unset `OCTONODE_TOKEN` from your shell.

Saved files and their parent directory use user-only permissions. Keep service and personal tokens
out of shell history, logs, and source control.

## Documentation

- [API reference](https://octonodes.com/api/docs)
- [Playbook documentation](https://playbook.octonodes.com/docs)
- [Octonode community](https://community.octonodes.com/community)

## SDK

Use [`@octonodes/sdk`](https://www.npmjs.com/package/@octonodes/sdk) for typed application code and
direct access to the same API operations.
