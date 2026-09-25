# Runs MCP operations

Choose one operation below, then read its page for the exact schema and calling example.

[All categories](index.md) · [Shared calling contract](../mcp-calling.md)

| Operation | When to use it | Effect |
| --- | --- | --- |
| [`project_runs`](runs/project_runs.md) | List the latest 50 bounded workflow run summaries. | read |
| [`project_run`](runs/project_run.md) | Read one persisted workflow run. | read |
| [`project_workflow_run`](runs/project_workflow_run.md) | Run one workflow and return its bounded event stream. | write |
| [`project_workflow_cancel`](runs/project_workflow_cancel.md) | Idempotently cancel one active workflow run. | write; destructive |
