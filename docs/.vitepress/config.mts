import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "HoHu Admin",
  description: "基于FastAPI，SQLAlchemy，Vue3 &amp; Naiveui 的前后端分离权限管理系统",
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
  ],
  // locales: {
  //   root: {
  //     label: '简体中文',
  //     lang: 'zh-CN',
  //     link: '/'
  //   },
  //   en: {
  //     label: 'English',
  //     lang: 'en-US',
  //     link: '/en/',
  //     themeConfig: {
  //       nav: [
  //         { text: 'Guide', link: '/en/guide/introduction' },
  //       ],
  //       sidebar: {
  //         '/en/': [
  //           {
  //             text: 'Guide',
  //             items: [
  //               { text: 'Introduction', link: '/en/guide/introduction' },
  //               { text: 'Quick Start', link: '/en/guide/quick-start' }
  //             ]
  //           }
  //         ]
  //       }
  //     }
  //   }
  // },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    outline: {
      level: [2, 3]
    },
    // nav: [
    //   { text: '演示', link: '/guide/show' },
    //   { text: '文档', link: '/guide/introduction' },
    //   { text: '后端文档', link: '/guide/backend/introduction' },
    //   { text: '前端文档', link: '/guide/frontend/introduction' },
    //   { text: '移动端文档', link: '/guide/app/introduction' },
    //   { text: '赞助', link: '/sponsor' },
    // ],
    // sidebar: {
    //   '/': [
    //     {
    //       text: '开始',
    //       items: [
    //         { text: '介绍', link: '/guide/introduction' },
    //         { text: '演示', link: '/guide/show' },
    //         { text: '源码', link: '/guide/src' },
    //       ]
    //     },
    //     {
    //       text: '教程',
    //       items: [
    //         { text: '视频教程', link: '/guide/introduction' },
    //         { text: '快速上手', link: '/guide/quick-start' },
    //         { text: 'AI编程', link: '/guide/ai-coding' },
    //         { text: '权限控制', link: '/guide/auth' },
    //         { text: '分页', link: '/guide/page' },
    //         {
    //           text: '后端文档', items: [
    //             { text: '介绍', link: '/guide/backend/introduction' },
    //             { text: '目录结构', link: '/guide/backend/dir' },
    //             { text: '源码', link: '/guide/backend/src' },
    //           ]
    //         },
    //         {
    //           text: '前端文档', items: [
    //             { text: '介绍', link: '/guide/introduction' },
    //             { text: '演示', link: '/guide/show' },
    //             { text: '源码', link: '/guide/src' },
    //           ]
    //         },
    //         {
    //           text: '移动端文档', items: [
    //             { text: '介绍', link: '/guide/introduction' },
    //             { text: '演示', link: '/guide/show' },
    //             { text: '源码', link: '/guide/src' },
    //           ]
    //         },
    //       ]
    //     }
    //   ]
    // },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/aihohu/hohu-admin' }
    ],

    search: {
      provider: 'local'
    }
  }
})
