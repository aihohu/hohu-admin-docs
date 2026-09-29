---
title: hohu deploy 与迁移
description: HoHu hohu deploy 与迁移的使用步骤、适用范围与限制
---

# hohu deploy 与迁移

使用部署命令前，安装与应用配套的 CLI；命令选项可通过 `hohu deploy --help` 查看，组件发行记录见[更新说明](../reference/versions)。

| 命令                                | 行为                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| `hohu deploy init`                  | 生成/补齐 `.hohu/deploy` 配置；`--force` 会覆盖需更新的模板，先保存自定义内容 |
| `hohu deploy`                       | 拉取适用镜像、准备基础服务、迁移并同步种子，然后启动                          |
| `hohu deploy --no-migrate`          | 跳过迁移阶段及该阶段的种子同步，仅用于确认无需更新的受控场景                  |
| `hohu migrate`                      | 单独运行部署迁移及种子同步，不接受额外初始化开关                              |
| `hohu deploy pull`                  | 更新镜像后迁移、同步种子并启动，不是纯下载                                    |
| `hohu deploy upgrade`               | 拉取源码、构建、停止再部署；可用 --no-cache，存在停机窗口                     |
| `hohu deploy restart [SERVICES...]` | 重启服务，不代替版本迁移                                                      |
| `hohu deploy down`                  | 停止 Compose 服务，不是删除业务数据的重置命令                                 |

```bash
hohu deploy ps
hohu deploy logs -f hohu-admin-api
hohu deploy restart hohu-admin-api
```

默认部署自动同步基础数据，**不再使用 `hohu deploy --init` 或 `hohu migrate --init`**。重复执行保留密码、自定义内容及已有授权，任一迁移/种子失败阻断正常启动。

使用外部数据库/Redis 时，先核对匹配版本对各个命令的基础服务编排支持，不假定所有维护子命令都会识别同一外部服务配置。

环境配置调整、备份、维护窗口及回滚责任见[升级指南](../operations/upgrade)。源码构建说明见 [hohu build](./build)。
