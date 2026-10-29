# Tamkeen Admin – implementation (staged)

This work is deliberately isolated in a feature branch and preview Neon branch. Production is not modified.

## Files
- api/admin.mjs: owner-only backend: bootstrap, scrypt password login, TOTP enrollment and verification, backup codes, sessions, lockout, draft/publish/history/restore.
- api/content.mjs: read-only published text for visitors.
- lib/tamkeen-admin-core.mjs: authentication, crypto, server-only DB and cookie utilities.
- tamkeen-content.js: display plain-text overrides without changing original site components.
- tamkeen-admin-inline.js: owner-only in-page text editor.
- admin.html and tamkeen-admin-login.js: login and 2FA activation.
- db/tamkeen_admin_migration.sql: additive Neon migration.

## Required variables
- DATABASE_URL: preview Neon branch URL
- ADMIN_SECRET_KEY: 32+ bytes of cryptographically random material
- ADMIN_OWNER_EMAIL: exact owner account email
- ADMIN_BOOTSTRAP_TOKEN: user-selected long random one-time activation token

## Owner activation
1. In Vercel preview environment, configure ADMIN_BOOTSTRAP_TOKEN personally. Do not share it in chat or commit it to Git.
2. Open the preview URL's /admin.html, select first-time owner activation, provide owner email, new password (14+ chars), and bootstrap token.
3. Log in and enroll TOTP on a trusted authenticator app; save recovery codes offline.
4. Verify text editing, drafts, history, restore and server authorization checks.
5. Remove ADMIN_BOOTSTRAP_TOKEN after the account is created, redeploy, and only then plan production rollout.

## Limitations / further hardening before production
- Editor targets most text-only visible headings and descriptions, including dynamically generated service cards. DOM-derived IDs can shift if cards are reordered; use explicit stable service IDs in a follow-on migration.
- No media upload, service CRUD or order management yet; these are outside the text-editing core.
- Existing remote Neon media endpoints remain untouched.
- Strong production-grade e2e/security tests and a verified rollback procedure are required before merging.
- Runtime and domain access to protected preview deployments require authorized Vercel team permissions.
