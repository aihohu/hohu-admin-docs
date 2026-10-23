---
title: 升级、备份与恢复
description: 记录 HoHu 版本，备份数据库、持久文件与密钥，演练升级和恢复，并理解迁移与源码更新的限制。
---

# 升级、备份与恢复

升级包含应用版本、数据库结构、基础数据和运行配置的变化。先记录当前状态，再在隔离环境演练；当前 CLI 没有通用 backup、restore 或自动 rollback 命令。

## 备份清单

| 内容             | 默认位置或来源                        | 恢复时的作用                                         |
| ---------------- | ------------------------------------- | ---------------------------------------------------- |
| PostgreSQL       | hohu-pgdata 卷或外部数据库            | 业务数据、账号、授权与迁移版本                       |
| 公开与私有文件   | 部署目录 uploads、private_uploads     | 图片、导入导出文件和业务附件                         |
| 部署配置         | `.hohu/deploy/.env` 与自定义 override | 连接、密钥、版本与服务拓扑                           |
| 应用与镜像版本   | IMAGE_TAG、镜像 ID/摘要、源码提交     | 与恢复后的数据库匹配                                 |
| 证书与自动化配置 | 实际证书及受控运维配置                | 恢复入口与后续维护                                   |
| Redis            | 对应持久卷或外部服务                  | logout 撤销、已消费 refresh token 与待确认执行上下文 |
| 监控数据         | 对应持久卷或外部服务                  | 按恢复目标保留历史监控                               |

保管 SECRET_KEY 等原密钥；加密保存的 Provider 或邮件凭据不能靠新生成的密钥解密。数据库快照与文件备份应处于可对应的业务时间点，备份保存到独立位置并验证可读。

数据库可使用 PostgreSQL 的逻辑备份或数据库服务商快照。`pg_dump` 不包含数据库角色等集群全局对象，需要单独规划；不要把运行中的数据目录简单复制当作一致备份。具体方式见 [PostgreSQL 备份说明](https://www.postgresql.org/docs/current/backup-dump.html)。

## 升级步骤

1. 记录 CLI、镜像或源码版本，以及数据库当前 Alembic revision；查阅[更新说明](../reference/versions)。
2. 在隔离环境恢复备份，演练目标版本迁移和功能验证。
3. 安排维护窗口，停止入口写入，按下文终止旧写者，完成最后一份一致备份。
4. 选择下表中的更新路径；检查迁移与种子同步退出结果。
5. 验证登录、普通账号权限、租户、设置、文件、任务和 AI，再恢复业务流量。

| 部署方式                | 更新步骤                                                                 |
| ----------------------- | ------------------------------------------------------------------------ |
| 固定产品产物            | 按下文准备 digest 并完成预检，再运行 `hohu deploy --source official`     |
| 其他已发布镜像部署      | 配置兼容的镜像/标签后运行 `hohu deploy pull`；这不证明固定产品组合已验收 |
| 独立组件源码仓库        | 分别更新配套源码，运行 `hohu build`、`hohu deploy`                       |
| 可拉取的项目根 Git 仓库 | 满足前提后可用 `hohu deploy upgrade`                                     |

`pull` 会迁移并启动应用，不是只下载镜像。`upgrade` 只在项目根执行一次 git pull，随后构建、停止与重新部署；不会逐个更新独立组件仓库，也不是无停机升级。完整前提见 [CLI 部署](../cli/deploy)。

不要用 `--no-migrate` 跳过版本必需的结构或种子更新。独立 migrate 的外部依赖限制见[迁移参考](../cli/migrate#limitations)。

## CLI 0.1.16 的固定产物路径 {#fixed-artifacts}

本人工路径使用 CLI 0.1.16 实际提供的 `hohu deploy`，已在 `linux/amd64` 演练全新安装及以原 0.1.5 镜像为来源的升级。候选演练不能替代后续正式构建的资格：必须针对实际发布的 Backend/Web 组合重验。其他平台需要独立证据。

1. 取得已核验的产品 `release.json` 和组件构建记录。登记产品版本、Backend/Web 源码提交、registry、index digest、平台 manifest digest、CLI 版本和基础设施摘要。CLI 0.1.16 不读取或校验 `release.json`，不能从 `latest` 或系列标签推断产品组合。
2. 在独立目录运行 `hohu deploy init`，在 `.hohu/deploy/.env` 设置唯一的 `HOHU_DEPLOY_NAME`、入口拓扑和凭据。保持 PostgreSQL、Redis 私有。hosted 模式的 `RELEASE_BUILD_SHA` 填所选 Backend 的完整源码提交。升级时保留原 `SECRET_KEY` 与存储路径。
3. 部署前下载每个获准的完整引用，例如 `docker pull --platform linux/amd64 <repository>@sha256:<index-digest>`，核对平台 manifest 和本地镜像身份；基础设施也须提前准备。摘要绑定 registry，切换 registry 必须重新核对该 registry 中获准的引用。
4. 写入 `.hohu/deploy/docker-compose.override.yml`，将下列占位符全部替换为已核验引用。模板会给 `API_IMAGE`、`WEB_IMAGE` 追加 `:IMAGE_TAG`，完整 digest 引用应写在 override 的 `image` 字段。

```yaml
x-backend: &backend
  image: <backend-repository>@sha256:<backend-index-digest>
  platform: linux/amd64
  pull_policy: never
  restart: 'no'

services:
  db-migrator:
    <<: *backend
  hohu-admin-api:
    <<: *backend
  hohu-admin-scheduler:
    <<: *backend
    command: ['python', '-c', 'import time; time.sleep(86400)']
  hohu-admin-web:
    image: <web-repository>@sha256:<web-index-digest>
    platform: linux/amd64
    pull_policy: never
    restart: 'no'
  postgres:
    image: <postgres-repository>@sha256:<postgres-index-digest>
    platform: linux/amd64
    pull_policy: never
  redis:
    image: <redis-repository>@sha256:<redis-index-digest>
    platform: linux/amd64
    pull_policy: never
```

验证期间，scheduler 使用同一 Backend 镜像中的等待进程，不启动 APScheduler、不加载任务，也不接收手动任务执行。保持等待状态直到下文的受控恢复步骤。等待在 24 小时后结束；验收超过此时限仍应保持维护。额外启用的代理、监控服务也须固定产物。

5. 按实际 CLI 的文件顺序核对最终 Compose 配置：`docker-compose.yml`、存在时的 `docker-compose.infra.yml`、最后是 `docker-compose.override.yml`；使用相同 `.env`、项目目录和 `migrate` profile。下列 Bash 示例仅输出镜像安全字段；展开的配置含秘密，不得直接打印或保存到公开日志。

```bash
d="$PWD/.hohu/deploy"
compose=(docker compose -f "$d/docker-compose.yml")
if [ -f "$d/docker-compose.infra.yml" ]; then
  compose+=(-f "$d/docker-compose.infra.yml")
fi
compose+=(-f "$d/docker-compose.override.yml" --env-file "$d/.env" --project-directory "$d")
"${compose[@]}" --profile migrate config --format json |
  python -c 'import json,sys; c=json.load(sys.stdin); print(json.dumps({n:{k:s.get(k) for k in ("image","platform","pull_policy")} for n,s in c["services"].items()},indent=2))'
docker image inspect '<repository>@sha256:<index-digest>' \
  --format '{{.Id}} {{.Os}}/{{.Architecture}} {{json .RepoDigests}}'
```

逐项对照 **三个 Backend 服务和 Web** 的获准引用、平台和 `never` 策略，并检查所有本地镜像与基础设施配置。清单缺失/未知、override 不符、平台错误都必须在调用 CLI 前停止。这些属于操作人员预检；CLI 的本地镜像检查不能证明这些条件。固定镜像本地缺失时，CLI 会在迁移前的镜像准备阶段失败。

6. 预检通过后，升级还须先完成下文停写与备份，再从项目目录运行 `hohu deploy --source official`。捕获 migrator 实际 image ID 和退出结果，再核对 API、scheduler、Web 的实际 image ID，证明全程使用同一组产物。CLI 退出成功本身不等于验收通过。

不能把 `hohu deploy pull` 当作仅下载步骤，也不能用 `hohu deploy upgrade` 替代此路径：前者会启动迁移与服务，后者会更新/构建源码并修改镜像配置。固定摘要不会自动映射到另一 registry。

## 维护、旧写者与调度恢复 {#writers-and-jobs}

迁移前关闭新业务写入和确认入口，盘点能写入本数据库或存储的**全部** API、scheduler、worker、维护进程与自动化。关闭其自动重启机制，终止并移除旧进程，包括已暂停的实例，再独立检查数据库剩余客户端连接。关闭代理、租约到期或停用任务记录都不能终止正在执行的写者；手动任务执行还可能绕过任务状态。

同时阻断旧配置重新连接：在目标部署获准连接前撤销旧数据库角色，或轮换密码并终止已有连接。共享数据库须使用获准的角色级操作方案。证明恢复旧容器、使用旧凭据新启旧镜像均不能写入；证据不足就保持维护。随后在同一静默点备份数据库、公开/私有文件、Redis 安全状态、部署配置、原产物和密钥。凭据轮换单独登记；`pg_dump` 不恢复角色密码。

停写期间盘点旧 pending/running 动作，保留原状态、错误和时间。结果未知时按证据核对，不能为解除界面阻塞而重放或改成成功/失败。用当前 Web 和缓存的 0.1.5 Web 同时检查目标 API：未知结果应安全可见，不再次执行，也不显示误导性的失败提示。

验证期间保持 scheduler 等待命令，入口仅允许验收人员。检查登录、普通账号权限、CRUD、两租户边界、配置解密、文件内容、AI 读取、批准/拒绝，以及批准前失权。AI 创建用户须显式配置有效默认密码；缺失时应拒绝动作且不创建用户。

验收通过后，先对照保存的任务清单，只移除 scheduler 的 `command` 覆盖，让基础模板的 `python -m app.scheduler_worker` 生效。重新预检同一 Compose 配置，再使用相同文件/env 参数运行 `docker compose ... up -d --no-deps --pull never hohu-admin-scheduler`，仅重建该服务。核对其 image ID 和一次受控任务执行，再开放业务写入，最后恢复预期的重启策略。

## 支持的数据库起点

当前迁移支持空库和 v0.1.4 发布边界 `bf244f9a8b76`。更早版本先沿对应旧发布链升级到该边界，再切换当前版本。曾运行压缩前实验迁移的开发库不属于自动升级范围。

迁移失败时保留错误和当前 revision；不能用 `stamp head` 把版本号伪装为已升级。准确 head 以匹配版本的 Alembic 输出为准，维护说明见后端仓库 `docs/DATABASE-MIGRATIONS.md`。

## 恢复步骤

1. 保持维护状态，保存失败日志，判断是否已经写入新版本数据。
2. 在隔离目标恢复配套数据库、文件、原密钥和应用版本；避免直接覆盖唯一的原始备份。
3. 保留目标系统停写点最新、完整的 Redis 撤销事实，覆盖业务备份点**之后**的 logout 和 refresh token 消费；恢复数据库后验证这些凭据仍被拒绝。旧 Redis 快照或空缓存可能复活凭据，不能作为安全的认证恢复。
4. Redis 事实缺失时，在写者与入口仍停止的条件下执行下文授权版本方案，保留原共用加密密钥。
5. 验证账号、权限、数据/文件摘要、解密、原镜像实际 ID 与受控调度行为。切回原 0.1.5 也会恢复其已知 AI 完成缺陷，必须继续隔离受影响的 AI 写入口或保持维护。该版本设置 `AI_MODULE_ENABLED=false` 后，AI 请求返回 `503 / AI_MODULE_DISABLED`；任何有限开放前都须核实。

切回旧镜像不会自动恢复数据库。downgrade 可能删除表或字段，不能代替经过演练的数据恢复。记录恢复点与可能的数据差异，避免将旧文件配上新数据库继续运行。

### Redis 丢失与授权版本重用 {#authorization-recovery}

恢复 `auth_version = 1` 后简单加到 `2`，可能重新激活曾以版本 `2` 签发的 token。恢复前须在外部保存完整最高水位，覆盖所有受影响用户的 `auth_version`、租户的 `row_version`，以及备份点之后签发 token 使用过的版本，包括之后已被删除的身份。只查当前数据库最大值不能证明这段历史。

全部写者停止时，选取严格高于恢复库版本及已证明最高水位、且未超出数据库整数范围的正整数。在一个受控事务中，将**全部恢复用户**的 `auth_version` 和**全部恢复租户**的 `row_version` 设为此新值。这是运维维护数据库的步骤，不是 CLI 自动回滚功能。重开入口前验证备份前后 token、已 logout access、已消费 refresh 均失效，以及新登录可用。水位不完整、不可得或已耗尽时保持维护并补齐证据，不能猜测版本值或随意轮换共用 `SECRET_KEY`。
