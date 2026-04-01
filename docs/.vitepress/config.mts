import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "HoHu Admin",
  description: "AI 驱动的企业级后台管理平台",
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    outline: {
      level: [2, 3]
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '功能', link: '/#features' },
      { text: '文档', link: '/guide/quick-start' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '快速上手', link: '/guide/quick-start' },
            { text: '在线演示', link: '/guide/show' },
            { text: '源码', link: '/guide/src' },
          ]
        },
        {
          text: '教程',
          items: [
            { text: 'AI 编程', link: '/guide/ai-coding' },
            { text: '权限控制', link: '/guide/auth' },
            { text: '分页', link: '/guide/page' },
          ]
        },
        {
          text: '后端文档',
          items: [
            { text: '介绍', link: '/guide/backend/introduction' },
            { text: '目录结构', link: '/guide/backend/dir' },
          ]
        },
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aihohu/hohu-admin' }
    ],
    search: {
      provider: 'local'
    }
  }
})
