# Plugin contracts


- `octonode.plugin.ts` is the authoring boundary; `octonode.yml` in `dist/plugins/PLUGIN_ID` is the
  generated installation artifact. Legacy JSON/YAML manifests remain readable but are not the default
  authoring format.
- Use stable lowercase public IDs and JSON-compatible bounded inputs/outputs.
- Keep stdout reserved for the single Octonode IPC response. Write logs to stderr.
- Declare permissions, environment names, and credential connections; never place secret values in
  source, definitions, generated artifacts, tests, or prompts.
- Keep commands and assets relocatable inside the built plugin.
- Read before changing generated inventories. Use `octonodes plugin nodes --check` in CI.
- Add the smallest focused test for non-trivial behavior. Publishing, installing into a project,
  and external service calls must stay within the user's authorized scope.

For an npm adapter, create a typed plugin, add the dependency, and bind SDK clients through declared
connections. For a workflow conversion, inspect its source and express the required handlers in the
typed definition. This CLI does not implement `from-npm` or `from-workflow`; do not invent those commands.
Use the bundled `octonode-plugin-manage` skill for consumer installation, updates, removal, and recovery.
