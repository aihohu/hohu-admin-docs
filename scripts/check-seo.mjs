import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import process from 'node:process';
import { pagePaths } from '../docs/.vitepress/navigation.mjs';
import { canonicalUrl, siteOrigin } from '../docs/.vitepress/seo.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'docs/.vitepress/dist');
const errors = [];
const titles = new Set();
const descriptions = new Set();
const decode = text =>
  text
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
const attributes = tag =>
  Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)]));
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]));
for (const file of pagePaths) {
  const html = await readFile(resolve(dist, file.replace(/\.md$/, '.html')), 'utf8');
  const head = html.split('</head>')[0];
  const tags = [...head.matchAll(/<(?:meta|link)\b[^>]*>/g)].map(match => attributes(match[0]));
  const values = (key, value, output) => tags.filter(a => a[key] === value).map(a => a[output]);
  const expect = (condition, message) => {
    if (!condition) errors.push(`${file}: ${message}`);
  };
  const canonical = canonicalUrl(file);
  expect(
    JSON.stringify(values('rel', 'canonical', 'href')) === JSON.stringify([canonical]),
    'canonical mismatch or duplicate'
  );
  expect(urls.filter(url => url === canonical).length === 1, 'canonical absent or repeated in sitemap');
  expect(!tags.some(a => a.name === 'robots' && a.content?.includes('noindex')), 'public page is noindex');
  const title = decode(head.match(/<title>(.*?)<\/title>/s)?.[1] ?? '');
  const description = values('name', 'description', 'content')[0];
  expect(Boolean(title) && !titles.has(title), 'missing or duplicate title');
  expect(Boolean(description) && !descriptions.has(description), 'missing or duplicate description');
  titles.add(title);
  descriptions.add(description);
  expect(values('property', 'og:title', 'content')[0] === title, 'sharing title differs from page title');
  expect(
    values('property', 'og:description', 'content')[0] === description,
    'sharing description differs from page description'
  );
  expect(values('property', 'og:url', 'content')[0] === canonical, 'sharing URL differs from canonical');
  const en = file.replace(/^zh\//, '');
  for (const [locale, path] of [
    ['en', en],
    ['zh-CN', `zh/${en}`],
    ['x-default', en]
  ]) {
    expect(
      JSON.stringify(values('hreflang', locale, 'href')) === JSON.stringify([canonicalUrl(path)]),
      `invalid ${locale} alternate`
    );
  }
  expect(html.includes(`<html lang="${file.startsWith('zh/') ? 'zh-CN' : 'en'}"`), 'incorrect document language');
  const structured = [...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  expect(structured.length === 1, 'missing or duplicate structured data');
  try {
    const graph = JSON.parse(structured[0]?.[1] ?? '{}')['@graph'] ?? [];
    const page = graph.find(node => node['@type'] === 'WebPage');
    expect(
      page?.url === canonical && page?.name === title && page?.description === description,
      'structured page differs from visible metadata'
    );
    if (file === 'index.md' || file === 'zh/index.md') {
      const software = graph.find(node => node['@type'] === 'SoftwareApplication');
      expect(software?.['@id'] === `${siteOrigin}/#software`, 'missing product entity');
      expect(page?.mainEntity?.['@id'] === software?.['@id'], 'homepage does not identify the product');
      expect(!software?.offers && !software?.aggregateRating, 'unverified offer or rating');
    }
  } catch {
    expect(false, 'invalid structured JSON');
  }
  expect([...html.matchAll(/<h1\b/g)].length === 1, 'page needs exactly one rendered h1');
  expect(!/class="[^"]*\brelease-note\b/.test(html), 'retired release banner is present');
  for (const match of html.matchAll(/<(a|img)\b[^>]*>/g)) {
    const attrs = attributes(match[0]);
    const target = attrs.href ?? attrs.src;
    if (!target || /^(?:[a-z]+:|\/\/)/i.test(target)) continue;
    const url = new URL(decode(target), canonical);
    const path = decodeURIComponent(url.pathname);
    if (match[1] === 'img') expect(Object.hasOwn(attrs, 'alt'), `image missing alt: ${target}`);
    const candidates = [
      resolve(dist, `.${path}`),
      resolve(dist, `.${path}/index.html`),
      resolve(dist, `.${path}.html`)
    ];
    let found;
    for (const candidate of candidates) {
      try {
        if ((await stat(candidate)).isFile()) {
          found = candidate;
          break;
        }
      } catch {
        /* Try the next static route. */
      }
    }
    expect(Boolean(found), `broken rendered link/asset: ${target}`);
    if (found?.endsWith('.html') && url.hash) {
      const destination = await readFile(found, 'utf8');
      const anchor = decodeURIComponent(url.hash.slice(1));
      expect(destination.includes(`id="${anchor}"`), `broken anchor: ${target}`);
    }
  }
}
if (urls.length !== pagePaths.length) errors.push('Sitemap contains unlisted or duplicate URLs');
const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`)) errors.push('robots.txt lacks the canonical sitemap');
const notFound = await readFile(resolve(dist, '404.html'), 'utf8');
if (!notFound.includes('noindex')) errors.push('404 must be noindex');
if (errors.length) {
  process.stderr.write(`${errors.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `SEO, language alternates, rendered links/assets and anchors passed for ${pagePaths.length} pages.\n`
  );
}
