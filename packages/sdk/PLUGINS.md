# Code-first plugins

Install `@octonodes/sdk` and import from `@octonodes/sdk/plugins`. This entry point is
offline: it does not import the API client, compiler, or authentication code.

```ts
import { definePlugin, defineNode } from "@octonodes/sdk/plugins";

export default definePlugin({
  id: "text-tools",
  name: "Text tools",
  version: "1.0.0",
  license: "MIT",
  scope: ["public"],
  nodes: [
    defineNode({
      id: "uppercase",
      label: "Uppercase",
      inputs: {
        type: "object",
        properties: { text: { type: "string" } },
        required: ["text"],
      },
      outputs: {
        type: "object",
        properties: { text: { type: "string" } },
        required: ["text"],
      },
      run: ({ text }) => ({ text: text.toUpperCase() }),
    }),
  ],
});
```

Save this as `plugins/text.plugin.ts`. Put additional plugins in other
`plugins/**/*.plugin.ts` files; each exports one default plugin with a unique ID.
Plugins can import shared project code and installed JavaScript dependencies.
The CLI bundles each entry independently into `dist/plugins/<id>` with a generated
`octonode.yml`, CommonJS runner, package metadata, port documentation, and file hashes.
No extra runtime installation is needed for these bundled artifacts.

```sh
npm install @octonodes/sdk
npm install --save-dev @octonodes/cli
npx octonodes plugin build
npx octonodes plugin validate dist/plugins/text-tools
npx octonodes plugin test dist/plugins/text-tools uppercase --input '{"text":"hello"}'
```

`defineNode` infers handler input/output types from inline JSON Schema types, enum,
object properties, required fields, and array items. Unsupported schemas infer
`unknown`; runtime validation enforces only the SDK's supported keywords. Plain
TypeScript annotations do not generate runtime schemas. Run `tsc --noEmit` for
typechecking; the CLI build bundles code but does not run the TypeScript checker.

Define identity, display, schemas, defaults, permissions, and credential metadata
in code. `definePlugin` generates commands and language metadata. Keep metadata
independent of environment variables, timestamps, and random values; the runner
rejects a definition that differs from the built manifest. Build imports and
executes your definition locally. Only build trusted source.

Use `connections` at plugin level and reference their names in each node:

```ts
// Plugin metadata:
permissions: [{ resource: "secrets", access: "read" }],
connections: {
  crm: { label: "CRM account", fields: { CRM_TOKEN: { label: "API token" } } },
},
// Inside the node:
connections: ["crm"],
```

Credential fields are required and secret by default. Each installer supplies
their own values at runtime. Read `process.env.CRM_TOKEN` inside the handler.
Declare `network:outbound` when making network calls. Permission metadata is not
an OS sandbox; the deployment's execution isolation still applies.

Declare individual project-relative files with `assets: ["data/rules.json"]`.
They retain their paths within the artifact; read them relative to `process.cwd()`.
Parent traversal, symlinks, credential files, and overwriting generated files are
rejected. Native addons and unbundleable dynamic dependencies are not supported.
Code that reads additional files dynamically must declare those assets explicitly.
Do not hardcode credentials: file exclusions cannot detect secrets in source.

## Optional node UI

Install `@octonodes/ui-extensions` and add a node `ui` declaration when the standard
inspector layout is not enough. The CLI bundles each declared browser entry, records
its size and digest, and rejects unsafe or oversized entries. See the
[`@octonodes/ui-extensions` guide](https://github.com/nivdoron1/octonode-devtools/tree/main/packages/ui-extensions#readme) for the React primitives
and manifest example. Octonode still owns values, expressions, connections, and saves.

## Publishing

```sh
octonodes login
export OCTONODE_MARKETPLACE_URL=https://your-marketplace.example
octonodes plugin publish dist/plugins/text-tools
```

Use the existing marketplace endpoint, not the public API-client URL. Publishing
uploads the built manifest and archive through the existing marketplace protocol;
it does not run your plugin or publish an npm package. `--registry` overrides the
endpoint; `OCTONODE_MARKETPLACE_TOKEN` overrides saved login and `OCTONODE_TOKEN`.
Use `--org` / `--team` for the existing organization/group distribution scopes.
Server permissions and namespace ownership remain authoritative.

Scope defaults to `user`. Use `scope: ["public"]` for community discovery. Version
each plugin independently and increment its version before another release.
Publishing checks file hashes and refuses changed or extra files. A normal rebuild
replaces a previous intact generated artifact; modified output is preserved and
must be moved aside before rebuilding. Edit the TypeScript source, not generated YAML.

## Maintainers: one source of truth

`src/plugins/` is generated from the Octonode monorepo's SDK and schema sources.
Do not edit it manually. From the main Octonode checkout, run:

```sh
node scripts/sync-plugin-sdk.mjs /path/to/octonode-devtools
node scripts/sync-plugin-sdk.mjs /path/to/octonode-devtools --check
```

The main repository's SDK sync workflow updates these files alongside OpenAPI,
bumps all public packages once, and runs devtools checks. Server validation uses
the same authoritative schema. The public `/plugins` export does not require an
unpublished `@octonode/*` npm dependency.
