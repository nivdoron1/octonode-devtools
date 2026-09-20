---
name: octonode-plugin-author
description: Create, build, validate, test, and publish typed Octonode workflow plugins. Use when adding reusable workflow nodes, adapting an npm package, exporting a workflow, or editing octonode.plugin.ts.
---

# Octonode Plugin Author

Build workflow-runtime plugins with the typed devtools SDK. This is separate from the AI-client plugin
that packages this skill and the hosted MCP connection.

## Workflow

1. Inspect the project and `packages/sdk/PLUGINS.md` before changing a plugin.
2. Start a local plugin with `octonodes plugin create NAME`, or use the existing package root.
3. Keep discovered handles in generated `octonode.nodes.ts` and authored distribution metadata in
   the root `octonode.plugin.ts`.
4. Implement handlers in ordinary source files and select them with `defineNode` from
   `@octonodes/sdk/plugin`.
5. Run:

   ```bash
   octonodes plugin nodes
   octonodes plugin build
   octonodes plugin validate dist/plugins/PLUGIN_ID
   octonodes plugin test dist/plugins/PLUGIN_ID NODE_ID --input '{}'
   ```

6. Publish only after explicit approval with
   `octonodes plugin publish dist/plugins/PLUGIN_ID --registry URL`.

## Contracts

- `octonode.plugin.ts` is the authoring boundary; `octonode.yml` in `dist/plugins/PLUGIN_ID` is the
  generated installation artifact. Legacy JSON/YAML manifests remain readable but are not the default
  authoring format.
- Use stable lowercase public IDs and JSON-compatible bounded inputs/outputs.
- Keep stdout reserved for the single Octonode IPC response. Write logs to stderr.
- Declare permissions, environment names, and credential connections; never place secret values in
  source, definitions, generated artifacts, tests, or prompts.
- Keep commands and assets relocatable inside the built plugin.
- Read before changing generated inventories. Use `octonodes plugin nodes --check` in CI.
- Add the smallest focused test for non-trivial behavior. Do not publish, install into a project, or
  call external services without the user's explicit request.

For an upstream npm adapter, use `octonodes plugin from-npm` and bind SDK clients through declared
connections. For a saved workflow, use `octonode plugin from-workflow` before editing the typed
definition. Do not mix unrelated execution sources in one plugin package.
