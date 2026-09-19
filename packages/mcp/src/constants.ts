import type { JsonSchema, Method, ToolDefinition } from "./types.js";

export const MCP_SERVER_INFO = { name: "octonode", version: "0.1.0" } as const;
export const DEFAULT_RESPONSE_LIMIT_BYTES = 4 * 1024 * 1024;
export const PROJECT_RESPONSE_LIMIT_BYTES = 1024 * 1024;

const string = (maxLength = 256): JsonSchema => ({ type: "string", minLength: 1, maxLength });
const id = string(128);
const path = string(4_096);
const revision: JsonSchema = { type: "string", pattern: "^[a-fA-F0-9]{64}$" };
const content = string(1_000_000);
const object: JsonSchema = { type: "object", maxProperties: 100 };
const integer: JsonSchema = { type: "integer" };
const plainString: JsonSchema = { type: "string" };
const page = { cursor: plainString, limit: integer };
const position: JsonSchema = {
  type: "object",
  properties: { x: { type: "number" }, y: { type: "number" } },
  required: ["x", "y"],
  additionalProperties: false,
};
const edge: JsonSchema = {
  type: "object",
  properties: {
    from: {
      type: "object",
      properties: { node: id, output: id },
      required: ["node"],
      additionalProperties: false,
    },
    to: {
      type: "object",
      properties: { node: id, input: id },
      required: ["node"],
      additionalProperties: false,
    },
    kind: { type: "string", enum: ["data", "dependency", "control"] },
  },
  required: ["from", "to"],
  additionalProperties: false,
};

const schema = (properties: JsonSchema, required: string[] = []): JsonSchema => ({
  type: "object",
  properties,
  required,
  additionalProperties: false,
});

function tool(options: Omit<ToolDefinition, "inputSchema" | "method" | "risk"> & {
  properties?: JsonSchema;
  required?: string[];
  method?: Method;
  risk?: "read" | "write";
}): ToolDefinition {
  const { properties = {}, required, method = "GET", risk, ...definition } = options;
  return {
    ...definition,
    method,
    risk: risk ?? (method === "GET" ? "read" : "write"),
    inputSchema: schema(properties, required),
  };
}

function projectTool(options: Parameters<typeof tool>[0]): ToolDefinition {
  return tool({
    ...options,
    projectScoped: true,
    properties: {
      projectId: { ...id, description: "Project target; required for architecture-scoped sessions." },
      ...(options.properties ?? {}),
    },
  });
}

const collaborationTools: ToolDefinition[] = [
  tool({
    name: "platform_capabilities",
    description: "Read the server-declared platform mode and feature availability.",
    path: "/api/capabilities",
  }),
  tool({ name: "profile_get", description: "Get the caller's workspace profile.", path: "/api/profile" }),
  tool({
    name: "profile_avatar_get",
    description: "Read a workspace member avatar as base64.",
    path: "/api/profiles/{userId}/avatar",
    properties: { userId: plainString, v: integer },
    required: ["userId"],
    query: ["v"],
  }),
  tool({
    name: "workspace_members",
    description: "Search workspace member profiles.",
    path: "/api/profiles/workspace-members",
    properties: { q: plainString, ...page },
    query: ["q", "cursor", "limit"],
  }),
  tool({
    name: "conversations",
    description: "List workspace conversations.",
    path: "/api/social/conversations",
    properties: page,
    query: ["cursor", "limit"],
  }),
  tool({
    name: "conversation_members",
    description: "List a conversation's member ids.",
    path: "/api/social/conversations/{id}/members",
    properties: { id: plainString },
    required: ["id"],
  }),
  tool({
    name: "messages",
    description: "List paginated conversation messages.",
    path: "/api/social/conversations/{conversationId}/messages",
    properties: { conversationId: plainString, ...page },
    required: ["conversationId"],
    query: ["cursor", "limit"],
  }),
  tool({
    name: "notifications",
    description: "List notifications and unread count.",
    path: "/api/social/notifications",
    properties: page,
    query: ["cursor", "limit"],
  }),
  tool({
    name: "github_repositories",
    description: "List repositories visible to connected GitHub App installations.",
    path: "/api/github/repositories",
  }),
  tool({
    name: "pull_requests",
    description: "List Architecture pull requests and the true default branch.",
    path: "/api/architectures/{architectureId}/github/pull-requests",
    properties: { architectureId: plainString, state: { type: "string", enum: ["open", "closed", "all"] } },
    required: ["architectureId"],
    query: ["state"],
  }),
  tool({
    name: "pull_request",
    description: "Get one immutable Architecture pull-request context and project impact.",
    path: "/api/architectures/{architectureId}/github/pull-requests/{number}",
    properties: { architectureId: plainString, number: integer },
    required: ["architectureId", "number"],
  }),
  tool({
    name: "workflow_diff",
    description: "Project an Architecture PR diff onto one contained project.",
    path: "/api/architectures/{architectureId}/github/pull-requests/{number}/workflow-diff",
    properties: { architectureId: plainString, number: integer, projectId: plainString },
    required: ["architectureId", "projectId", "number"],
    query: ["projectId"],
  }),
  tool({
    name: "review_file",
    description: "Read one bounded Architecture base/head file and its changed lines.",
    path: "/api/architectures/{architectureId}/github/pull-requests/{number}/review-file",
    properties: { architectureId: plainString, number: integer, path: plainString },
    required: ["architectureId", "number", "path"],
    query: ["path"],
  }),
  tool({
    name: "review_threads",
    description: "List review threads for one contained project.",
    path: "/api/architectures/{architectureId}/github/pull-requests/{number}/review-threads",
    properties: {
      architectureId: plainString,
      number: integer,
      projectId: plainString,
      workflowId: plainString,
      ...page,
    },
    required: ["architectureId", "projectId", "number"],
    query: ["projectId", "workflowId", "cursor", "limit"],
  }),
  tool({
    name: "github_job",
    description: "Read an asynchronous GitHub job.",
    path: "/api/github/jobs/{id}",
    properties: { id: plainString },
    required: ["id"],
  }),
];

const projectTools: ToolDefinition[] = [
  projectTool({
    name: "project_pull_request_file",
    description:
      "Read a PR file's base/head source and changed lines inside the authorized project. Check headSha against the PR before reviewing; never publish a review without user approval.",
    path: "/api/architectures/{architectureId}/github/pull-requests/{number}/review-file",
    properties: {
      architectureId: id,
      number: { type: "string", pattern: "^[1-9][0-9]*$", minLength: 1, maxLength: 10 },
      path,
    },
    required: ["architectureId", "number", "path"],
    query: ["path"],
  }),
  projectTool({
    name: "project_pull_requests",
    description:
      "List pull requests for the GitHub architecture containing the authorized project. Ask the user to connect GitHub if unavailable.",
    path: "/api/architectures/{architectureId}/github/pull-requests",
    properties: { architectureId: id },
    required: ["architectureId"],
  }),
  projectTool({
    name: "project_pull_request",
    description:
      "Read a pull request and its immutable base/head references in the authorized project's GitHub architecture.",
    path: "/api/architectures/{architectureId}/github/pull-requests/{number}",
    properties: {
      architectureId: id,
      number: { type: "string", pattern: "^[1-9][0-9]*$", minLength: 1, maxLength: 10 },
    },
    required: ["architectureId", "number"],
  }),
  projectTool({
    name: "project_knowledge_search",
    description:
      "Search canonical Octonode documentation and code-authoring guidance before architecture or implementation decisions.",
    path: "/api/knowledge/search",
    method: "POST",
    risk: "read",
    properties: { query: string(2_000), topK: { type: "number", minimum: 1, maximum: 8 } },
    required: ["query"],
    body: ["query", "topK"],
  }),
  projectTool({ name: "project_context", description: "List editable files in the bound Octonode project.", path: "/api/projects/{projectId}/files" }),
  projectTool({
    name: "project_source_index",
    description: "Read the bound project's workflow, type, constant, class, and service symbol index.",
    path: "/api/projects/{projectId}/source-index",
  }),
  projectTool({
    name: "project_file_read",
    description: "Read one bounded project-relative file and its revision.",
    path: "/api/projects/{projectId}/files/content",
    properties: { path },
    required: ["path"],
    query: ["path"],
  }),
  projectTool({
    name: "project_file_create",
    description: "Create one project-relative file; fails safely when the path already exists.",
    path: "/api/projects/{projectId}/files/content",
    method: "POST",
    properties: { path, content },
    required: ["path", "content"],
    body: ["path", "content"],
  }),
  projectTool({
    name: "project_file_write",
    description: "Write one project-relative file using its exact base revision.",
    path: "/api/projects/{projectId}/files/content",
    method: "PUT",
    properties: { path, content, baseRevision: revision },
    required: ["path", "content", "baseRevision"],
    body: ["path", "content", "baseRevision"],
  }),
  projectTool({ name: "project_validate", description: "Compile and synchronize the bound project after source changes.", path: "/api/projects/{projectId}/compile", method: "POST" }),
  projectTool({ name: "project_nodes", description: "List up to 100 nodes in the bound project.", path: "/api/nodes?limit=100" }),
  projectTool({
    name: "project_node_source_read",
    description: "Read one node's TypeScript source and revision.",
    path: "/api/nodes/{nodeId}/source",
    properties: { nodeId: id },
    required: ["nodeId"],
  }),
  projectTool({
    name: "project_node_source_write",
    description: "Write one node's TypeScript source using its exact base revision.",
    path: "/api/nodes/{nodeId}/source",
    method: "PUT",
    properties: { nodeId: id, content, baseRevision: revision },
    required: ["nodeId", "content", "baseRevision"],
    body: ["content", "baseRevision"],
  }),
  projectTool({
    name: "project_node_signature_write",
    description: "Write one node's input and output schemas using its exact source revision.",
    path: "/api/nodes/{nodeId}/source/signature",
    method: "PUT",
    properties: { nodeId: id, inputs: object, outputs: object, baseRevision: revision },
    required: ["nodeId", "inputs", "outputs", "baseRevision"],
    body: ["inputs", "outputs", "baseRevision"],
  }),
  projectTool({ name: "project_workflows", description: "List up to 100 workflows in the bound project.", path: "/api/workflows?limit=100" }),
  projectTool({
    name: "project_workflow_graph",
    description: "Read one workflow graph and revision.",
    path: "/api/workflows/{workflowId}/graph",
    properties: { workflowId: id },
    required: ["workflowId"],
  }),
  projectTool({
    name: "project_workflow_create",
    description: "Create a workflow with a stable id; fails safely when it already exists.",
    path: "/api/workflows",
    method: "POST",
    properties: { id, description: string(1_000) },
    required: ["id"],
    body: ["id", "description"],
  }),
  projectTool({
    name: "project_workflow_save",
    description: "Save workflow topology using the exact graph revision.",
    path: "/api/workflows/{workflowId}/topology",
    method: "POST",
    properties: {
      workflowId: id,
      baseRevision: revision,
      edges: { type: "array", items: edge, maxItems: 1_000 },
      nodes: { type: "array", items: id, maxItems: 1_000 },
      positions: object,
    },
    required: ["workflowId", "baseRevision", "edges"],
    body: ["baseRevision", "edges", "nodes", "positions"],
  }),
  projectTool({
    name: "project_workflow_validate_connection",
    description: "Validate one proposed workflow edge before saving it.",
    path: "/api/workflows/{workflowId}/validate-connection",
    method: "POST",
    properties: {
      workflowId: id,
      from: (edge.properties as JsonSchema).from,
      to: (edge.properties as JsonSchema).to,
    },
    required: ["workflowId", "from", "to"],
    body: ["from", "to"],
  }),
  projectTool({ name: "project_native_nodes", description: "List the canonical native-node catalog.", path: "/api/native-nodes" }),
  projectTool({
    name: "project_native_materialize",
    description: "Materialize a native TypeScript node with a stable instance id.",
    path: "/api/native-nodes/{catalogId}/materialize",
    method: "POST",
    properties: { catalogId: id, instanceId: id, workflowId: id, position, params: object },
    required: ["catalogId", "instanceId"],
    body: ["instanceId", "workflowId", "position", "params"],
  }),
  projectTool({ name: "project_plugins", description: "List installed plugins attached to the bound project.", path: "/api/plugins?fields=id,name,version,description,icon,nodes" }),
  projectTool({
    name: "project_plugin",
    description: "Inspect one installed plugin and up to 100 nodes.",
    path: "/api/plugins/{pluginId}?limit=100",
    properties: { pluginId: id },
    required: ["pluginId"],
  }),
  projectTool({
    name: "project_plugin_node_add",
    description: "Add one installed plugin node with a stable instance id.",
    path: "/api/plugins/{pluginId}/nodes/{nodeId}/add",
    method: "POST",
    properties: { pluginId: id, nodeId: id, instanceId: id, workflowId: id, position },
    required: ["pluginId", "nodeId", "instanceId"],
    body: ["instanceId", "workflowId", "position"],
  }),
  projectTool({ name: "project_runs", description: "List the latest 50 bounded workflow run summaries.", path: "/api/runs?limit=50&fields=runId,workflowId,status,durationMs,startedAt,nodeCount" }),
  projectTool({
    name: "project_run",
    description: "Read one persisted workflow run.",
    path: "/api/runs/{runId}",
    properties: { runId: id },
    required: ["runId"],
  }),
  projectTool({
    name: "project_workflow_run",
    description: "Run one workflow and return its bounded event stream.",
    path: "/api/workflows/{workflowId}/run",
    method: "POST",
    properties: { workflowId: id, env: id, input: object, fromNode: id, pins: object },
    required: ["workflowId"],
    body: ["env", "input", "fromNode", "pins"],
    stream: true,
  }),
  projectTool({
    name: "project_workflow_cancel",
    description: "Idempotently cancel one active workflow run.",
    path: "/api/runs/{runId}/cancel",
    method: "POST",
    destructive: true,
    properties: { runId: id },
    required: ["runId"],
  }),
];

export const MCP_TOOLS = [...collaborationTools, ...projectTools];
