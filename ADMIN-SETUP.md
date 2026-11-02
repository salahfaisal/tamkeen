# Tamkeen Universal Admin — production rollout notes

## Stable entry point
The owner signs in at `https://tamkeen-mauve.vercel.app/admin` on any modern browser (Android, iOS, desktop). After username/password and TOTP, a host-only Secure HttpOnly Strict cookie authenticates that **browser only**. Each browser gets an independently revocable session; shared passwords must never be placed in front-end source.

## Database
A dedicated Neon branch `tamkeen-admin-primary` contains the already enrolled owner and content/audit history. Production `DATABASE_URL` must target this branch; keep media endpoints pointing at the separate original production Neon services. A separate child branch `tamkeen-admin-staging` is for preview; never share content writes from preview into production. The Neon plan does not currently permit protecting the additional admin branch; consider upgrading plan or scheduled encrypted backup.

## Configuration
Production: `DATABASE_URL`, `ADMIN_SECRET_KEY`, `ADMIN_OWNER_EMAIL` as encrypted Vercel variables. `ADMIN_SECRET_KEY` **must match the key originally used when encrypting existing TOTP seeds**. Do not create or expose `ADMIN_BOOTSTRAP_TOKEN`; registration is deliberately removed. Preview: database points to staging child branch with separate preview env scope; use same admin encryption key for cloned TOTP data.

## Security
- The backend accepts only the configured owner email when validating sessions.
- scrypt password hashing, 6-digit TOTP (plus single-use recovery codes), same-origin POST verification.
- Full-auth per-browser 6-hour sessions, secure host-only HttpOnly SameSite Strict cookies, independently revocable from /admin.
- Draft/publish and audit history write through server APIs; users never receive database credentials.
- This is a lightweight text editing system, not an image/video upload manager.
- Login is **not** through Vercel dashboard or GitHub; those services are reserved for developers.

## Safe rollout
1. Verify tests, preview deployment and configuration; ensure production has its own DB URL and matching encryption secret.
2. Verify `/admin` rewrite and unauthenticated `GET /api/admin?action=session` without an owner session (should show `authenticated:false`).
3. Deploy to production via reviewed PR or staged production release; verify content sections and legacy media proxies continue functioning.
4. Test owner login from two different browsers, 2FA, independent sessions, session revocation, text draft/publish/restore and mobile view.
5. On errors, roll back production deployment; keep a backup of the admin DB branch.
