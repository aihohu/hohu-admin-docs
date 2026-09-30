---
title: 数据范围
description: HoHu 数据范围的使用步骤、适用范围与限制
---

# 数据范围

功能权限控制操作，数据范围控制本租户内可操作的记录。多个启用角色的实际范围取并集，不按数字等级简单选一个“最高角色”。

## 统一入口

`app/utils/data_scope.py` 提供 `resolve_data_scope`、通用模型的 `get_data_scope_filters` 和多对多部门 User 模型的 `get_user_data_scope_filters`，均显式传入 `tenant=tenant`。`get_best_scope` 只用于历史审计，不用于新业务。

通用 `get_data_scope_filters` 在全部范围时可能返回空条件，不自动补模型租户过滤。以下是服务内查询构造片段，model、db、current_user 和可信 tenant 由服务参数提供：

```python
from app.core.tenant_scope import tenant_filter
from app.utils.data_scope import get_data_scope_filters

filters = [tenant_filter(model, tenant=tenant)]
filters.extend(
    await get_data_scope_filters(db, current_user, model, tenant=tenant)
)
```

默认字段为 `dept_id`、`create_by`，其他命名通过 `dept_field`、`user_field` 指定。User 使用专用函数处理多对多部门关系。

## 选择业务范围

先明确资源是租户共享、严格本人私有，还是由角色配置数据范围。[便签教程](./development/module)采用租户共享策略，配置角色部门范围不会自动改变它的可见性。需要角色范围的模块必须将解析结果接入 Service 查询。

使用资源实际的权限字段：部门归属模型可使用上述通用过滤器；按报修人或所有者授权的模型可结合 `resolve_data_scope` 的 `accessible_user_scope` 过滤对应用户 ID。明确范围按用户当前部门还是业务记录保存的部门计算，避免用户调动后行为不一致。

AI 确认执行和历史结果读取时重新加载当前授权。目标后端提供 `app/modules/auth/service.py` 的 `load_live_user_authority`，再由统一范围解析器计算可访问范围；旧确认或缓存中的用户对象不能保留已撤销权限。接口、AI 预演、执行和历史投影复用相同数据策略。

## 使用约束

- 全部数据与超管权限始终限制在所属租户。
- 列表、count、详情、修改、删除、导出使用相同边界，不先查整表再在 Python 过滤。
- 关联表、部门树和自定义范围也必须校验租户归属。
- 未知范围或无有效授权采用受限回退，不把空部门集当成全部数据。

回归覆盖范围并集、仅本人回退、禁用角色、跨租户及同名部门。旧算法迁移需要范围差异审计，不直接复制历史选择最大/最小等级的实现。管理员配置见[用户与角色](./user/access)。
