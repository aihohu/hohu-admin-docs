import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'HoHu Admin',
  description: 'AI 驱动的企业级后台管理平台',
  appearance: 'dark',
  sitemap: {
    hostname: 'https://hohu.org'
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'HoHu Admin' }],
    ['meta', { property: 'og:title', content: 'HoHu Admin - AI 驱动的企业级后台管理平台' }],
    [
      'meta',
      {
        property: 'og:description',
        content: '基于 FastAPI & Vue3 的 AI 协作开发框架，RBAC 权限、Snowflake ID、异步全链路'
      }
    ],
    ['meta', { property: 'og:image', content: 'https://hohu.org/images/home.jpeg' }],
    ['meta', { property: 'og:url', content: 'https://hohu.org' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'HoHu Admin - AI 驱动的企业级后台管理平台' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: '基于 FastAPI & Vue3 的 AI 协作开发框架，RBAC 权限、Snowflake ID、异步全链路'
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
  themeConfig: {
    logo: '/logo.png',
    outline: {
      level: [2, 3]
    },
    nav: [
      { text: '首页', link: '/' },
      // { text: '功能', link: '/#features' },
      { text: '文档', link: '/guide/quick-start' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '快速上手', link: '/guide/quick-start' },
            { text: '部署指南', link: '/guide/deploy' },
            { text: '在线演示', link: '/guide/show' },
            { text: '源码', link: '/guide/src' }
          ]
        },
        {
          text: '教程',
          items: [
            { text: 'AI 编程', link: '/guide/ai-coding' },
            { text: '权限控制', link: '/guide/auth' },
            { text: '数据权限', link: '/guide/data-permission' },
            { text: '分页', link: '/guide/page' },
            { text: '文件上传', link: '/guide/file-upload' },
            { text: '定时任务', link: '/guide/scheduled-job' }
          ]
        },
        {
          text: '后端文档',
          items: [
            { text: '介绍', link: '/guide/backend/introduction' },
            { text: '目录结构', link: '/guide/backend/dir' }
          ]
        },
        {
          text: 'CLI 参考',
          items: [
            { text: '概览', link: '/guide/cli/index' },
            { text: 'hohu build', link: '/guide/cli/build' },
            { text: 'hohu deploy', link: '/guide/cli/deploy' }
          ]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/aihohu/hohu-admin' }],
    search: {
      provider: 'local'
    }
  }
});
