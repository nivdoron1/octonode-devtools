# Plugins MCP operations

Choose one operation below, then read its page for the exact schema and calling example.

[All categories](index.md) · [Shared calling contract](../mcp-calling.md)

| Operation | When to use it | Effect |
| --- | --- | --- |
| [`project_plugins`](plugins/project_plugins.md) | List installed plugins attached to the bound project. | read |
| [`project_plugin`](plugins/project_plugin.md) | Inspect an installed plugin's pinned version and up to 100 nodes, including custom library exports and original npm implementation identities when available. | read |
| [`project_plugin_node_add`](plugins/project_plugin_node_add.md) | Add one installed plugin node with a stable instance id. | write |
