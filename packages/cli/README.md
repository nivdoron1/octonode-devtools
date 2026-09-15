# @octonodes/cli

Thin command-line wrapper over `@octonodes/sdk`.

```sh
npx @octonodes/cli login

npx @octonodes/cli operations
npx @octonodes/cli projects.api.get --input '{"query":{"workspace":"acme"}}'
```

The installed command is `octonodes`. `login` opens GitHub authentication in your browser,
receives the result on a temporary loopback callback, then stores the refreshable Supabase
session in `~/.octonode/session.json` with user-only permissions. The CLI refreshes expired
access tokens automatically. If the browser does not open, visit the URL printed by the CLI.

Use `octonodes login --email you@example.com` for terminal email-code login instead. The
Supabase redirect allow list must contain `http://127.0.0.1:*/auth/callback/**` for browser
login.

Use `octonodes login --token <api-token>` for a personal, service, public, or agent token.
For automation, set `OCTONODE_TOKEN`; it takes precedence over every saved login.

Run `octonodes logout` to revoke the CLI's Supabase refresh session and remove saved
credentials. Static API tokens must still be revoked in Studio, and logout cannot unset
`OCTONODE_TOKEN` in your shell.

Run `octonodes operations [filter]` to list every available SDK operation. Use
`octonodes --help` or `octonodes <command> --help` for command help.
