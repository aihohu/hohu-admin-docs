---
title: Error Codes
description: HoHu Admin error code reference — exception hierarchy, unified error response format, and frontend i18n mapping guide
---

# Error Codes

HoHu Admin uses a unified error response format with machine-readable `errorCode` fields for frontend i18n mapping. This page documents the exception hierarchy, response format, and all built-in error codes.

## Response Format

All error responses follow the same envelope:

```json
{
  "code": 401,
  "msg": "Token 无效或已过期",
  "data": null,
  "errorCode": "TOKEN_EXPIRED"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `code` | `int` | HTTP status code |
| `msg` | `string` | Human-readable error message (default language: Chinese) |
| `data` | `any` | Always `null` on error |
| `errorCode` | `string` | Machine-readable error code for i18n mapping. Only present on error responses. |

## Exception Hierarchy

All business exceptions inherit from `BusinessException` defined in `app/core/exceptions.py`:

```
BusinessException          # Base class (code, message, data, error_code)
├── NotFoundException      # 404 — resource not found
├── DuplicateException     # 400 — duplicate field value
├── AuthenticationException  # 401 — authentication failure
├── AuthorizationException   # 403 — permission denied
└── BusinessRuleException    # 400 — general business rule violation
    └── InvalidParameterException  # 400 — invalid parameter
```

::: tip Rule: Never use raw HTTPException
Always raise exceptions from `app/core/exceptions.py` in business code. FastAPI's native `HTTPException` is handled by a global handler that normalizes its format, but custom exceptions provide `errorCode` support.
:::

## Built-in Error Codes

For the complete error code list, see [Error Code Reference](./error-code-list).

## Frontend i18n Mapping

The frontend maps `errorCode` to localized messages via Vue I18n.

### Type Definitions

Defined in `src/typings/app.d.ts`:

```typescript
errorCode: {
  UNAUTHORIZED: string;
  INVALID_CREDENTIALS: string;
  TOKEN_EXPIRED: string;
  ACCOUNT_DISABLED: string;
  // ... other codes
}
```

### Locale Files

**Chinese** (`src/locales/langs/zh-cn.ts`):

```typescript
errorCode: {
  UNAUTHORIZED: '登录已过期，请重新登录',
  INVALID_CREDENTIALS: '用户名或密码错误',
  TOKEN_EXPIRED: '登录已过期，请重新登录',
  ACCOUNT_DISABLED: '账号已被禁用',
}
```

**English** (`src/locales/langs/en-us.ts`):

```typescript
errorCode: {
  UNAUTHORIZED: 'Session expired, please login again',
  INVALID_CREDENTIALS: 'Invalid username or password',
  TOKEN_EXPIRED: 'Session expired, please login again',
  ACCOUNT_DISABLED: 'Account has been disabled',
}
```

### How It Works

The frontend request interceptor in `src/service/request/index.ts` reads `errorCode` from the response and looks up the i18n key:

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

If no i18n mapping exists for a given `errorCode`, it falls back to the backend `msg` field.

## Adding a New Error Code

### Backend

Raise an exception with `error_code` parameter:

```python
from app.core.exceptions import NotFoundException

raise NotFoundException("Order", error_code="ORDER_NOT_FOUND")
```

### Frontend

1. Add the type in `src/typings/app.d.ts`:

```typescript
errorCode: {
  ORDER_NOT_FOUND: string;
  // ...
}
```

2. Add translations in `src/locales/langs/zh-cn.ts` and `src/locales/langs/en-us.ts`:

```typescript
errorCode: {
  ORDER_NOT_FOUND: '订单不存在',
  // ...
}
```

## Related Files

**Backend:**
- `app/core/exceptions.py` — Exception classes and global handlers
- `app/core/base_response.py` — `ResponseModel` and `PageResult`

**Frontend:**
- `src/service/request/index.ts` — Response interceptor with errorCode handling
- `src/typings/app.d.ts` — ErrorCode type definitions
- `src/locales/langs/zh-cn.ts` — Chinese translations
- `src/locales/langs/en-us.ts` — English translations
