# Hosted MCP operation index

Generated from `packages/mcp/src/constants.ts`; run `yarn gen:mcp-skills` after changing registrations.

Read the [shared calling contract](../mcp-calling.md) first. Load only the category needed.

Examples show argument shapes, not executable project data. Replace every example ID, path, content,
and revision with values from the user's request or live reads. Never submit the zero revision.

All 43 registered tools are listed below. Live tools/list is authoritative for the deployed server.

| Operation | Effect | Reference |
| --- | --- | --- |
| `platform_capabilities` | read | [workspace](workspace.md#platform-capabilities) |
| `profile_get` | read | [workspace](workspace.md#profile-get) |
| `profile_avatar_get` | read | [workspace](workspace.md#profile-avatar-get) |
| `workspace_members` | read | [workspace](workspace.md#workspace-members) |
| `conversations` | read | [workspace](workspace.md#conversations) |
| `conversation_members` | read | [workspace](workspace.md#conversation-members) |
| `messages` | read | [workspace](workspace.md#messages) |
| `notifications` | read | [workspace](workspace.md#notifications) |
| `github_repositories` | read | [github](github.md#github-repositories) |
| `pull_requests` | read | [github](github.md#pull-requests) |
| `pull_request` | read | [github](github.md#pull-request) |
| `workflow_diff` | read | [github](github.md#workflow-diff) |
| `review_file` | read | [github](github.md#review-file) |
| `review_threads` | read | [github](github.md#review-threads) |
| `github_job` | read | [github](github.md#github-job) |
| `project_pull_request_file` | read | [github](github.md#project-pull-request-file) |
| `project_pull_requests` | read | [github](github.md#project-pull-requests) |
| `project_pull_request` | read | [github](github.md#project-pull-request) |
| `project_knowledge_search` | read | [source](source.md#project-knowledge-search) |
| `project_context` | read | [source](source.md#project-context) |
| `project_source_index` | read | [source](source.md#project-source-index) |
| `project_file_read` | read | [source](source.md#project-file-read) |
| `project_file_create` | write | [source](source.md#project-file-create) |
| `project_file_write` | write | [source](source.md#project-file-write) |
| `project_validate` | write | [source](source.md#project-validate) |
| `project_nodes` | read | [source](source.md#project-nodes) |
| `project_node_source_read` | read | [source](source.md#project-node-source-read) |
| `project_node_source_write` | write | [source](source.md#project-node-source-write) |
| `project_node_signature_write` | write | [source](source.md#project-node-signature-write) |
| `project_workflows` | read | [workflows](workflows.md#project-workflows) |
| `project_workflow_graph` | read | [workflows](workflows.md#project-workflow-graph) |
| `project_workflow_create` | write | [workflows](workflows.md#project-workflow-create) |
| `project_workflow_save` | write | [workflows](workflows.md#project-workflow-save) |
| `project_workflow_validate_connection` | write | [workflows](workflows.md#project-workflow-validate-connection) |
| `project_native_nodes` | read | [workflows](workflows.md#project-native-nodes) |
| `project_native_materialize` | write | [workflows](workflows.md#project-native-materialize) |
| `project_plugins` | read | [plugins](plugins.md#project-plugins) |
| `project_plugin` | read | [plugins](plugins.md#project-plugin) |
| `project_plugin_node_add` | write | [plugins](plugins.md#project-plugin-node-add) |
| `project_runs` | read | [runs](runs.md#project-runs) |
| `project_run` | read | [runs](runs.md#project-run) |
| `project_workflow_run` | write | [runs](runs.md#project-workflow-run) |
| `project_workflow_cancel` | write; destructive | [runs](runs.md#project-workflow-cancel) |
