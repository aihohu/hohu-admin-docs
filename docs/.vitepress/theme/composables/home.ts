export type HomeLocale = 'zh' | 'en';
export type HomeScenarioId = 'orders' | 'approvals' | 'projects';
export interface GuideEntry {
  title: string;
  text: string;
  path: string;
  link: string;
}
export interface HomeContent {
  nav: {
    platform: string;
    workflow: string;
    guides: { title: string; path: string }[];
    feedback: string;
    menu: string;
    close: string;
    skip: string;
    label: string;
  };
  hero: {
    category: string;
    title: string;
    intro: string;
    demo: string;
    develop: string;
    image: string;
    darkImage: string;
    alt: string;
    caption: string;
    proof: string[];
    screenTitle: string;
    imageLink: string;
  };
  journey: { title: string; items: GuideEntry[] };
  workflow: {
    title: string;
    intro: string;
    mode: 'extension-examples';
    image: string;
    darkImage: string;
    alt: string;
    caption: string;
    imageLink: string;
    disclosure: string;
    scenarios: { id: HomeScenarioId; title: string; text: string; detail: string }[];
    guide: string;
    guidePath: string;
    scenarioLabel: string;
  };
  platform: { title: string; intro: string; clients: { title: string; text: string }; items: GuideEntry[] };
  start: {
    title: string;
    intro: string;
    prerequisites: string;
    cliTitle: string;
    cliIntro: string;
    cliSteps: { title: string; text: string }[];
    ai: {
      title: string;
      intro: string;
      installTitle: string;
      installNote: string;
      promptNote: string;
      copyCommand: string;
      copyPrompt: string;
      copied: string;
      failed: string;
      prompts: { title: string; text: string }[];
      note: string;
      guide: string;
      guidePath: string;
      skills: string;
      skillsPath: string;
    };
    copy: string;
    copied: string;
    failed: string;
    links: GuideEntry[];
  };
  closing: { title: string; text: string };
  footer: {
    title: string;
    description: string;
    questions: { title: string; answer: string }[];
    limitations: string;
    links: GuideEntry[];
    license: string;
  };
}

const cliCommands = ['uv tool install hohu', 'hohu create my-project\ncd my-project', 'hohu init\nhohu dev'];
export const commands = cliCommands.join('\n');
export const skillsInstallCommand = 'npx skills@latest add aihohu/hohu-skills';
export function guideLink(locale: HomeLocale, path: string) {
  return `${locale === 'zh' ? '/zh' : ''}/guide/${path}${path.endsWith('/') ? '' : '.html'}`;
}

export const homeContent: Record<HomeLocale, HomeContent> = {
  zh: {
    nav: {
      platform: '平台能力',
      workflow: 'AI 助手',
      guides: [
        { title: '使用指南', path: 'user/' },
        { title: '开发指南', path: 'development/' },
        { title: '部署与运维', path: 'operations/' }
      ],
      feedback: '问题反馈',
      menu: '打开导航',
      close: '关闭导航',
      skip: '跳到主要内容',
      label: '官网导航'
    },
    hero: {
      category: '开源 · 自主部署',
      title: '企业 AI 原生\n应用平台',
      intro: '开发和部署自己的业务应用，让用户在页面中操作，也能通过 AI 助手查询数据、协助处理业务。',
      demo: '体验 HoHu',
      develop: '立即开始',
      image: '/images/product/ai-assistant-zh.png',
      darkImage: '/images/product/ai-assistant-zh.png',
      alt: 'HoHu AI 助手界面：选择业务任务并开始对话',
      caption: '从一个业务任务开始，让应用和 AI 一起工作。',
      proof: ['开源代码', '自主部署', 'Web / 移动端 / 桌面端'],
      screenTitle: 'HoHu 工作空间',
      imageLink: '查看完整产品画面'
    },
    journey: {
      title: '从开发到使用，围绕同一个应用。',
      items: [
        {
          title: '开发者创建',
          text: '从数据模型到业务页面，复用平台基础。可使用 HoHu Skills 辅助开发，为 AI 助手接入业务工具。',
          path: 'development/module',
          link: '开发第一个业务模块'
        },
        {
          title: '企业部署与管理',
          text: '在自己的环境运行应用，配置租户、角色和模型，管理团队可使用的能力。',
          path: 'operations/',
          link: '了解部署与运维'
        },
        {
          title: '用户与 AI 助手协作',
          text: '在界面中操作，也可以用自然语言发起任务，查看结果并确认需要执行的变更。',
          path: 'user/ai',
          link: '了解 AI 助手'
        }
      ]
    },
    workflow: {
      title: '业务问题，\n直接问 AI 助手',
      intro: '为订单、审批和项目管理应用接入 AI 助手，用自然语言查询业务信息，帮助团队掌握待办和进度。',
      mode: 'extension-examples',
      image: '/images/product/ai-conversation-zh.png',
      darkImage: '/images/product/ai-conversation-zh.png',
      alt: 'HoHu AI 助手的真实用户管理对话，展示统计结果与只读工具执行记录',
      caption: 'AI 助手产品界面 / 用户管理示例',
      imageLink: '打开完整对话截图',
      disclosure: '场景示例需要开发对应业务应用并接入 AI 工具；产品截图为现有用户管理的只读查询。',
      scenarios: [
        {
          id: 'orders',
          title: '订单管理',
          text: '“哪些订单还没处理？”',
          detail: '在订单应用中接入查询工具，按状态和时间筛选待处理订单，帮助团队安排跟进。'
        },
        {
          id: 'approvals',
          title: '审批管理',
          text: '“有哪些待审批事项？”',
          detail: '在审批应用中接入待办和详情查询工具，整理待审批事项与申请内容，由审批人作出决定。'
        },
        {
          id: 'projects',
          title: '项目管理',
          text: '“哪些项目任务已延期？”',
          detail: '在项目应用中接入任务查询工具，整理延期任务、负责人和截止时间，帮助团队跟进进度。'
        }
      ],
      guide: '让 AI 助手使用业务应用',
      guidePath: 'development/ai-tools',
      scenarioLabel: '业务应用场景'
    },
    platform: {
      title: '把基础接好，\n把时间留给业务。',
      intro: '业务界面与 AI 工具共享服务和授权规则。沿用熟悉的 Python 与 Vue，逐步扩展自己的应用。',
      clients: {
        title: '支持多端应用开发',
        text: '基于同一后端，构建适合浏览器、手机和桌面环境的业务应用。'
      },
      items: [
        {
          title: '身份与权限',
          text: '用户、部门、角色与数据范围，连接团队的组织方式和业务操作。',
          path: 'auth',
          link: '查看权限机制'
        },
        {
          title: '租户与数据',
          text: '在可信租户上下文中访问业务数据，按部署模式配置与管理租户。',
          path: 'operations/tenants',
          link: '了解租户管理'
        },
        {
          title: 'AI 与业务工具',
          text: '配置助手、模型与工具授权；对需要确认的操作，先预览，再由用户批准执行。',
          path: 'development/ai-tools',
          link: '为业务接入 AI'
        },
        {
          title: '文件、任务与设置',
          text: '复用文件管理、定时任务和系统设置，为日常业务提供基础支持。',
          path: 'backend/introduction',
          link: '浏览平台基础'
        }
      ]
    },
    start: {
      title: '用 AI 或 CLI，\n开始开发',
      intro: '告诉编程助手你的业务需求，让 HoHu Skills 辅助创建项目和开发模块；也可以使用 CLI 手动创建、运行与部署。',
      prerequisites: '先准备 Git、uv、Node.js、pnpm、PostgreSQL 和 Redis，并按开发环境指南完成配置。',
      cliTitle: '通过 CLI 创建项目',
      cliIntro: '在终端中创建项目、初始化环境并启动开发服务。',
      cliSteps: [
        { title: '安装 HoHu CLI', text: cliCommands[0] },
        { title: '创建并进入项目', text: cliCommands[1] },
        { title: '初始化并启动', text: cliCommands[2] }
      ],
      ai: {
        title: '通过 AI 辅助创建与开发',
        intro: '先安装 Skills，再把需求交给编程助手，按项目规范完成创建、开发与验证。',
        installTitle: '安装 HoHu Skills',
        installNote: '在工作区终端运行，按提示选择编程助手、安装范围和所需 Skills。',
        promptNote: '在该工作区启动编程助手，发送以下需求。',
        copyCommand: '复制命令',
        copyPrompt: '复制需求',
        copied: '已复制',
        failed: '复制未完成，请选中内容手动复制。',
        prompts: [
          {
            title: '创建项目',
            text: '使用 hohu-project 创建 equipment 项目，只需要 Backend 和 Web。检查依赖与数据库配置，初始化并启动，告诉我访问地址和验证结果。'
          },
          {
            title: '开发业务模块',
            text: '使用 hohu-business-module 新增设备借用模块，支持借用、归还和查看记录。普通用户只能查看和归还自己的记录，不能重复借用同一设备。'
          }
        ],
        note: '支持 Claude Code、Cursor、Codex 等编程助手。安装需 Node.js / npx；创建和运行项目还需 HoHu CLI 与开发环境。',
        guide: '查看 AI 开发指南',
        guidePath: 'ai-coding',
        skills: '安装选项与环境要求',
        skillsPath: 'cli/skills'
      },
      copy: '复制命令',
      copied: '已复制',
      failed: '复制未完成，请选中命令手动复制。',
      links: [
        { title: '开发环境指南', text: '', path: 'quick-start', link: '开发环境指南' },
        {
          title: '掌握自己的代码与数据',
          text: '阅读和修改源代码，在自己的基础设施上运行 HoHu。',
          path: 'src',
          link: '查看源码与许可'
        },
        {
          title: '开发自己的业务模块',
          text: '从数据模型、接口到业务页面，为应用接入 AI 工具。',
          path: 'development/module',
          link: '阅读模块开发指南'
        }
      ]
    },
    closing: {
      title: '从一个业务应用开始',
      text: '先体验 HoHu 的界面与 AI 助手，或使用 Skills 与 CLI 开始创建自己的应用。'
    },
    footer: {
      title: '开始之前，你可能想了解',
      description: '面向 AI 原生业务应用的开源平台。',
      questions: [
        {
          title: '现在如何扩展自己的应用？',
          answer:
            '通过源码开发业务模型、接口和页面，再按需注册 AI 工具。文档提供业务便签与 AI 接入教程；教程模块需要自行开发和配置。'
        },
        {
          title: 'AI 可以直接执行所有操作吗？',
          answer:
            '不可以。管理员需要配置模型、助手和工具权限；AI 只可使用已授权的能力，需要确认的操作必须先由用户核对并批准。'
        },
        {
          title: '可以部署到企业自己的环境吗？',
          answer:
            '可以。HoHu 提供 CLI 与 Docker 部署流程，支持在自己的基础设施上运行和维护。环境准备、配置与升级步骤见部署文档。'
        }
      ],
      limitations: '当前通过源码扩展业务；应用市场与第三方业务插件安装尚未开放。',
      links: [
        { title: '使用指南', text: '', path: 'user/', link: '使用指南' },
        { title: '开发指南', text: '', path: 'development/', link: '开发指南' },
        { title: '部署与运维', text: '', path: 'operations/', link: '部署与运维' },
        { title: '源码与许可', text: '', path: 'src', link: '源码与许可' }
      ],
      license: '开源，自主部署。'
    }
  },
  en: {
    nav: {
      platform: 'Platform',
      workflow: 'AI assistant',
      guides: [
        { title: 'User guide', path: 'user/' },
        { title: 'Developer guide', path: 'development/' },
        { title: 'Deployment & operations', path: 'operations/' }
      ],
      feedback: 'Report an issue',
      menu: 'Open navigation',
      close: 'Close navigation',
      skip: 'Skip to content',
      label: 'Site navigation'
    },
    hero: {
      category: 'Open source · Self hosted',
      title: 'The AI-native\nenterprise application platform',
      intro:
        'Build and deploy your business applications. Let people work in the interface or use an AI assistant to query data and help with business tasks.',
      demo: 'Explore HoHu',
      develop: 'Get started',
      image: '/images/product/ai-assistant-en.png',
      darkImage: '/images/product/ai-assistant-en.png',
      alt: 'HoHu AI assistant: choose a business task and start a conversation',
      caption: 'Start with a business task. Bring your application and AI together.',
      proof: ['Open source', 'Self hosted', 'Web / Mobile / Desktop'],
      screenTitle: 'HoHu workspace',
      imageLink: 'View the full product image'
    },
    journey: {
      title: 'One application. From building to everyday work.',
      items: [
        {
          title: 'Developers build',
          text: 'Build models and interfaces on a shared foundation. Use HoHu Skills to assist development and connect business tools to AI assistants.',
          path: 'development/module',
          link: 'Build your first module'
        },
        {
          title: 'Organizations manage',
          text: 'Run on your infrastructure. Configure tenants, roles and models, and manage the capabilities available to your team.',
          path: 'operations/',
          link: 'Explore deployment'
        },
        {
          title: 'People work with AI assistants',
          text: 'Use the interface or ask in natural language. Review results and confirm changes that need your approval.',
          path: 'user/ai',
          link: 'Meet the AI assistant'
        }
      ]
    },
    workflow: {
      title: 'Business questions?\nAsk your AI assistant.',
      intro:
        'Connect an AI assistant to your order, approval and project applications. Ask in natural language to understand pending work and progress.',
      mode: 'extension-examples',
      image: '/images/product/ai-conversation-en.png',
      darkImage: '/images/product/ai-conversation-en.png',
      alt: 'A real HoHu AI assistant conversation showing user statistics and a read-only tool execution record',
      caption: 'AI assistant interface / user management example',
      imageLink: 'Open the full conversation image',
      disclosure:
        'These scenarios require developed business applications and connected AI tools. The product image shows an existing read-only user management query.',
      scenarios: [
        {
          id: 'orders',
          title: 'Order management',
          text: '“Which orders still need attention?”',
          detail:
            'Connect query tools to your order application. Filter pending orders by status and date to help your team plan follow-ups.'
        },
        {
          id: 'approvals',
          title: 'Approval management',
          text: '“What is waiting for approval?”',
          detail:
            'Connect pending-item and detail query tools to your approval application. Summarize requests and their contents so an approver can make the decision.'
        },
        {
          id: 'projects',
          title: 'Project management',
          text: '“Which project tasks are overdue?”',
          detail:
            'Connect task query tools to your project application. Bring together overdue tasks, owners and deadlines to help your team track progress.'
        }
      ],
      guide: 'Connect AI to your business application',
      guidePath: 'development/ai-tools',
      scenarioLabel: 'Business application scenarios'
    },
    platform: {
      title: 'Build on the foundation.\nFocus on your business.',
      intro:
        'Interfaces and AI tools share business services and authorization rules. Extend your application with familiar Python and Vue tools.',
      clients: {
        title: 'Build for web, mobile and desktop',
        text: 'Build business applications for browsers, phones and desktop environments on a shared backend.'
      },
      items: [
        {
          title: 'Identity and permissions',
          text: 'Users, departments, roles and data scope connect your team’s structure to business operations.',
          path: 'auth',
          link: 'Explore permissions'
        },
        {
          title: 'Tenants and data',
          text: 'Access business records in a trusted tenant context. Configure tenants for your deployment mode.',
          path: 'operations/tenants',
          link: 'Explore tenant management'
        },
        {
          title: 'AI and business tools',
          text: 'Configure assistants, models and tool access. Preview operations that require confirmation before approving execution.',
          path: 'development/ai-tools',
          link: 'Connect your module to AI'
        },
        {
          title: 'Files, jobs and settings',
          text: 'Reuse file management, scheduled jobs and application settings for everyday business needs.',
          path: 'backend/introduction',
          link: 'Explore the foundation'
        }
      ]
    },
    start: {
      title: 'Start building\nwith AI or the CLI',
      intro:
        'Describe your needs to a coding assistant. HoHu Skills help create projects and develop modules. Or use the CLI to create, run and deploy your project.',
      prerequisites:
        'Prepare Git, uv, Node.js, pnpm, PostgreSQL and Redis, then configure your environment using the development guide.',
      cliTitle: 'Create a project with the CLI',
      cliIntro: 'Create a project, initialize its environment and start development from your terminal.',
      cliSteps: [
        { title: 'Install HoHu CLI', text: cliCommands[0] },
        { title: 'Create and enter a project', text: cliCommands[1] },
        { title: 'Initialize and start', text: cliCommands[2] }
      ],
      ai: {
        title: 'Create and develop with AI',
        intro:
          'Install Skills, then ask your coding assistant to create, develop and validate with project conventions.',
        installTitle: 'Install HoHu Skills',
        installNote:
          'Run in your workspace terminal, then select your coding assistant, installation scope and Skills.',
        promptNote: 'Start your coding assistant in that workspace and send this request.',
        copyCommand: 'Copy',
        copyPrompt: 'Copy',
        copied: 'Copied',
        failed: 'Could not copy. Select the text and copy it manually.',
        prompts: [
          {
            title: 'Create a project',
            text: 'Use hohu-project to create an equipment project with Backend and Web. Check dependencies and database configuration, initialize and start it, then report the URL and validation results.'
          },
          {
            title: 'Develop a business module',
            text: 'Use hohu-business-module to build equipment loans with borrowing, returns and history. Users can only view and return their own loans. Prevent borrowing the same equipment twice.'
          }
        ],
        note: 'Works with Claude Code, Cursor, Codex and more. Installation needs Node.js / npx; creating and running a project also needs HoHu CLI and a development environment.',
        guide: 'Read the AI development guide',
        guidePath: 'ai-coding',
        skills: 'Installation options and requirements',
        skillsPath: 'cli/skills'
      },
      copy: 'Copy',
      copied: 'Copied',
      failed: 'Could not copy. Select the commands and copy them manually.',
      links: [
        { title: 'Development setup', text: '', path: 'quick-start', link: 'Development setup' },
        {
          title: 'Your code. Your data.',
          text: 'Read and modify the source, and run HoHu on your own infrastructure.',
          path: 'src',
          link: 'View source and licensing'
        },
        {
          title: 'Develop your business module',
          text: 'Build models, APIs and interfaces, then connect AI tools to your application.',
          path: 'development/module',
          link: 'Read the module development guide'
        }
      ]
    },
    closing: {
      title: 'Start with one business application',
      text: 'Explore the HoHu interface and AI assistant, or use Skills and the CLI to start building your own application.'
    },
    footer: {
      title: 'A few things before you start',
      description: 'The open-source platform for AI-native business applications.',
      questions: [
        {
          title: 'How do I extend an application today?',
          answer:
            'Develop business models, APIs and pages in source, then register AI tools where needed. The docs include a business notes tutorial and AI integration guide. You build and configure the tutorial module yourself.'
        },
        {
          title: 'Can AI execute every operation directly?',
          answer:
            'No. An administrator configures models, assistants and tool permissions. AI can only use authorized capabilities. Operations requiring confirmation must be reviewed and approved by a person.'
        },
        {
          title: 'Can we deploy on our own infrastructure?',
          answer:
            'Yes. HoHu provides CLI and Docker deployment workflows to run and maintain your own instance. See the deployment docs for environment setup, configuration and upgrades.'
        }
      ],
      limitations:
        'Business extensions currently use source development. The application marketplace and third-party business plugin installation are not available yet.',
      links: [
        { title: 'User guide', text: '', path: 'user/', link: 'User guide' },
        { title: 'Development', text: '', path: 'development/', link: 'Development' },
        { title: 'Deployment', text: '', path: 'operations/', link: 'Deployment' },
        { title: 'Source and licensing', text: '', path: 'src', link: 'Source and licensing' }
      ],
      license: 'Open source. Self hosted.'
    }
  }
};
