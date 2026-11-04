import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import test from 'node:test';
import { guidePaths, navigation } from '../docs/.vitepress/navigation.mjs';

const paths = [
  'series/index',
  'series/0.1/index',
  'series/0.2/index',
  'series/0.2/field-policies',
  'series/0.2/upgrade'
];

test('both series have actual published pages, bilingual navigation and upgrade entry points', async () => {
  for (const path of paths) {
    assert.ok(guidePaths.includes(path), `Series route missing: ${path}`);
    for (const lang of ['en', 'zh']) {
      const prefix = lang === 'zh' ? 'zh/' : '';
      const content = await readFile(new URL(`../docs/${prefix}guide/${path}.md`, import.meta.url), 'utf8');
      assert.match(content, /^title: .+/m);
      assert.ok(navigation(lang).sidebar[`/${prefix}guide/${path}`]);
    }
  }
});

test('series identity follows registered paths, preserves language and never invents a stable fallback', async () => {
  const { seriesContext } = await import('../docs/.vitepress/series.mjs');
  for (const prefix of ['', 'zh/']) {
    assert.equal(seriesContext(`${prefix}guide/user/users.md`).series, '0.1');
    for (const path of ['series/0.2/index', 'series/0.2/upgrade', 'reference/v020-candidate']) {
      const context = seriesContext(`${prefix}guide/${path}.md`);
      assert.equal(context.series, '0.2');
      assert.equal(context.status, 'unreleased');
      assert.equal(context.stableUrl, `/${prefix}guide/series/0.1/`);
      assert.equal(context.candidateUrl, `/${prefix}guide/series/0.2/`);
    }
    assert.equal(seriesContext(`${prefix}guide/reference/versions.md`).series, null);
    assert.equal(seriesContext(`${prefix}guide/series/index.md`).series, null);
  }
  for (const file of ['index.md', 'zh/index.md', '404.md', 'guide/unknown.md', 'guide/series/0.3/index.md']) {
    assert.equal(seriesContext(file), null);
  }
});

test('legacy candidate links retain section anchors and point to one fixed-source candidate manual', async () => {
  for (const prefix of ['', 'zh/']) {
    const read = path => readFile(new URL(`../docs/${prefix}guide/${path}.md`, import.meta.url), 'utf8');
    const old = await read('reference/v020-candidate');
    assert.match(old, prefix ? /^# 0.2 候选：用户字段策略$/m : /^# 0.2 candidate: user field policies$/m);
    assert.match(old, /series\/0\.2\/field-policies/);
    const anchors = prefix
      ? ['策略怎样影响用户操作', '编辑、查询和下载', 'ai-与历史记录', '升级与恢复边界']
      : [
          'how-policies-affect-user-operations',
          'editing-querying-and-downloading',
          'ai-and-historical-records',
          'upgrade-and-recovery-boundaries'
        ];
    for (const anchor of anchors) assert.ok(old.includes(`{#${anchor}}`));
    const policy = await read('series/0.2/field-policies');
    const upgrade = await read('series/0.2/upgrade');
    assert.match(policy, /20cb459eb71d8b95b114bbb1bdb6c7c41e9558c2/);
    assert.doesNotMatch(policy + upgrade, /blob\/(?:main|feat\/)/);
    assert.match(upgrade, /0\.1\.6/);
    assert.match(upgrade, /Ctrl\+C/);
    assert.match(upgrade, /epoch/);
  }
});
