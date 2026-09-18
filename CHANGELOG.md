# Changelog

## [0.1.0] - Unreleased

- Define typed plugins with `@octonodes/sdk/plugins`, including node contracts, handlers, defaults, and credential metadata.
- Create, build, validate, test, and publish independent plugin artifacts with `octonodes plugin`.
- Generate YAML definitions and standalone runners for multiple plugins in one project; verify artifacts before publication.
- Sync the plugin schema and runtime from the main Octonode repository alongside the generated API client.

## [0.0.3] - 2026-09-15

### Added

- Use the public Octonode API from TypeScript through a generated, typed `OctonodeClient`.
- Authenticate and call every public SDK operation from the `octonodes` command, including SSE streams as JSON Lines.
- Sign Studio users in through GitHub browser PKCE or terminal email verification, with refreshable local sessions and logout.
- Regenerate and publish both npm packages through GitHub Actions while keeping package contents limited to compiled output.
