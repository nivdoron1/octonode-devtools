# Workflows MCP operations

Choose one operation below, then read its page for the exact schema and calling example.

[All categories](index.md) · [Shared calling contract](../mcp-calling.md)

| Operation | When to use it | Effect |
| --- | --- | --- |
| [`project_workflows`](workflows/project_workflows.md) | List up to 100 workflows in the bound project. | read |
| [`project_workflow_graph`](workflows/project_workflow_graph.md) | Read one workflow graph and revision. | read |
| [`project_workflow_create`](workflows/project_workflow_create.md) | Create a workflow with a stable id; fails safely when it already exists. | write |
| [`project_workflow_save`](workflows/project_workflow_save.md) | Save workflow topology using the exact graph revision. | write |
| [`project_workflow_validate_connection`](workflows/project_workflow_validate_connection.md) | Validate one proposed workflow edge before saving it. | write |
| [`project_native_nodes`](workflows/project_native_nodes.md) | List the canonical native-node catalog. | read |
| [`project_native_materialize`](workflows/project_native_materialize.md) | Materialize a native TypeScript node with a stable instance id. | write |
