// Generated from engine plugin authoring. Do not edit.
export const BUILD_RECORD = "octonode-build.json";
export const DEFINITION_FILES = ["octonode.yml", "octonode.yaml", "octonode.json", "octonode.plugin.json"];
export const FORBIDDEN_PART =
  /^(?:\.env(?:\..*)?|\.git|\.npmrc|\.pypirc|\.netrc|\.git-credentials|node_modules)$|\.(?:pem|key|p12)$/i;
export const RESERVED_ASSETS = new Set([
  ...DEFINITION_FILES,
  BUILD_RECORD,
  "package.json",
  "dist",
  "README.md",
  "nodes",
  "workflow-runtime",
  "library",
]);
