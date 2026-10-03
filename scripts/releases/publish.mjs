import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Never interpret registry/network errors as permission to publish a new package.
export async function unpublished(name, version, fetcher = fetch) {
  const response = await fetcher(`https://registry.npmjs.org/${encodeURIComponent(name)}/${encodeURIComponent(version)}`, { signal: AbortSignal.timeout(30_000) });
  if (response.status === 404) return true;
  if (!response.ok) throw new Error(`Registry lookup failed for ${name}@${version}: ${response.status}`);
  const metadata = await response.json();
  if (metadata.name !== name || metadata.version !== version) throw new Error('Registry returned unexpected package metadata.');
  return false;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const workspace of ['sdk', 'ui-extensions', 'cli']) {
    const { name, version } = JSON.parse(readFileSync(`packages/${workspace}/package.json`, 'utf8'));
    if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Use an explicit stable version for ${name}.`);
    if (!await unpublished(name, version)) {
      console.log(`${name}@${version} already exists; keeping its immutable release.`);
      continue;
    }
    const archive = `${process.env.RUNNER_TEMP}/octonodes-${workspace}.tgz`;
    execFileSync('yarn', ['workspace', name, 'pack', '--out', archive], { stdio: 'inherit' });
    execFileSync('npm', ['publish', archive, '--access', 'public'], { stdio: 'inherit' });
  }
}
