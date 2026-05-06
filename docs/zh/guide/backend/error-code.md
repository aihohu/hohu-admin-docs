---
title: 错误码
description: HoHu Admin 错误码参考 — 异常层级、统一错误响应格式、前端 i18n 映射指南
---

# 错误码

HoHu Admin 使用统一的错误响应格式，并通过机器可读的 `errorCode` 字段实现前端 i18n 国际化映射。本文档介绍异常层级、响应格式以及所有内置错误码。

## 响应格式

所有错误响应遵循相同的封装结构：

```json
{
  "code": 401,
  "msg": "Token 无效或已过期",
  "data": null,
  "errorCode": "TOKEN_EXPIRED"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | `int` | HTTP 状态码 |
| `msg` | `string` | 人类可读的错误消息（默认中文） |
| `data` | `any` | 错误响应时始终为 `null` |
| `errorCode` | `string` | 机器可读的错误编码，用于前端 i18n 映射。仅在错误响应中出现。 |

## 异常层级

所有业务异常均继承自 `app/core/exceptions.py` 中定义的 `BusinessException`：

```
BusinessException          # 基类 (code, message, data, error_code)
├── NotFoundException      # 404 — 资源不存在
├── DuplicateException     # 400 — 字段值重复
├── AuthenticationException  # 401 — 认证失败
├── AuthorizationException   # 403 — 权限不足
└── BusinessRuleException    # 400 — 业务规则违反
    └── InvalidParameterException  # 400 — 参数无效
```

::: tip 规范：禁止使用原生 HTTPException
业务代码中始终使用 `app/core/exceptions.py` 中的自定义异常。FastAPI 原生 `HTTPException` 虽然有全局处理器统一格式，但自定义异常才支持 `errorCode`。
:::

## 内置错误码

完整的错误码列表请参阅 [错误码速查表](./error-code-list)。

## 前端 i18n 映射

前端通过 Vue I18n 将 `errorCode` 映射为本地化消息。

### 类型定义

定义在 `src/typings/app.d.ts`：

```typescript
errorCode: {
  UNAUTHORIZED: string;
  INVALID_CREDENTIALS: string;
  TOKEN_EXPIRED: string;
  ACCOUNT_DISABLED: string;
  // ... 其他错误码
}
```

### 语言文件

**中文**（`src/locales/langs/zh-cn.ts`）：

```typescript
errorCode: {
  UNAUTHORIZED: '登录已过期，请重新登录',
  INVALID_CREDENTIALS: '用户名或密码错误',
  TOKEN_EXPIRED: '登录已过期，请重新登录',
  ACCOUNT_DISABLED: '账号已被禁用',
}
```

**英文**（`src/locales/langs/en-us.ts`）：

```typescript
errorCode: {
  UNAUTHORIZED: 'Session expired, please login again',
  INVALID_CREDENTIALS: 'Invalid username or password',
  TOKEN_EXPIRED: 'Session expired, please login again',
  ACCOUNT_DISABLED: 'Account has been disabled',
}
```

### 工作原理

前端请求拦截器（`src/service/request/index.ts`）从响应中读取 `errorCode` 并查找 i18n key：

```typescript
const errorCode = error.response?.data?.errorCode;
if (errorCode) {
  const i18nKey = `errorCode.${errorCode}`;
  const i18nMsg = $t(i18nKey);
  if (i18nMsg !== i18nKey) {
    message = i18nMsg;
  }
}
```

如果某个 `errorCode` 没有对应的 i18n 映射，将回退使用后端返回的 `msg` 字段。

## 新增错误码

### 后端

抛出异常时传入 `error_code` 参数：

```python
from app.core.exceptions import NotFoundException

raise NotFoundException("订单", error_code="ORDER_NOT_FOUND")
```

### 前端

1. 在 `src/typings/app.d.ts` 中添加类型：

```typescript
errorCode: {
  ORDER_NOT_FOUND: string;
  // ...
}
```

2. 在 `src/locales/langs/zh-cn.ts` 和 `src/locales/langs/en-us.ts` 中添加翻译：

```typescript
errorCode: {
  ORDER_NOT_FOUND: '订单不存在',
  // ...
}
```

## 相关文件

**后端：**
- `app/core/exceptions.py` — 异常类和全局处理器
- `app/core/base_response.py` — `ResponseModel` 和 `PageResult`

**前端：**
- `src/service/request/index.ts` — 响应拦截器，处理 errorCode
- `src/typings/app.d.ts` — ErrorCode 类型定义
- `src/locales/langs/zh-cn.ts` — 中文翻译
- `src/locales/langs/en-us.ts` — 英文翻译
