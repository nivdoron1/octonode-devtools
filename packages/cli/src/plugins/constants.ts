export const BUILD_RECORD = "octonode-build.json";
export const DEFINITION_FILES = [
  "octonode.yml",
  "octonode.yaml",
  "octonode.json",
  "octonode.plugin.json",
];
export const FORBIDDEN_PART = /^(?:\.env(?:\..*)?|\.git|node_modules)$|\.(?:pem|key)$/i;
export const RESERVED_ASSETS = new Set([
  ...DEFINITION_FILES,
  BUILD_RECORD,
  "package.json",
  "dist",
  "README.md",
]);
export const PLUGIN_HELP = `Usage:
  octonodes plugin create <name>
  octonodes plugin build [plugins/example.plugin.ts]
  octonodes plugin validate <built-directory>
  octonodes plugin test <built-directory> [node-id] --input <json>
  octonodes plugin publish <built-directory> --registry <url> [--org <id>] [--team <id>]

Build discovers plugins/**/*.plugin.ts and writes dist/plugins/<id>.
Definitions execute locally during build. Only build trusted source.
Publishing uses OCTONODE_MARKETPLACE_URL and OCTONODE_MARKETPLACE_TOKEN when set,
or the saved octonodes login / OCTONODE_TOKEN. It never publishes to npm.
`;
