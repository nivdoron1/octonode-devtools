# @octonodes/sdk

Generated TypeScript client for the Octonode cloud API.

```sh
npm install @octonodes/sdk
```

```ts
import { createClient } from "@octonodes/sdk";

const octonode = createClient(process.env.OCTONODE_TOKEN!);

const projects = await octonode.projects.api.get();
```

The URL defaults to `https://api.octonode.dev`. Override it or add headers through options:

```ts
const octonode = createClient(token, {
  url: "http://localhost:4000",
  headers: { "x-client-name": "my-integration" },
});
```

`OctonodeClient` is also exported for direct construction as
`new OctonodeClient(token, url?, headers?)`.

Use `octo_pub_` tokens only for intentionally public browser table reads. Keep
`octo_svc_` service tokens and `octo_pat_` personal tokens in backend or local
environments. The API continues to enforce every token's scopes and workspace access.

All supported developer API operations are available by URL path, followed by the HTTP method. For example,
`GET /api/projects/{projectId}` is `octonode.projects.api.projectId.get({ path: { projectId } })`.
