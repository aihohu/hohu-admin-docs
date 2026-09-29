import { defineConfig } from 'vitepress';
import { navigation, pagePaths } from './navigation.mjs';
import { srcExclude } from './release.mjs';
import { canonicalUrl, pageHead, siteOrigin } from './seo.mjs';

export default defineConfig({
  appearance: true,
  title: 'HoHu',
  titleTemplate: ':title | HoHu',
  cleanUrls: false,
  srcExclude,
  transformPageData(pageData) {
    if (pageData.relativePath !== '404.md' && !pagePaths.includes(pageData.relativePath)) {
      throw new Error(`Unlisted public page: ${pageData.relativePath}`);
    }
  },
  transformHead({ pageData }) {
    return pageHead(pageData.relativePath, pageData.title, pageData.description);
  },
  sitemap: {
    hostname: siteOrigin,
    transformItems: () => pagePaths.map(file => ({ url: canonicalUrl(file) }))
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-K5W3P408PS' }],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-K5W3P408PS');`
    ]
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'HoHu',
      description: 'Open-source platform for building AI-native business applications.',
      themeConfig: {
        ...navigation('en'),
        docFooter: { prev: 'Previous', next: 'Next' },
        outline: { label: 'On this page' },
        lastUpdated: { text: 'Last updated' },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance'
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'HoHu',
      description: '面向 AI 原生业务应用的开源企业应用平台。',
      themeConfig: {
        ...navigation('zh'),
        docFooter: { prev: '上一页', next: '下一页' },
        outline: { label: '本页目录' },
        lastUpdated: { text: '最后更新' },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '外观'
      }
    }
  },
  themeConfig: {
    logo: { src: '/logo.png', alt: 'HoHu' },
    outline: {
      level: [2, 3]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/aihohu' }],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                noResultsText: 'No results',
                resetButtonTitle: 'Reset search',
                footer: { selectText: 'Select', navigateText: 'Navigate', closeText: 'Close' }
              }
            }
          },
          zh: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '没有结果',
                resetButtonTitle: '重置搜索',
                footer: { selectText: '选择', navigateText: '导航', closeText: '关闭' }
              }
            }
          }
        }
      }
    }
  }
});
