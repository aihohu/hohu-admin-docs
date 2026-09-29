---
title: Error handling
description: 'HoHu error handling: steps, scope and limitations'
---

# Error handling

Business APIs use `{code, msg, data}` and may provide stable `errorCode` for client locale mapping. Do not drive logic by comparing Chinese or English msg strings.

```json
{ "code": 409, "msg": "Settings changed; reload before saving", "data": null, "errorCode": "SETTINGS_CONFLICT" }
```

This illustrates structure, not an exact required message. Clients handle HTTP status, response shape and network failures; proxy rejections may not contain business JSON.

## Add an error

Use domain exceptions from `app/core/exceptions.py` with stable business-specific codes rather than scattered HTTPException calls. Update client locale mappings and positive/negative regression coverage, redacting sensitive logs.

On concurrent changes, reload. Do not retry permission denials into success. Respect Retry-After for 429; investigate switches and dependencies for 503 rather than masking failures with endless retries.

This site provides diagnosis for [Common error codes](./error-code-list), not an exhaustive registry. Target-version code and actual APIs remain authoritative.
