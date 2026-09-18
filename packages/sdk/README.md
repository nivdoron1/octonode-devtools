# @octonodes/sdk

Typed TypeScript client for the public Octonode cloud API. It is generated from the published
[API contract](https://octonodes.com/api/docs) and includes projects, workflows, executions,
nodes, data tables, plugins, GitHub integration, and workspace operations.

## Install

```sh
npm install @octonodes/sdk
```

## Quick start

```ts
import { createClient } from "@octonodes/sdk";

const octonode = createClient(process.env.OCTONODE_TOKEN!);

const projects = await octonode.projects.api.get();
const project = await octonode.projects.api.projectId.get({
  path: { projectId: projects[0].id },
});

console.log(project.name);
```

The client sends the token as a Bearer credential and throws on non-successful HTTP responses.
Responses and request inputs are inferred from the OpenAPI contract.

## Request inputs

Each operation follows its API path and HTTP method. Parameters use `path`, `query`, and `body`:

```ts
const runs = await octonode.runs.api.get({
  query: { workflowId: "daily-report", limit: 20 },
});

await octonode.knowledge.api.search.post({
  query: { workspace: "acme", project: "support" },
  body: { query: "How are refunds handled?", topK: 5 },
});

await octonode.executions.api.runId.cancel.post({
  path: { runId: "run_123" },
});
```

For example, `GET /api/projects/{projectId}` maps to
`octonode.projects.api.projectId.get({ path: { projectId } })`.

## Streaming operations

Workflow runs and execution events use server-sent events. Iterate over the returned stream:

```ts
const { stream } = await octonode.workflows.api.workflowId.run.post({
  path: { workflowId: "daily-report" },
  body: { input: { date: "2026-09-18" } },
});

for await (const event of stream) {
  console.log(event);
}
```

See the [Playbook documentation](https://playbook.octonodes.com/docs) for workflow concepts,
configuration, and execution guides.

## Configuration

Requests default to `https://api.octonode.dev`. Pass a different URL or shared headers when
creating the client:

```ts
const octonode = createClient(token, {
  url: "http://localhost:4000",
  headers: { "x-client-name": "my-integration" },
});
```

The default URL is exported as `OCTONODE_API_URL`. `OctonodeClient` is also available for direct
construction:

```ts
import { OctonodeClient } from "@octonodes/sdk";

const octonode = new OctonodeClient(token, "https://api.octonode.dev", {
  "x-client-name": "my-integration",
});
```

## Types

All generated request and response types are exported from the package:

```ts
import type {
  GetApiProjectsByProjectIdData,
  GetApiProjectsByProjectIdResponse,
} from "@octonodes/sdk";
```

Your editor can discover the complete API from `OctonodeClient` and show the required input for
each method. The generated type names use the HTTP method followed by the API path; the
[API reference](https://octonodes.com/api/docs) documents the underlying endpoints.

## Tokens

- `octo_pat_`: personal access token for local tools and user-owned integrations.
- `octo_svc_`: service token for trusted backend automation.
- `octo_pub_`: public token for intentionally public browser table reads.
- `octo_agent_`: short-lived credentials issued to running agents.

Keep personal and service tokens out of browser bundles and source control. The API enforces each
token's scopes and workspace access.

## Documentation

- [API reference](https://octonodes.com/api/docs)
- [Playbook documentation](https://playbook.octonodes.com/docs)
- [Octonode community](https://community.octonodes.com/community)

## Related package

Use [`@octonodes/cli`](https://www.npmjs.com/package/@octonodes/cli) to call the same operations
from a terminal or shell script.
