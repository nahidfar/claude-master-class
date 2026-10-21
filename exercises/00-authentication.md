# 00A - Build Authentication for the Private Workspace

## Why and Starting Boundary

The homepage is public. Every dashboard page and each of the three tool APIs is
private. Hiding navigation is not access control: a caller can request an API directly.

The starter supplies login/logout UI, JSON/origin checks, dashboard guard placement,
and API guard placement, **not working authentication**. Login/logout and private
APIs return explicit 501 errors; dashboard URLs show an implementation notice without
rendering children. Even configured credentials or a forged cookie cannot unlock it.
The model features remain separate 501 exercises after authentication is complete.

Build a single-owner classroom login, not registration, roles, password recovery,
multi-user storage, or a production identity system. Use a maintained identity
provider for broader production use; do not invent cryptography.

## Implementation Order (25-45 Minutes on the Workshop Clock)

1. Inspect `src/lib/auth.ts`, `src/lib/api.ts`, `src/lib/origin.ts`,
   `src/lib/private-page.tsx`, `src/app/api/auth/route.ts`, dashboard layout/pages, and both auth UI
   components. Trace a direct request to each private API before editing.
2. Implement `authConfiguration()` with server-only `SITE_PASSWORD` (12+ characters)
   and `SESSION_SECRET` (32+ random characters). Missing/weak configuration must
   throw a configuration error, yield API 503, and keep the dashboard blocked.
3. Create `src/lib/session.ts` using Node's standard crypto: timing-safe comparison
   of equal-length password digests, random nonces, HMAC-SHA256 signatures, and a
   four-hour expiry. Verify signature, format, expiry, and maximum lifetime.
   Reject missing, tampered, malformed, expired, and wrong-secret tokens.
4. Implement `isAuthenticated()` using the server cookie jar and configuration.
   Never infer access from the existence of a cookie or a client boolean.
5. Replace auth POST's 501 with password validation (400 for invalid shape, 401 for
   incorrect password), then issue the signed session cookie. Use `HttpOnly`,
   `SameSite=Strict`, `Secure` in production, `Path=/`, and a four-hour max age.
   Keep `readJson()` and origin/body checks. Add ten-attempts-per-minute process-local
   throttling (429 plus `Retry-After`), explicitly labeled classroom-only.
6. Replace auth DELETE's 501 with same-origin cookie expiry using the same cookie
   name/path/flags. Return success only when the server sends the clearing cookie.
7. Preserve the layout, every private page, and all API guard calls: no session redirects dashboard
   pages to `/login`; tool APIs return JSON 401 before parsing/generation.
   Remove the unimplemented-auth exception handling only after the real guards work.
   Layout-only protection is insufficient: Next.js may serialize child-page content
   even when a layout does not render its children. Guard each page before private
   reads or rendering, and inspect the HTML/RSC response as well as the visible UI.
8. Keep existing UI loading/errors. Replace the starter-only assertions in
   `tests/auth.test.ts` and `tests/starter-http.mjs` with real configuration/session
   and login/logout HTTP tests; add session-helper unit tests.
   Do not simply delete tests to get green output. Keep HTML/RSC non-disclosure
   checks for unauthenticated requests. Update the login explanation.

Configure `.env.local` locally and restart. Never paste actual values into prompts:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

## Boundaries, Do's and Don'ts

| Boundary | Do | Don't |
|----------|----|-------|
| Public vs. private | Keep `/` public; protect dashboard and all three APIs on the server | Hide links and call it protected |
| Credentials | Read server environment; use random local secrets | Use `NEXT_PUBLIC_`, hardcoded passwords, logs, or prompt secrets |
| Sessions | Verify signed, expiring HTTP-only cookies | Use localStorage, `isLoggedIn=true`, unsigned cookies, or custom crypto |
| Errors | Distinguish 400/401/403/429/503 and show useful UI errors | Return success, grant access, or bypass a guard on failure |
| Scope | Build one-owner teaching auth and label its limits | Claim production readiness or add accounts/roles during this block |

## Bad Prompt

```text
Make the dashboard private. Hide the link and save isLoggedIn=true in localStorage.
If login fails, skip it so we can finish the AI tools.
```

This trusts browser state, leaves direct APIs exposed, and hides failure.

## Good Prompt

```text
Implement exercises/00-authentication.md in this existing Next.js app.
Inspect auth.ts, api.ts, origin.ts, private-page.tsx, the auth route, dashboard
layout/pages, and auth UI.
Keep the homepage public. Implement single-owner server authentication using
server-only environment settings and Node crypto for signed four-hour sessions.
Use secure cookie flags, same-origin mutation checks, explicit configuration
errors, and a classroom-only ten-attempts-per-minute login limit.
Reject invalid/tampered/expired sessions and incorrect passwords.
Protect every dashboard page and all three tool APIs independently.
No localStorage auth, public secrets, bypasses, new identity platform, or AI calls.
Replace starter-only tests with real session/configuration tests; add HTTP checks
for direct API denial, login/logout, origin rejection, and missing configuration.
Keep the three AI routes at 501 for authenticated valid requests.
Run tests, lint, typecheck, build; report actual outcomes and production limitations.
```

## Acceptance Checks: Test Direct URLs, Not Just Buttons

| Case after implementation | Expected |
|---------------------------|----------|
| Homepage with no credentials/session | Public portfolio still works |
| Missing/weak configuration | API 503; dashboard setup notice; no access |
| Logged-out dashboard and nested tool URL | Redirect to `/login`; no private children |
| Each tool API without session | JSON 401, no model call |
| Incorrect password / non-string password | 401 / 400; no session issued |
| Cross-origin login/logout | 403; no session mutation |
| Excess login attempts | 429 with `Retry-After` |
| Correct login | Signed four-hour cookie; correct flags; dashboard accessible |
| Fake, tampered, expired, wrong-secret cookie | Denied on pages and every API |
| Authenticated valid tool request | Tool-specific 501 until that tool is built |
| Logout followed by private request | Browser cookie cleared; subsequent request denied |

Clearing a cookie does not revoke a copied signed token. Document that limitation;
rotating the secret invalidates all sessions. Do not claim per-session revocation.
Process-local throttling resets on restart and is not distributed. Before public
use, add managed identity/abuse controls, HTTPS, host body limits, and review.
