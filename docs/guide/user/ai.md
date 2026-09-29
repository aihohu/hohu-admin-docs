---
title: AI assistant
description: Select an AI assistant, describe a business task, review tool confirmations and resolve model, permission or attachment issues.
---

# AI assistant

A deployer must configure an available model, and administrators must grant AI entry access, role-to-assistant bindings and tool permissions. Signing in, holding a super-administrator role or seeing a shared label does not grant every AI capability.

## Start a conversation

1. Open the AI assistant, select an assistant available to your account and start a conversation.
2. Identify the objects to query or change. Add attachments through the upload entry and follow [File limits](./files).
3. When an action requires confirmation, review its targets, scope and parameters before approving. A cancelled or expired confirmation cannot be reused.
4. Use the actual execution result to determine success, rather than treating generated text as proof of a completed change.

Changes to permissions or tenant status can revoke access to old results, attachments and pending actions. Do not bypass current authorization with old links. Approval does not guarantee execution will continue after the browser disconnects.

Contact an administrator when no assistant or model is available, or the deployer when AI is disabled. See [AI deployment](../operations/ai) for operational diagnosis.

## Interface example

![AI assistant start page with assistant selection and task input](/images/product/ai-assistant-en.png)

Start with a read-only task such as “Find users I am allowed to view.” Specify the search criteria and inspect the results. For a change, identify the target and new values, then review the confirmation card. Available operations depend on the tools bound to the selected assistant.

## Troubleshooting

| Symptom                              | Next step                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| No assistant to select               | Ask an administrator to check assistant status and role bindings             |
| Chat works but business actions fail | Check tool bindings and your business permissions                            |
| Confirmation has expired             | Start the task again and review the new confirmation                         |
| Attachment fails to upload           | Check file type and size limits in the file guide                            |
| Model does not respond               | Ask the deployer to inspect model connectivity, credentials and service logs |
