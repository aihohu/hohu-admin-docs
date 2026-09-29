---
title: 使用 CLI 部署
description: HoHu 使用 CLI 部署的使用步骤、适用范围与限制
---

# 使用 CLI 部署

使用 hohu-cli 与 Docker Compose 将 HoHu 部署到自己的服务器。开始前准备 Docker、Docker Compose 和 hohu-cli，并确认服务器能够访问镜像源。已有安装请先阅读[升级指南](./operations/upgrade)。

## 首次部署

```bash
hohu create my-project
cd my-project
hohu deploy init
```

检查生成的 `.hohu/deploy/.env`，配置数据库/Redis、镜像版本、站点及密钥等环境信息。保管自动生成的管理员密码，不用示例值覆盖已生成的凭据。使用官方镜像时选择实际已发布且配套的版本；开发源码需要先构建：

```bash
# 使用本地开发源码时
hohu build
# 统一部署入口
hohu deploy
hohu deploy ps
```

部署依次准备基础服务、迁移数据库、同步基础数据，然后启动应用。迁移或初始化失败会停止；默认流程不需要 `--init`。首次安装与更新共用幂等初始化，不重置已有密码、自定义设置或角色授权。

## 启动后核查

使用配置的站点地址登录，从受保护的部署 `.env` 获取首次管理员密码并修改。核对用户与菜单、上传、AI（若启用）及无权限账号的拒绝行为。查看日志：

```bash
hohu deploy logs -f hohu-admin-api
```

API 与 scheduler 分开运行，生产 API 不应使用 `APP_ROLE=all` 配合多个 worker。AI 的 memory 确认模式要求单 worker；扩容必须一起调整并验证 [AI 运行模式](./operations/ai)，不能沿用旧教程中固定 4 worker 的假设。

上传请求体上限由 CLI 根据 `UPLOAD_HARD_MAX_BYTES` 派生并传给代理。业务上传偏好通过[系统设置](./user/settings)调整。外部代理、TLS、备份和私有文件持久化仍需部署者配置并验收。

升级前阅读[恢复指南](./operations/upgrade)。完整命令语义见 [CLI 参考](./cli/deploy)。
