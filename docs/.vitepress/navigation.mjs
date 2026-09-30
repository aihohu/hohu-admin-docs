// Paths are shared by both languages and also define the publication inventory.
export const sections = [
  {
    en: 'CLI',
    zh: 'CLI',
    path: 'cli/index',
    pages: [
      ['cli/index', 'Overview and installation', '概览与安装'],
      ['cli/skills', 'Install Skills', '安装 Skills'],
      ['cli/build', 'hohu build', 'hohu build'],
      ['cli/deploy', 'hohu deploy', 'hohu deploy']
    ]
  },
  {
    en: 'User guide',
    zh: '使用指南',
    path: 'user/index',
    pages: [
      ['user/index', 'Start here', '从这里开始'],
      ['introduction', 'Introduction', '项目介绍'],
      ['user/account', 'Account and sign-in', '账号与登录'],
      ['user/access', 'Users, roles and departments', '用户、角色与部门'],
      ['user/settings', 'System settings', '系统设置'],
      ['user/parameters', 'Custom parameters', '自定义参数'],
      ['user/files', 'Files and uploads', '文件与上传'],
      ['user/ai', 'AI assistant', 'AI 助手'],
      ['user/faq', 'Troubleshooting', '常见问题'],
      ['show', 'Live demo', '在线演示']
    ]
  },
  {
    en: 'Development',
    zh: '开发指南',
    path: 'development/index',
    pages: [
      ['development/index', 'Development overview', '开发入口'],
      ['quick-start', 'Development quick start', '开发环境'],
      ['backend/introduction', 'Backend architecture', '后端架构'],
      ['backend/dir', 'Repository structure', '目录结构'],
      ['development/module', 'Add a module', '新增业务模块'],
      ['development/ai-tools', 'Connect a module to AI', '让 AI 使用业务模块'],
      ['auth', 'API and button permissions', '接口与按钮权限'],
      ['data-permission', 'Data scope', '数据范围'],
      ['page', 'Pagination', '分页查询'],
      ['file-upload', 'Upload integration', '上传接入'],
      ['backend/cache', 'Caching', '缓存'],
      ['scheduled-job', 'Scheduled jobs', '定时任务'],
      ['development/i18n', 'Internationalization', '国际化'],
      ['ai-coding', 'AI-assisted development', 'AI 辅助开发'],
      ['desktop/introduction', 'Desktop overview', '桌面端介绍'],
      ['desktop/quick-start', 'Desktop quick start', '桌面端开发'],
      ['desktop/architecture', 'Desktop architecture', '桌面端架构'],
      ['desktop/features', 'Desktop features', '桌面端功能']
    ]
  },
  {
    en: 'Deployment',
    zh: '部署与运维',
    path: 'operations/index',
    pages: [
      ['operations/index', 'Deployment overview', '部署入口'],
      ['deploy', 'Deploy with CLI', '使用 CLI 部署'],
      ['operations/upgrade', 'Upgrade and recovery', '升级、备份与恢复'],
      ['operations/tenants', 'Multi-tenancy', '多租户管理'],
      ['operations/ai', 'AI deployment', 'AI 配置与运维']
    ]
  },
  {
    en: 'Reference',
    zh: '参考资料',
    path: 'reference/index',
    pages: [
      ['reference/index', 'Reference overview', '参考入口'],
      ['reference/versions', 'Release notes', '更新说明'],
      ['reference/configuration', 'Configuration ownership', '配置项归属'],
      ['reference/settings', 'Settings API', '设置接口与上传策略'],
      ['reference/api', 'API reference', 'API 参考'],
      ['backend/error-code', 'Error handling', '错误处理'],
      ['backend/error-code-list', 'Common error codes', '常见错误码'],
      ['src', 'Source and licensing', '源码与许可']
    ]
  }
];

export const guidePaths = sections.flatMap(section => section.pages.map(([path]) => path));
export const pagePaths = [
  'index.md',
  'zh/index.md',
  ...guidePaths.flatMap(path => [`guide/${path}.md`, `zh/guide/${path}.md`])
];

export function navigation(lang) {
  const prefix = lang === 'zh' ? '/zh' : '';
  const linkFor = path => `${prefix}/guide/${path.replace(/index$/, '')}${path.endsWith('index') ? '' : '.html'}`;
  const sidebar = {};
  for (const section of sections) {
    const group = [
      {
        text: section[lang],
        items: section.pages.map(([path, en, zh]) => ({ text: lang === 'zh' ? zh : en, link: linkFor(path) }))
      }
    ];
    for (const [path] of section.pages) {
      sidebar[`${prefix}/guide/${path}`] = group;
      if (path.endsWith('/index')) sidebar[`${prefix}/guide/${path.slice(0, -5)}`] = group;
    }
  }
  return {
    nav: [
      ...sections.map(section => ({
        text: section[lang],
        link: linkFor(section.path),
        activeMatch: `^${prefix}/guide/(?:${section.pages.map(([path]) => (path.endsWith('/index') ? `${path.slice(0, -5)}(?:index(?:\\.html)?)?` : `${path}(?:\\.html)?`)).join('|')})(?:$|[?#])`
      })),
      { text: lang === 'zh' ? '问题反馈' : 'Report an issue', link: 'https://github.com/aihohu/hohu-admin/issues' }
    ],
    sidebar
  };
}
