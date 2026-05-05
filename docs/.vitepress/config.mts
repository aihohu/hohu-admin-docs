import { defineConfig } from 'vitepress';

export default defineConfig({
  appearance: 'dark',
  sitemap: {
    hostname: 'https://hohu.org'
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'HoHu Admin' }],
    ['meta', { property: 'og:title', content: 'HoHu Admin - AI-Powered Enterprise Admin Platform' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'FastAPI & Vue3 based AI-collaborative development framework with RBAC, Snowflake ID, async stack'
      }
    ],
    ['meta', { property: 'og:image', content: 'https://hohu.org/images/home.jpeg' }],
    ['meta', { property: 'og:url', content: 'https://hohu.org' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'HoHu Admin - AI-Powered Enterprise Admin Platform' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: 'FastAPI & Vue3 based AI-collaborative development framework with RBAC, Snowflake ID, async stack'
      }
    ],
    ['meta', { name: 'twitter:image', content: 'https://hohu.org/images/home.jpeg' }],
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
      title: 'HoHu Admin',
      description: 'AI-Powered Enterprise Admin Platform',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Docs', link: '/guide/quick-start' }
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/guide/introduction' },
                { text: 'Quick Start', link: '/guide/quick-start' },
                { text: 'Deployment', link: '/guide/deploy' },
                { text: 'Live Demo', link: '/guide/show' },
                { text: 'Source Code', link: '/guide/src' }
              ]
            },
            {
              text: 'Tutorials',
              items: [
                { text: 'AI Coding', link: '/guide/ai-coding' },
                { text: 'Access Control', link: '/guide/auth' },
                { text: 'Data Permission', link: '/guide/data-permission' },
                { text: 'Pagination', link: '/guide/page' },
                { text: 'File Upload', link: '/guide/file-upload' },
                { text: 'Scheduled Jobs', link: '/guide/scheduled-job' }
              ]
            },
            {
              text: 'Backend',
              items: [
                { text: 'Introduction', link: '/guide/backend/introduction' },
                { text: 'Directory Structure', link: '/guide/backend/dir' }
              ]
            },
            {
              text: 'CLI Reference',
              items: [
                { text: 'Overview', link: '/guide/cli/index' },
                { text: 'hohu build', link: '/guide/cli/build' },
                { text: 'hohu deploy', link: '/guide/cli/deploy' }
              ]
            }
          ]
        },
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
      title: 'HoHu Admin',
      description: 'AI 驱动的企业级后台管理平台',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '文档', link: '/zh/guide/quick-start' }
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '开始',
              items: [
                { text: '介绍', link: '/zh/guide/introduction' },
                { text: '快速上手', link: '/zh/guide/quick-start' },
                { text: '部署指南', link: '/zh/guide/deploy' },
                { text: '在线演示', link: '/zh/guide/show' },
                { text: '源码', link: '/zh/guide/src' }
              ]
            },
            {
              text: '教程',
              items: [
                { text: 'AI 编程', link: '/zh/guide/ai-coding' },
                { text: '权限控制', link: '/zh/guide/auth' },
                { text: '数据权限', link: '/zh/guide/data-permission' },
                { text: '分页', link: '/zh/guide/page' },
                { text: '文件上传', link: '/zh/guide/file-upload' },
                { text: '定时任务', link: '/zh/guide/scheduled-job' }
              ]
            },
            {
              text: '后端文档',
              items: [
                { text: '介绍', link: '/zh/guide/backend/introduction' },
                { text: '目录结构', link: '/zh/guide/backend/dir' }
              ]
            },
            {
              text: 'CLI 参考',
              items: [
                { text: '概览', link: '/zh/guide/cli/index' },
                { text: 'hohu build', link: '/zh/guide/cli/build' },
                { text: 'hohu deploy', link: '/zh/guide/cli/deploy' }
              ]
            }
          ]
        },
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
    logo: '/logo.png',
    outline: {
      level: [2, 3]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/aihohu/hohu-admin' }],
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
