# Changelog

## [0.0.3] - 2026-09-15

### Added

- Use the public Octonode API from TypeScript through a generated, typed `OctonodeClient`.
- Authenticate and call every public SDK operation from the `octonodes` command, including SSE streams as JSON Lines.
- Sign Studio users in through GitHub browser PKCE or terminal email verification, with refreshable local sessions and logout.
- Regenerate and publish both npm packages through GitHub Actions while keeping package contents limited to compiled output.
