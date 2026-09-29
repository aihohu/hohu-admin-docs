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

## 使用约束

- 全部数据与超管权限始终限制在所属租户。
- 列表、count、详情、修改、删除、导出使用相同边界，不先查整表再在 Python 过滤。
- 关联表、部门树和自定义范围也必须校验租户归属。
- 未知范围或无有效授权采用受限回退，不把空部门集当成全部数据。

回归覆盖范围并集、仅本人回退、禁用角色、跨租户及同名部门。旧算法迁移需要范围差异审计，不直接复制历史选择最大/最小等级的实现。管理员配置见[用户与角色](./user/access)。
