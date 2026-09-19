// Generated from sdks/typescript/src/definitions/compiler/constants.ts. Do not edit; run the Octonode SDK sync.
export const DEFINITION_FILENAME = "octonode.config.ts";
export const PLUGIN_FILENAME = "octonode.plugin.ts";
export const NODES_FILENAME = "octonode.nodes.ts";
export const DEFINITION_FILES = [DEFINITION_FILENAME, PLUGIN_FILENAME, NODES_FILENAME];
export const DEFINITION_MODULES = ["@octonodes/sdk", "@octonode/sdk"].flatMap((scope) =>
  ["definitions", "project", "plugin", "nodes"].map((entry) => `${scope}/${entry}`),
);
