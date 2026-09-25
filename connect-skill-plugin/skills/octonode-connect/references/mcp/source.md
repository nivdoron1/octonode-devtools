# Source MCP operations

Choose one operation below, then read its page for the exact schema and calling example.

[All categories](index.md) · [Shared calling contract](../mcp-calling.md)

| Operation | When to use it | Effect |
| --- | --- | --- |
| [`project_knowledge_search`](source/project_knowledge_search.md) | Search canonical Octonode documentation and code-authoring guidance before architecture or implementation decisions. | read |
| [`project_context`](source/project_context.md) | List editable files in the bound Octonode project. | read |
| [`project_source_index`](source/project_source_index.md) | Read the bound project's workflow, type, constant, class, and service symbol index. | read |
| [`project_file_read`](source/project_file_read.md) | Read one bounded project-relative file and its revision. | read |
| [`project_file_create`](source/project_file_create.md) | Create one project-relative file; fails safely when the path already exists. | write |
| [`project_file_write`](source/project_file_write.md) | Write one project-relative file using its exact base revision. | write |
| [`project_validate`](source/project_validate.md) | Compile and synchronize the bound project after source changes. | write |
| [`project_nodes`](source/project_nodes.md) | List up to 100 nodes in the bound project. | read |
| [`project_node_source_read`](source/project_node_source_read.md) | Read one node's TypeScript source and revision. | read |
| [`project_node_source_write`](source/project_node_source_write.md) | Write one node's TypeScript source using its exact base revision. | write |
| [`project_node_signature_write`](source/project_node_signature_write.md) | Write one node's input and output schemas using its exact source revision. | write |
