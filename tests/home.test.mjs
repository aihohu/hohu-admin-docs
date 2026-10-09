import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { URL } from 'node:url';
import test from 'node:test';
import { homeContent, guideLink, commands } from '../docs/.vitepress/theme/composables/home.ts';
import { pagePaths } from '../docs/.vitepress/navigation.mjs';

test('home entry points resolve to published bilingual guides', () => {
  for (const locale of ['zh', 'en']) {
    const copy = homeContent[locale];
    const links = [
      ...copy.nav.guides.map(item => item.path),
      ...copy.journey.items.map(item => item.path),
      ...copy.platform.items.map(item => item.path),
      copy.workflow.guidePath,
      copy.start.ai.guidePath,
      copy.start.ai.skillsPath,
      ...copy.start.links.map(item => item.path),
      ...copy.footer.links.map(item => item.path)
    ];
    for (const path of links) {
      const url = guideLink(locale, path);
      const md = url
        .slice(1)
        .replace(/\.html$/, '.md')
        .replace(/\/$/, '/index.md');
      assert.ok(pagePaths.includes(md), `${locale}: ${url}`);
    }
  }
});

test('business scenarios are extension examples beside an accurately labeled real product image', () => {
  for (const locale of ['zh', 'en']) {
    const copy = homeContent[locale];
    assert.equal(copy.workflow.mode, 'extension-examples');
    assert.deepEqual(
      copy.workflow.scenarios.map(item => item.id),
      ['orders', 'approvals', 'projects']
    );
    assert.ok(copy.workflow.disclosure);
    assert.ok(copy.workflow.disclosure.includes(locale === 'zh' ? '接入 AI 工具' : 'connected AI tools'));
    assert.ok(copy.workflow.caption.includes(locale === 'zh' ? '用户管理' : 'user management'));
    assert.ok(copy.footer.limitations.includes(locale === 'zh' ? '第三方' : 'third-party'));
    for (const asset of [copy.hero.image, copy.hero.darkImage, copy.workflow.image, copy.workflow.darkImage]) {
      assert.ok(asset, `${locale}: missing light/dark product asset`);
      assert.ok(existsSync(new URL(`../docs/public${asset}`, import.meta.url)));
    }
  }
  assert.equal(commands, 'uv tool install hohu\nhohu create my-project\ncd my-project\nhohu init\nhohu dev');
});
