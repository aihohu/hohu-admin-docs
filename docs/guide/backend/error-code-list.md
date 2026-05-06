---
title: Error Code Reference
description: Complete list of all HoHu Admin error codes for quick lookup
---

# Error Code Reference

A complete list of all built-in error codes. For details on the response format and how to add new error codes, see [Error Codes](./error-code).

## All Error Codes

| errorCode | HTTP | Module | Message | Scenario |
|-----------|------|--------|---------|----------|
| `UNAUTHORIZED` | 401 | Auth | Session expired | OAuth2 or native HTTPException 401 |
| `INVALID_CREDENTIALS` | 401 | Auth | Invalid username or password | Login credentials verification failed |
| `TOKEN_EXPIRED` | 401 | Auth | Token invalid or expired | JWT decode failure or user not found |
| `ACCOUNT_DISABLED` | 403 | Auth | Account has been disabled | User status is disabled |
| `AI_PROVIDER_NOT_FOUND` | 404 | AI | AI provider not found | Provider ID does not exist |
| `AI_CONVERSATION_NOT_FOUND` | 404 | AI | AI conversation not found | Conversation ID does not exist |
| `AI_MODEL_NOT_CONFIGURED` | 400 | AI | AI model not configured | No model configured for provider |
| `AI_PROVIDER_DUPLICATE` | 400 | AI | Provider code already exists | Duplicate provider code |
| `AI_TEST_NO_MODEL` | 400 | AI | No model configured | No model for connectivity test |
| `AI_TEST_NO_API_KEY` | 400 | Missing API Key | No API key for connectivity test |
| `AI_TEST_FAILED` | 400 | AI | Connectivity test failed | Provider connection test failed |
