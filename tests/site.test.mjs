import assert from 'node:assert/strict';
import test from 'node:test';
import { navigation, sections } from '../docs/.vitepress/navigation.mjs';
import { canonicalUrl, pageHead } from '../docs/.vitepress/seo.mjs';

test('CLI has its own navigation and AI tooling belongs to development', () => {
  assert.deepEqual(
    navigation('zh').nav.map(item => item.text),
    ['CLI', '使用指南', '开发指南', '部署与运维', '参考资料', '问题反馈']
  );
  const cli = sections.find(section => section.en === 'CLI');
  assert.ok(cli.pages.some(([path]) => path === 'cli/build'));
  assert.ok(
    sections.find(section => section.en === 'Development').pages.some(([path]) => path === 'development/ai-tools')
  );
});

test('canonical URLs use the production origin and normalize directory indexes', () => {
  assert.equal(canonicalUrl('index.md'), 'https://hohu.org/');
  assert.equal(canonicalUrl('zh/guide/user/index.md'), 'https://hohu.org/zh/guide/user/');
  assert.equal(canonicalUrl('guide/auth.md'), 'https://hohu.org/guide/auth.html');
});

test('translations have self canonicals and reciprocal language alternates', () => {
  for (const file of ['guide/auth.md', 'zh/guide/auth.md']) {
    const head = pageHead(file, 'Permissions', 'Configure API and button permissions.');
    assert.equal(head.filter(([tag, attrs]) => tag === 'link' && attrs.rel === 'canonical').length, 1);
    assert.ok(head.some(([, a]) => a.rel === 'canonical' && a.href === canonicalUrl(file)));
    for (const [lang, path] of [
      ['en', 'guide/auth.md'],
      ['zh-CN', 'zh/guide/auth.md'],
      ['x-default', 'guide/auth.md']
    ]) {
      assert.ok(head.some(([, a]) => a.hreflang === lang && a.href === canonicalUrl(path)));
    }
    assert.ok(head.some(([, a]) => a.property === 'og:url' && a.content === canonicalUrl(file)));
    assert.ok(head.some(([, a]) => a.property === 'og:title' && a.content === 'Permissions | HoHu'));
  }
});

test('404 is not indexed or described as a valid translated page', () => {
  const head = pageHead('404.md', 'Not found', '');
  assert.ok(head.some(([, a]) => a.name === 'robots' && a.content === 'noindex, follow'));
  assert.ok(!head.some(([, a]) => a.rel === 'canonical' || a.hreflang));
});

test('each language and legacy route gets only its own section sidebar', () => {
  for (const lang of ['en', 'zh']) {
    const config = navigation(lang);
    const prefix = lang === 'zh' ? '/zh' : '';
    for (const section of sections) {
      for (const [path] of section.pages) {
        const group = config.sidebar[`${prefix}/guide/${path}`];
        assert.ok(group, `Missing section for ${lang}/${path}`);
        const nav = config.nav.find(item => item.text === section[lang]);
        assert.ok(new RegExp(nav.activeMatch).test(`${prefix}/guide/${path}.html`));
        if (path.endsWith('/index')) {
          assert.ok(new RegExp(nav.activeMatch).test(`${prefix}/guide/${path.slice(0, -5)}`));
        }
        assert.deepEqual(
          group.flatMap(item => item.items.map(link => link.text)),
          section.pages.map(page => page[lang === 'zh' ? 2 : 1])
        );
      }
    }
  }
});
