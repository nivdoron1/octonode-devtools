import assert from 'node:assert/strict';
import { test } from 'node:test';
import control from '../scripts/releases/control.cjs';
import panel from '../scripts/releases/panel.cjs';
import { unpublished } from '../scripts/releases/publish.mjs';

const sha = 'a'.repeat(40);
function fixture() {
  const body = `${control.MARKER}\nSource commit: \`${sha}\`\n- [ ] Publish npm packages\n- [ ] Prepare installer artifacts`;
  const comment = { id: 42, user: { login: 'github-actions[bot]' }, body };
  const pull = { number: 7, merged: true, merge_commit_sha: sha, base: { ref: 'main' }, head: { sha } };
  const outputs = {}, writes = [];
  const context = { repo: { owner: 'nivdoron1', repo: 'octonode-devtools' }, sha, ref: 'refs/heads/main', eventName: 'issue_comment',
    payload: { sender: { id: control.OWNER_ID }, action: 'edited', issue: { number: 7, pull_request: {} },
      comment: { ...comment, body: body.replace('- [ ] Publish', '- [x] Publish') }, changes: { body: { from: body } } } };
  const github = { paginate: async () => [comment], rest: {
    repos: {
      get: async () => ({ data: { default_branch: 'main' } }),
      getCommit: async () => ({ data: { sha } }),
      getContent: async () => ({ data: { content: Buffer.from('{"version":"1.2.3"}').toString('base64') } }),
    },
    users: { getByUsername: async () => ({ data: { id: control.OWNER_ID } }) },
    pulls: { get: async () => ({ data: pull }) },
    issues: { listComments() {}, updateComment: async args => writes.push(args), createComment: async args => writes.push(args) },
    actions: {
      getWorkflow: async () => ({ data: { state: 'active', html_url: 'https://github.com/workflow' } }),
      listWorkflowRuns: async () => ({ data: { workflow_runs: [] } }),
    },
  } };
  return { github, context, core: { setOutput: (name, value) => { outputs[name] = value; } }, outputs, comment, pull, writes };
}

test('owner checkbox authorizes the exact merged main commit', async () => {
  const f = fixture();
  await control.authorize(f, 'npm');
  assert.deepEqual(f.outputs, { sha, pr: '7', requested: 'true' });
});

test('installer checkbox selects the merged CLI version and immutable planned asset URL', async () => {
  const f = fixture();
  f.context.payload.comment.body = f.comment.body.replace('- [ ] Prepare', '- [x] Prepare');
  await control.authorize(f, 'installers');
  assert.equal(f.outputs.version, '1.2.3');
  assert.equal(f.outputs.asset_base_url, 'https://github.com/nivdoron1/octonode-devtools/releases/download/cli-v1.2.3');
});

test('owner manual dispatch accepts exact main SHA and explicit installer inputs', async () => {
  const f = fixture();
  f.context.eventName = 'workflow_dispatch';
  f.context.payload.inputs = { sha, version: '1.2.3', asset_base_url: 'https://downloads.example.com/1.2.3' };
  await control.authorize(f, 'installers');
  assert.equal(f.outputs.pr, '0');
  assert.equal(f.outputs.asset_base_url, 'https://downloads.example.com/1.2.3');
});

test('rejects unauthorized actors, forks, feature refs, unmerged PRs and forged comments', async () => {
  for (const mutate of [
    f => { f.context.payload.sender.id = 123; },
    f => { f.context.repo.owner = 'another'; },
    f => { f.context.ref = 'refs/heads/feature'; },
    f => { f.pull.merged = false; },
    f => { f.pull.base.ref = 'feature'; },
    f => { f.context.payload.comment.user = { login: 'nivdoron1' }; },
    f => { f.context.payload.comment.id = 99; },
    f => { f.context.payload.comment.body = f.context.payload.comment.body.replace(sha, 'b'.repeat(40)); },
    f => { f.context.sha = 'b'.repeat(40); },
    f => { f.github.rest.repos.getCommit = async () => ({ data: { sha: 'b'.repeat(40) } }); },
  ]) {
    const f = fixture(); mutate(f);
    await assert.rejects(control.authorize(f, 'npm'));
    assert.equal(f.outputs.requested, undefined);
  }
});

test('existing checked boxes and unrelated edits never create a second request', async () => {
  const f = fixture();
  f.context.payload.changes.body.from = f.context.payload.comment.body;
  await control.authorize(f, 'npm');
  assert.deepEqual(f.outputs, {});
  f.context.payload.action = 'created';
  await control.authorize(f, 'npm');
  assert.deepEqual(f.outputs, {});
});

test('release re-runs require the owner too', async () => {
  const f = fixture();
  const previous = process.env.GITHUB_TRIGGERING_ACTOR;
  process.env.GITHUB_TRIGGERING_ACTOR = 'another';
  f.github.rest.users.getByUsername = async () => ({ data: { id: 123 } });
  try { await assert.rejects(control.authorize(f, 'npm'), /re-run/); }
  finally {
    if (previous === undefined) delete process.env.GITHUB_TRIGGERING_ACTOR;
    else process.env.GITHUB_TRIGGERING_ACTOR = previous;
  }
});

test('panel hides controls until merge and marks stale main commits', async () => {
  const f = fixture();
  f.context.eventName = 'pull_request_target';
  f.context.payload.pull_request = f.pull;
  f.pull.merged = false;
  await panel(f);
  assert.ok(!f.writes.at(-1).body.includes('- [ ] Publish'));
  f.pull.merged = true;
  await panel(f);
  assert.ok(f.writes.at(-1).body.includes('- [ ] Publish'));
  f.github.rest.repos.getCommit = async () => ({ data: { sha: 'b'.repeat(40) } });
  await panel(f);
  assert.ok(f.writes.at(-1).body.includes('no longer the current main'));
  assert.ok(!f.writes.at(-1).body.includes('- [ ] Publish'));
});

test('panel preserves pending owner selections and resets edits from other accounts', async () => {
  const f = fixture();
  await panel(f);
  assert.equal(f.writes.length, 0);
  f.context.payload.sender.id = 123;
  await panel(f);
  assert.ok(f.writes[0].body.includes('- [ ] Publish'));
});

test('panel links the matching run and reports disabled workflows', async () => {
  const f = fixture();
  f.context.eventName = 'workflow_run';
  f.context.payload.workflow_run = { display_title: `npm / PR #7 / ${sha}` };
  f.github.rest.actions.getWorkflow = async () => ({ data: { state: 'disabled_manually', html_url: 'https://github.com/workflow' } });
  f.github.rest.actions.listWorkflowRuns = async () => ({ data: { workflow_runs: [
    { actor: { id: control.OWNER_ID }, display_title: `npm / PR #7 / ${'b'.repeat(40)}`, conclusion: 'failure', html_url: 'https://github.com/wrong' },
    { actor: { id: 123 }, display_title: `npm / PR #7 / ${sha}`, conclusion: 'skipped', html_url: 'https://github.com/unauthorized' },
    { actor: { id: control.OWNER_ID }, display_title: `npm / PR #7 / ${sha}`, conclusion: 'success', html_url: 'https://github.com/right' },
  ] } });
  await panel(f);
  assert.ok(f.writes[0].body.includes('Workflow disabled'));
  assert.ok(f.writes[0].body.includes('https://github.com/right'));
  assert.ok(!f.writes[0].body.includes('https://github.com/wrong'));
  assert.ok(!f.writes[0].body.includes('https://github.com/unauthorized'));
});

test('registry errors never cause publishing; only a definite missing version does', async () => {
  assert.equal(await unpublished('@octonodes/cli', '1.2.3', async () => ({ status: 404 })), true);
  assert.equal(await unpublished('@octonodes/cli', '1.2.3', async () => ({ ok: true, json: async () => ({ name: '@octonodes/cli', version: '1.2.3' }) })), false);
  for (const status of [401, 403, 429, 500, 503]) {
    await assert.rejects(unpublished('@octonodes/cli', '1.2.3', async () => ({ status })), /Registry lookup failed/);
  }
  await assert.rejects(unpublished('@octonodes/cli', '1.2.3', async () => { throw new Error('offline'); }), /offline/);
  await assert.rejects(unpublished('@octonodes/cli', '1.2.3', async () => ({ ok: true, json: async () => ({ name: 'wrong', version: '1.2.3' }) })), /unexpected/);
});
