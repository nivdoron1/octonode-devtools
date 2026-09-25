# GitHub MCP operations

Choose one operation below, then read its page for the exact schema and calling example.

[All categories](index.md) · [Shared calling contract](../mcp-calling.md)

| Operation | When to use it | Effect |
| --- | --- | --- |
| [`github_repositories`](github/github_repositories.md) | List repositories visible to connected GitHub App installations. | read |
| [`pull_requests`](github/pull_requests.md) | List Architecture pull requests and the true default branch. | read |
| [`pull_request`](github/pull_request.md) | Get one immutable Architecture pull-request context and project impact. | read |
| [`workflow_diff`](github/workflow_diff.md) | Project an Architecture PR diff onto one contained project. | read |
| [`review_file`](github/review_file.md) | Read one bounded Architecture base/head file and its changed lines. | read |
| [`review_threads`](github/review_threads.md) | List review threads for one contained project. | read |
| [`github_job`](github/github_job.md) | Read an asynchronous GitHub job. | read |
| [`project_pull_request_file`](github/project_pull_request_file.md) | Read a PR file's base/head source and changed lines inside the authorized project. | read |
| [`project_pull_requests`](github/project_pull_requests.md) | List pull requests for the GitHub architecture containing the authorized project. | read |
| [`project_pull_request`](github/project_pull_request.md) | Read a pull request and its immutable base/head references in the authorized project's GitHub architecture. | read |
