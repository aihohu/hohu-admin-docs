export const homeContent = {
  zh: {
    eyebrow: '开源 · AI 原生 · 自主部署',
    title: '构建 AI 原生',
    accent: '业务应用',
    intro: '将业务界面、AI 能力、权限与数据连接起来。HoHu 为企业应用提供统一基础，让你专注于自己的业务。',
    start: '快速开始',
    demo: '查看演示',
    source: '查看源码',
    panelTitle: '让 AI 参与业务',
    panelLabel: '操作流程示意',
    scenarios: [
      {
        title: '查询用户',
        prompt: '帮我查找销售部门的用户。',
        steps: ['理解查询条件', '检查功能权限与数据范围', '查询可访问的用户'],
        result: '以结构化结果呈现，继续查看或追问。'
      },
      {
        title: '调整部门',
        prompt: '把这个部门移到华东分公司下面。',
        steps: ['定位并核对目标部门', '展示变更内容，等待确认', '确认后执行并返回结果'],
        result: '有歧义时先澄清，有影响的操作先确认。'
      },
      {
        title: '管理角色',
        prompt: '帮我创建一个客服角色。',
        steps: ['确认角色名称与必要信息', '检查授权并展示操作', '确认后创建角色'],
        result: '创建角色后，由管理员按业务需要配置权限。'
      }
    ],
    panelNote: '示例用于说明交互流程。实际结果取决于已启用的能力和当前账号权限。',
    foundationLabel: '平台基础',
    foundationTitle: '从你的业务开始',
    foundationDesc: '身份、权限、文件和任务是业务应用的共同需求。把这些基础连接好，再构建属于你的功能。',
    foundations: [
      ['身份与权限', '用户、角色、部门和数据范围，为页面操作和 AI 调用提供一致的授权边界。', 'auth'],
      ['AI 与业务协作', '配置模型与智能体，让对话通过受控工具进入业务流程。', 'user/ai'],
      ['租户与数据', '在独立租户上下文中组织用户与业务数据，按需要部署单租户或多租户环境。', 'operations/tenants'],
      ['文件、任务与设置', '复用文件策略、定时任务和系统设置，减少重复的基础开发。', 'backend/introduction']
    ],
    buildLabel: '业务扩展',
    buildTitle: '把业务规则变成应用',
    buildDesc: '从模型和接口，到表单、列表与权限，在同一套应用结构中逐步实现你的业务。',
    buildSteps: [
      ['定义数据', '建立业务模型、关联关系与租户归属。'],
      ['连接界面', '实现接口、列表与表单，补齐操作权限。'],
      ['接入 AI', '为合适的任务提供受控工具，明确确认与执行边界。']
    ],
    buildLink: '开发第一个业务模块',
    cliLabel: '开发与交付',
    cliTitle: '一个 CLI，贯穿开发与部署',
    cliDesc: '创建项目、初始化环境、启动开发服务，再构建并部署到自己的服务器。',
    cliPrereq: '开始前准备 Git、uv、Node.js、pnpm，以及 PostgreSQL 和 Redis。完整安装步骤见快速开始。',
    cliLink: '阅读快速开始',
    deployLink: '查看部署指南',
    terminalLabel: '创建并启动项目',
    ownLabel: '开源与自主部署',
    ownTitle: '掌握自己的代码与数据',
    ownDesc: '阅读和修改源代码，在自己的基础设施上运行 HoHu。沿用熟悉的 Vue、Python 与数据库工具扩展应用。',
    ownItems: [
      ['开源代码', '查看实现、参与贡献，按项目许可证使用和扩展。'],
      ['自主部署', '使用 CLI 与 Docker 交付到自己的基础设施。'],
      ['开放的开发基础', '基于 FastAPI、Vue、PostgreSQL 和 Redis 构建。']
    ],
    ecosystemTitle: '协同工作的项目',
    repos: [
      ['hohu-admin', '后端与平台核心'],
      ['hohu-admin-web', 'Web 应用界面'],
      ['hohu-cli', '开发与部署工具']
    ],
    docsTitle: '找到你的下一步',
    docs: [
      ['使用指南', '了解账号、权限、设置和 AI 助手。', 'user/'],
      ['开发指南', '构建业务模块，并连接 AI 工具。', 'development/'],
      ['CLI', '从项目创建到构建部署的统一入口。', 'cli/'],
      ['部署与运维', '安装、升级、备份和维护应用。', 'operations/'],
      ['参考资料', '查阅命令、配置项与接口约定。', 'reference/']
    ],
    footer: '面向 AI 原生业务应用的开源平台。',
    license: '源码与许可',
    feedback: '问题反馈',
    contribute: '参与贡献'
  },
  en: {
    eyebrow: 'OPEN SOURCE · AI NATIVE · SELF HOSTED',
    title: 'Build AI-native',
    accent: 'business applications',
    intro:
      'Connect business interfaces, AI, permissions and data. HoHu gives your applications a shared foundation so you can focus on your business.',
    start: 'Get started',
    demo: 'Explore the demo',
    source: 'View source',
    panelTitle: 'Bring AI into your business',
    panelLabel: 'Interaction walkthrough',
    scenarios: [
      {
        title: 'Find users',
        prompt: 'Find the users in the sales department.',
        steps: ['Understand the search', 'Check permissions and data scope', 'Query accessible users'],
        result: 'Review structured results and continue with a follow-up.'
      },
      {
        title: 'Move a department',
        prompt: 'Move this department under the East branch.',
        steps: [
          'Identify and verify the department',
          'Preview the change for confirmation',
          'Execute after confirmation'
        ],
        result: 'Clarify ambiguous requests and confirm consequential changes.'
      },
      {
        title: 'Manage roles',
        prompt: 'Create a customer support role.',
        steps: [
          'Confirm the name and required details',
          'Check access and preview the action',
          'Create the role after confirmation'
        ],
        result: 'An administrator then configures the permissions the role needs.'
      }
    ],
    panelNote:
      'An illustration of the interaction flow. Actual results depend on enabled capabilities and the current account’s permissions.',
    foundationLabel: 'PLATFORM FOUNDATION',
    foundationTitle: 'Start with your business',
    foundationDesc:
      'Identity, permissions, files and jobs are common building blocks. Connect them once, then build the features your application needs.',
    foundations: [
      [
        'Identity and permissions',
        'Users, roles, departments and data scope provide authorization boundaries for both interfaces and AI tools.',
        'auth'
      ],
      [
        'AI in business workflows',
        'Configure models and agents, then connect conversations to business actions through controlled tools.',
        'user/ai'
      ],
      [
        'Tenants and data',
        'Organize users and business records in trusted tenant contexts, with single-tenant and hosted deployment options.',
        'operations/tenants'
      ],
      [
        'Files, jobs and settings',
        'Reuse upload policies, scheduled jobs and system settings across your applications.',
        'backend/introduction'
      ]
    ],
    buildLabel: 'BUSINESS EXTENSIONS',
    buildTitle: 'Turn business rules into applications',
    buildDesc:
      'Build your models, APIs, forms, tables and permissions together within a consistent application structure.',
    buildSteps: [
      ['Define your data', 'Model records, relationships and tenant ownership.'],
      ['Connect the interface', 'Build APIs, lists and forms with explicit permissions.'],
      [
        'Add AI capabilities',
        'Expose suitable tasks through controlled tools with clear confirmation and execution boundaries.'
      ]
    ],
    buildLink: 'Build your first business module',
    cliLabel: 'DEVELOPMENT & DELIVERY',
    cliTitle: 'One CLI, from development to deployment',
    cliDesc:
      'Create a project, initialize its environment and start development. Then build and deploy it on your own server.',
    cliPrereq: 'Prepare Git, uv, Node.js, pnpm, PostgreSQL and Redis. The quick start covers the complete setup.',
    cliLink: 'Read the quick start',
    deployLink: 'Deployment guide',
    terminalLabel: 'Create and start a project',
    ownLabel: 'OPEN SOURCE & SELF HOSTED',
    ownTitle: 'Your code. Your data.',
    ownDesc:
      'Read and modify the source, run HoHu on your infrastructure, and extend applications using familiar Vue, Python and database tools.',
    ownItems: [
      ['Open source', 'Inspect the implementation and contribute under the project’s license.'],
      ['Self hosted', 'Deliver to your own infrastructure with the CLI and Docker.'],
      ['An open development foundation', 'Build on FastAPI, Vue, PostgreSQL and Redis.']
    ],
    ecosystemTitle: 'Projects that work together',
    repos: [
      ['hohu-admin', 'Backend and platform core'],
      ['hohu-admin-web', 'Web application interface'],
      ['hohu-cli', 'Development and deployment tooling']
    ],
    docsTitle: 'Choose your next step',
    docs: [
      ['User guide', 'Learn accounts, permissions, settings and the AI assistant.', 'user/'],
      ['Development', 'Run the source and build business features.', 'development/'],
      ['CLI', 'Create, develop, build and deploy your project.', 'cli/'],
      ['Deployment', 'Install, upgrade, back up and maintain applications.', 'operations/'],
      ['Reference', 'Look up commands, configuration and API conventions.', 'reference/']
    ],
    footer: 'The open-source platform for AI-native business applications.',
    license: 'Source and licensing',
    feedback: 'Report an issue',
    contribute: 'Contribute'
  }
};
