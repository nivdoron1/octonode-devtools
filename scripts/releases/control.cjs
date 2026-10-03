// Runs only from the default-branch checkout. Never load PR code in the control jobs.
const OWNER_ID = 102235711;
const REPO = 'nivdoron1/octonode-devtools';
const MARKER = '<!-- octonodes-release-control -->';
const LABELS = { npm: 'Publish npm packages', installers: 'Prepare installer artifacts' };

function transition(payload, kind) {
  const before = payload.changes?.body?.from ?? '';
  const after = payload.comment?.body ?? '';
  const label = LABELS[kind];
  return before.includes(`- [ ] ${label}`) && after.includes(`- [x] ${label}`);
}

async function authorize({ github, context, core }, kind) {
  const { owner, repo } = context.repo;
  if (`${owner}/${repo}` !== REPO || context.payload.sender?.id !== OWNER_ID) {
    throw new Error('Only nivdoron1 can request a release in the canonical repository.');
  }
  const rerunner = process.env.GITHUB_TRIGGERING_ACTOR;
  if (rerunner && (await github.rest.users.getByUsername({ username: rerunner })).data.id !== OWNER_ID) {
    throw new Error('Only nivdoron1 can re-run release requests.');
  }
  const { data: repository } = await github.rest.repos.get({ owner, repo });
  if (context.ref !== `refs/heads/${repository.default_branch}`) throw new Error('Run releases from the default branch.');
  const { data: head } = await github.rest.repos.getCommit({ owner, repo, ref: repository.default_branch });
  // A moving main branch must never change the source selected by the owner.
  let sha, pr = 0, version, assetBaseUrl;
  if (context.eventName === 'workflow_dispatch') {
    sha = context.payload.inputs?.sha;
    version = context.payload.inputs?.version;
    assetBaseUrl = context.payload.inputs?.asset_base_url;
  } else if (context.eventName === 'issue_comment') {
    const payload = context.payload;
    if (payload.action !== 'edited' || !payload.issue?.pull_request || !transition(payload, kind)) return;
    const comment = payload.comment;
    if (comment.user?.login !== 'github-actions[bot]' || !comment.body.startsWith(MARKER)) throw new Error('Use the canonical release control comment.');
    const comments = await github.paginate(github.rest.issues.listComments, { owner, repo, issue_number: payload.issue.number });
    const canonical = comments.find(c => c.user.login === 'github-actions[bot]' && c.body.startsWith(MARKER));
    if (canonical?.id !== comment.id) throw new Error('Release comment is not canonical.');
    pr = payload.issue.number;
    const { data: pull } = await github.rest.pulls.get({ owner, repo, pull_number: pr });
    if (!pull.merged || pull.base.ref !== repository.default_branch) throw new Error('Merge this PR into the default branch before releasing.');
    sha = /^Source commit: `([a-f0-9]{40})`$/m.exec(comment.body)?.[1];
    if (sha !== pull.merge_commit_sha || !canonical.body.includes(`Source commit: \`${sha}\``)) throw new Error('The control comment does not match the merged source commit.');
  } else throw new Error('Unsupported release event.');
  if (!/^[a-f0-9]{40}$/.test(sha ?? '') || sha !== head.sha || sha !== context.sha) {
    throw new Error('Source must be the exact current default-branch SHA. Refresh the request if main has moved.');
  }
  if (kind === 'installers' && context.eventName === 'issue_comment') {
    const { data } = await github.rest.repos.getContent({ owner, repo, path: 'packages/cli/package.json', ref: sha });
    version = JSON.parse(Buffer.from(data.content, 'base64').toString()).version;
    assetBaseUrl = `https://github.com/${REPO}/releases/download/cli-v${version}`;
  }
  core.setOutput('sha', sha);
  core.setOutput('pr', String(pr));
  if (kind === 'installers') {
    core.setOutput('version', version);
    core.setOutput('asset_base_url', assetBaseUrl);
  }
  core.setOutput('requested', 'true');
}

module.exports = { OWNER_ID, REPO, MARKER, LABELS, transition, authorize };
