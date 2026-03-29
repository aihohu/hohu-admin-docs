---
layout: home

hero:
  name: "HoHu Admin"
  text: "AI 驱动的企业级管理生态"
  tagline: 对话即操作，一个平台覆盖 ERP、CRM、OA、电商、IoT 全业务场景
  image:
    src: /logo.png
    alt: HoHu Admin
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 查看演示
      link: https://admin.hohu.org
    - theme: alt
      text: GitHub
      link: https://github.com/aihohu/hohu-admin

features:
  - icon: ❇️
    title: AI 对话即操作
    details: 用自然语言管理一切：告诉 AI「添加用户」「统计本月销售额」「审批请假」，自动完成操作并返回结果。
    link: /guide/ai-coding
    linkText: 了解 AI 能力
  - icon: 🏢
    title: 完整业务生态
    details: 内置 ERP、CRM、OA、电商、IoT 等业务模块，开箱即用，也可按需自由组合。
    link: /guide/introduction
    linkText: 了解更多
  - icon: 🧩
    title: 模块化架构
    details: 每个业务域独立解耦，插拔式设计，从单一模块起步，按需扩展至完整企业系统。
    link: /guide/introduction
    linkText: 查看架构
  - icon: ⚡
    title: 异步高性能
    details: 全链路 async/await，FastAPI + SQLAlchemy 2.0 异步 ORM，支撑大规模业务并发。
  - icon: 🔐
    title: 企业级权限
    details: JWT + RBAC 角色权限体系，精细到按钮级，支持数据权限与动态路由。
    link: /guide/auth
    linkText: 了解权限控制
  - icon: 📱
    title: 多端统一覆盖
    details: 后端 API 统一，Web (Vue3) + 移动端 (UniApp) 一套后端，多端发布。
---
