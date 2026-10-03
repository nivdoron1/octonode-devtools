const { OWNER_ID, REPO, MARKER, LABELS } = require('./control.cjs');

module.exports = async function panel({ github, context }) {
  const { owner, repo } = context.repo;
  if (`${owner}/${repo}` !== REPO) return;
  let number = context.payload.pull_request?.number;
  if (context.eventName === 'issue_comment') {
    if (!context.payload.issue?.pull_request || !context.payload.comment?.body.startsWith(MARKER)) return;
    // Preserve an owner's pending selection until its workflow consumes the event.
    if (context.payload.sender?.id === OWNER_ID) return;
    number = context.payload.issue.number;
  }
  if (context.eventName === 'workflow_run') {
    number = Number(/\/ PR #(\d+) \//.exec(context.payload.workflow_run.display_title)?.[1]);
  }
  if (!number) return;
  const { data: pull } = await github.rest.pulls.get({ owner, repo, pull_number: number });
  const { data: repository } = await github.rest.repos.get({ owner, repo });
  const sha = pull.merged ? pull.merge_commit_sha : pull.head.sha;
  const { data: head } = await github.rest.repos.getCommit({ owner, repo, ref: repository.default_branch });
  const ready = pull.merged && pull.base.ref === repository.default_branch && sha === head.sha;
  const rows = [];
  for (const [file, label] of [['publish.yml', LABELS.npm], ['distribution.yml', LABELS.installers]]) {
    const { data: workflow } = await github.rest.actions.getWorkflow({ owner, repo, workflow_id: file });
    const { data } = await github.rest.actions.listWorkflowRuns({ owner, repo, workflow_id: file, per_page: 100 });
    const run = data.workflow_runs.find(r => r.actor?.id === OWNER_ID && r.display_title.endsWith(`/ PR #${number} / ${sha}`));
    const state = workflow.state === 'disabled_manually' ? 'Workflow disabled — enable in Actions' : run ? (run.conclusion ?? run.status) : 'Not requested';
    const url = run?.html_url ?? workflow.html_url;
    rows.push(`| ${label} | ${state} | [${run ? 'Open run / artifacts' : 'Open workflow'}](${url}) |`);
  }
  const controls = ready
    ? `Only **@nivdoron1** can request these actions. Check either box; each is a separate manual choice.\n\n- [ ] ${LABELS.npm}\n- [ ] ${LABELS.installers}`
    : pull.merged
      ? 'This merged commit is no longer the current main commit. Use **Run workflow** on main with its exact SHA for a fresh release request.'
      : 'Merge this PR into main to enable the release controls. New pushes and merges never publish packages automatically.';
  const body = `${MARKER}\n## 📦 Octonodes CLI releases\n\nSource commit: \`${sha}\`\n\n| Action | Status | Details |\n| --- | --- | --- |\n${rows.join('\n')}\n\n${controls}\n\nInstaller preparation downloads the matching **already-published** CLI version and produces review artifacts. Publish npm first and wait for success if this version is new. Homebrew, other registries, download hosting and signing remain manual. The default planned asset location is \`https://github.com/${REPO}/releases/download/cli-v<VERSION>\`; Run workflow allows another HTTPS host.\n\nThis comment is public. Changes by other accounts cannot authorize publishing. [Release instructions](https://github.com/${REPO}/blob/main/docs/cli-installation.md).`;
  const comments = await github.paginate(github.rest.issues.listComments, { owner, repo, issue_number: number });
  const existing = comments.find(c => c.user.login === 'github-actions[bot]' && c.body.startsWith(MARKER));
  if (existing) {
    if (existing.body !== body) await github.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body });
  } else await github.rest.issues.createComment({ owner, repo, issue_number: number, body });
};
