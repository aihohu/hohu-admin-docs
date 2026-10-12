---
title: Account and sign-in
description: Sign in or register for HoHu, verify a recovery email, reset a forgotten password and manage your profile and avatar.
---

# Account and sign-in

Have your site address and tenant ready. Existing accounts can sign in with a password. Registration and email recovery depend on both tenant policy and email service availability.

## Sign in {#sign-in}

1. Open the address provided by your administrator.
2. If a tenant code is requested, enter the code provided by your administrator. For domain-based access, use the tenant's domain. Accounts in the default tenant and business tenants are separate.
3. Enter your **username and password**, then confirm.
4. Check your identity and available menus. If only your personal account is available, ask an administrator to assign business roles.

The current login page uses password sign-in and has no SMS sign-in or “Remember me” option. Naming an account `admin` does not grant administrator permissions.

## Register an account {#register}

**Before you start:** The login page must offer registration, and you must be able to receive email at the address you use. Registration creates an account in the current tenant, not a new tenant.

1. Select **Register** and enter a username and email address.
2. Select **Send code** and check that inbox.
3. Enter the six-digit code, set a new password and confirm it. Follow the username and password validation shown on the page.
4. After successful submission, return to sign-in and use your new username and password.

The registration email becomes verified. By default, new users have only personal account access. An administrator can configure a non-management role in the same tenant for new registrations. Request any additional business access from your administrator.

If registration is absent or unavailable, ask an administrator for an account. Administrators can configure [account self-service](./settings#account-self-service).

## Manage your account {#profile}

Open your personal account page (profile) from the account menu.

| Task                    | Steps and result                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Update personal details | Edit your nickname, gender or phone number in Basic information and confirm; your username is read-only here |
| Change your avatar      | Select your avatar, choose a preset or upload an image, confirm and check the result                         |
| Change your email       | Email is read-only in Basic information; verify a new address under Recovery email                           |
| Change your password    | In the password tab, enter the old password, new password and confirmation; sign in again after saving       |
| Change display language | Use the language selector; names and business content you entered are not translated                         |

## Verify or replace your recovery email {#recovery-email}

**Before you start:** Sign in, have your current password ready and check that email service is available.

1. Open **Personal account → Recovery email** and check its verification status.
2. Enter the email address and your current password, then send a code.
3. Check that inbox, enter the six-digit code and submit verification.
4. Confirm that the page shows the email as verified. Use this address for future password recovery.

An email already present on an older account is not necessarily verified. An address changed by an administrator or an import must also be verified again by the user. If you lose access to your mailbox but can still sign in, replace your recovery email first.

## Recover a forgotten password {#reset-password}

**Before you start:** The login page must offer password recovery, your account must be enabled, and you must have access to its verified recovery email.

1. On the correct tenant's login page, select **Forgot password**.
2. Enter your username and its verified email address, then send a code.
3. Check your email and submit the code, new password and password confirmation.
4. Sign in with the new password. All previous sessions for the account become invalid, including sessions on other devices.

The send action displays a generic message. Recovery email is sent only when the account matches a verified email address. The message does not confirm a match or delivery.

If you have no verified email, cannot receive mail, have a disabled account or cannot access recovery, contact an authorized administrator. See [Administrator password reset](./users#reset-password).

## Verification code problems {#verification-code}

- Check the email spelling, current tenant, spam folder and possible delivery delays.
- Codes last 5 minutes by default; use the expiry shown on the page. Wait for the resend countdown, normally 60 seconds.
- After resending, use the latest code. Registration, email binding and password recovery codes are not interchangeable.
- After changing the username, email or tenant, request a matching code again. Follow retry instructions after repeated failures or rate limiting.

If the problem continues, give an administrator the time, error message and a redacted screenshot to investigate [email service](./settings#mail). Do not share passwords or codes.
