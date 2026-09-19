export const BUILD_RECORD = "octonode-build.json";
export const DEFINITION_FILES = ["octonode.yml", "octonode.yaml", "octonode.json", "octonode.plugin.json"];
export const FORBIDDEN_PART = /^(?:\.env(?:\..*)?|\.git|node_modules)$|\.(?:pem|key)$/i;
export const RESERVED_ASSETS = new Set([
  ...DEFINITION_FILES,
  BUILD_RECORD,
  "package.json",
  "dist",
  "README.md",
  "nodes",
  "workflow-runtime",
]);
export const PLUGIN_HELP = `Usage:
  octonodes plugin create <name>
  octonodes plugin nodes [--check]
  octonodes plugin build [octonode.plugin.ts]
  octonodes plugin validate <built-directory>
  octonodes plugin test <built-directory> [node-id] --input <json>
  octonodes plugin publish <built-directory> --registry <url> [--org <id>] [--team <id>]

Build reads octonode.plugin.ts and writes dist/plugins/<id>.
Node inventories are generated in octonode.nodes.ts. Metadata is inspected without execution.
Publishing uses OCTONODE_MARKETPLACE_URL and OCTONODE_MARKETPLACE_TOKEN when set,
or the saved octonodes login / OCTONODE_TOKEN. It never publishes to npm.
`;
