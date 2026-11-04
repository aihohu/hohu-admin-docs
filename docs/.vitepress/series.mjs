import { guidePaths } from './navigation.mjs';

// Unversioned task URLs belong to 0.1 permanently. Unknown routes have no identity.
export function seriesContext(file) {
  const prefix = file.startsWith('zh/') ? 'zh/' : '';
  const match = file.slice(prefix.length).match(/^guide\/(.+)\.md$/);
  if (!match || !guidePaths.includes(match[1])) return null;
  const path = match[1];
  const shared = ['series/index', 'reference/versions', 'reference/index'].includes(path);
  const candidate = path.startsWith('series/0.2/') || path === 'reference/v020-candidate';
  return {
    series: shared ? null : candidate ? '0.2' : '0.1',
    status: shared ? 'index' : candidate ? 'unreleased' : 'maintained',
    zh: prefix === 'zh/',
    indexUrl: `/${prefix}guide/series/`,
    stableUrl: `/${prefix}guide/series/0.1/`,
    candidateUrl: `/${prefix}guide/series/0.2/`
  };
}
