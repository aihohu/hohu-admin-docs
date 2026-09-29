export const siteOrigin = 'https://hohu.org';

export function canonicalUrl(file) {
  return `${siteOrigin}/${file.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')}`;
}

export function pageHead(file, title, description) {
  if (file === '404.md') return [['meta', { name: 'robots', content: 'noindex, follow' }]];
  const en = file.replace(/^zh\//, '');
  const zh = file.startsWith('zh/');
  const home = en === 'index.md';
  const url = canonicalUrl(file);
  const fullTitle = home ? title : `${title} | HoHu`;
  const head = [
    ['link', { rel: 'canonical', href: url }],
    ...[
      ['en', en],
      ['zh-CN', `zh/${en}`],
      ['x-default', en]
    ].map(([lang, path]) => ['link', { rel: 'alternate', hreflang: lang, href: canonicalUrl(path) }]),
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'HoHu' }],
    ['meta', { property: 'og:title', content: fullTitle }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:locale', content: zh ? 'zh_CN' : 'en_US' }],
    ['meta', { property: 'og:locale:alternate', content: zh ? 'en_US' : 'zh_CN' }],
    ['meta', { property: 'og:image', content: `${siteOrigin}/logo.png` }],
    ['meta', { property: 'og:image:alt', content: 'HoHu' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: fullTitle }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: `${siteOrigin}/logo.png` }]
  ];
  if (home) {
    head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'HoHu',
        url,
        description,
        inLanguage: zh ? 'zh-CN' : 'en'
      }).replaceAll('<', '\\u003c')
    ]);
  }
  return head;
}
