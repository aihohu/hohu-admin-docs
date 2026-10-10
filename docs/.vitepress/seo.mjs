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
    head.push(['meta', { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' }]);
    head.push(['meta', { name: 'theme-color', content: '#111b2b', media: '(prefers-color-scheme: dark)' }]);
  }
  const graph = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: fullTitle,
      description,
      inLanguage: zh ? 'zh-CN' : 'en',
      isPartOf: { '@id': `${siteOrigin}/#website` },
      [home ? 'mainEntity' : 'about']: { '@id': `${siteOrigin}/#software` }
    }
  ];
  if (home)
    graph.push(
      {
        '@type': 'WebSite',
        '@id': `${siteOrigin}/#website`,
        name: 'HoHu',
        url: `${siteOrigin}/`,
        inLanguage: ['en', 'zh-CN']
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteOrigin}/#software`,
        name: 'HoHu',
        url: `${siteOrigin}/`,
        description,
        applicationCategory: 'DeveloperApplication',
        sameAs: ['https://github.com/aihohu/hohu-admin'],
        featureList: zh
          ? ['业务应用开发', '自主部署', 'AI 助手与业务工具', '角色权限与多租户', 'Web、移动端与桌面端开发']
          : [
              'Business application development',
              'Self-hosting',
              'AI assistants and business tools',
              'Role permissions and multi-tenancy',
              'Web, mobile and desktop development'
            ]
      }
    );
  head.push([
    'script',
    { type: 'application/ld+json' },
    JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph
    }).replaceAll('<', '\\u003c')
  ]);
  return head;
}
