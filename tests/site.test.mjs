import assert from 'node:assert/strict';
import test from 'node:test';
import { navigation, sections } from '../docs/.vitepress/navigation.mjs';
import { canonicalUrl, pageHead } from '../docs/.vitepress/seo.mjs';

test('AI follows CLI and owns existing AI routes in both languages', () => {
  const paths = ['ai/index', 'cli/skills', 'ai-coding', 'user/ai', 'development/ai-tools', 'operations/ai'];
  for (const lang of ['en', 'zh']) {
    const config = navigation(lang);
    assert.deepEqual(
      config.nav.slice(0, 2).map(item => item.text),
      ['CLI', 'AI']
    );
    const ai = sections.find(section => section.en === 'AI');
    assert.deepEqual(
      ai.pages.map(([path]) => path),
      paths
    );
    const prefix = lang === 'zh' ? '/zh' : '';
    for (const path of paths) {
      assert.equal(sections.filter(section => section.pages.some(([entry]) => entry === path)).length, 1);
      assert.equal(config.sidebar[`${prefix}/guide/${path}`][0].text, 'AI');
      // VitePress matches prefixes by slash depth, preserving insertion order for ties.
      const matched = Object.keys(config.sidebar)
        .sort((a, b) => b.split('/').length - a.split('/').length)
        .find(key => `${prefix}/guide/${path}.html`.startsWith(key));
      assert.equal(config.sidebar[matched][0].text, 'AI');
      const url = `${prefix}/guide/${path}.html`;
      assert.deepEqual(
        config.nav.filter(item => item.activeMatch && new RegExp(item.activeMatch).test(url)).map(item => item.text),
        ['AI']
      );
    }
  }
  assert.ok(sections.find(section => section.en === 'CLI').pages.some(([path]) => path === 'cli/build'));
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

test('product graph identifies the real software without invented commercial claims', () => {
  for (const file of ['index.md', 'zh/index.md']) {
    const head = pageHead(file, 'HoHu', 'Build business applications.');
    const graph = JSON.parse(head.find(([, attrs]) => attrs.type === 'application/ld+json')[2])['@graph'];
    const app = graph.find(node => node['@type'] === 'SoftwareApplication');
    assert.equal(app['@id'], 'https://hohu.org/#software');
    assert.equal(app.name, 'HoHu');
    assert.equal(app.applicationCategory, 'DeveloperApplication');
    assert.ok(!('offers' in app) && !('aggregateRating' in app) && !('softwareVersion' in app));
    const page = graph.find(node => node['@type'] === 'WebPage');
    assert.equal(page.url, canonicalUrl(file));
    assert.equal(page.mainEntity['@id'], app['@id']);
  }
});

test('structured descriptions are JSON-safe and document entities match their visible page metadata', () => {
  const description = '</script><script>alert("test")</script>';
  const head = pageHead('zh/guide/ai-coding.md', 'AI development', description);
  const script = head.find(([, attrs]) => attrs.type === 'application/ld+json')[2];
  assert.ok(!script.includes('</script>'));
  const [page] = JSON.parse(script)['@graph'];
  assert.equal(page.description, description);
  assert.equal(page.name, 'AI development | HoHu');
  assert.equal(page.inLanguage, 'zh-CN');
  assert.equal(page.about['@id'], 'https://hohu.org/#software');
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
