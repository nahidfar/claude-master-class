# Claude Master Class - Student Starter

A self-contained Next.js starter. The public sample portfolio is already built.
Students personalize it from a redacted PDF, build authentication, then implement
**three private tools**. Every exercise includes boundaries, do's/don'ts, and
good/bad prompts.

**Before class:** follow the [student setup and readiness checklist](pre-class.md).
Copying the source is not enough: install Node.js (which includes npm), run `npm ci`,
pass `npm run preflight`, and have the sample portfolio running. Class starts with
attaching your redacted PDF in the approved assistant, not installing dependencies.

**Instructor:** use the [pre-work and release checklist](pre-work.md) to prepare
student access, PDF fallback, and the later model provider.

This is a private repository. Students must be granted access before they can clone
it, or receive an instructor-authorized starter ZIP. The starter is on `main`;
there is no completed-answer branch included.

## What Works on Day One

| Supplied | Students build during the class |
|----------|---------------------------------|
| Responsive sample portfolio, projects, skills, contact | Replace sample facts using their own documents |
| Login/logout UI and blocked dashboard shell | Server authentication and signed, expiring HTTP-only cookies |
| Three linked tool forms and guard call sites | Job Fit Analyzer and Cover Letter Generator |
| API shells, input validation, visible errors | Interview Prep / Study Plan implementation |
| Types, exercises, tests, and setup instructions | Model calls, output validation, and useful result rendering |

Authentication is intentionally removed. Auth POST/DELETE return **HTTP 501 Not
Implemented** for valid same-origin requests, private APIs return an authentication
501, and dashboard pages show a build notice without private children. Credentials
alone cannot unlock them. After students implement authentication, valid tool requests
reach each tool's own 501 until its exercise is complete. No provider account is
needed to run the sample public portfolio.

## 1. Clone and Run

Install **Node.js 22.18+** (use the instructor-approved LTS release), Git, and VS Code.
The normal Node.js installer includes npm; no separate npm install is needed.
React/Next.js/TypeScript are local project dependencies installed by `npm ci`.
After accepting your GitHub repository invitation:

```powershell
git clone --branch main https://github.com/nahidfar/claude-master-class.git
Set-Location .\claude-master-class
npm ci
if (-not (Test-Path .env.local)) {
  Copy-Item .env.example .env.local
}
npm run preflight
npm run dev
```

Open `http://localhost:3000` or the URL printed by Next.js. The sample portfolio
works immediately, including when login credentials have not yet been configured.
This repository is the standalone starter: run npm commands at its root, not inside
a nested course folder. ZIP users should extract it, open the folder containing
`package.json`, and begin at `npm ci`. Git credentials are entered through GitHub's
approved authentication flow, never embedded in the clone URL or pasted into chat.

## 2. Build Authentication for the Private Workspace

Complete [the authentication exercise](exercises/00-authentication.md) after public
personalization. The supplied login UI is not a working
identity system. Implement server configuration, session helpers, login/logout,
and verification at the existing dashboard/API guard call sites.

As part of that build, edit `.env.local` locally:

- `SITE_PASSWORD`: choose a unique password with at least 12 characters.
- `SESSION_SECRET`: generate a random value of at least 32 characters:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Do not share the generated value, show it on a projector, or paste it into prompts.
Restart the dev server after updating the environment. Once authentication is
implemented and verified, visit `/login`, sign in, and open the three exercise pages.

Required completed behavior: the dashboard is checked on the server; every private
POST route independently checks the session. Changing the session secret invalidates
existing sessions. Signed sessions last four hours.

This is a **single-owner teaching login**, not a production identity system.
Implement a ten-attempts-per-minute cap across the server process; this is not durable
or distributed rate limiting. Before public production use, add an
appropriate identity provider, managed rate limits, body-size enforcement at the
host, monitoring, and a production review. Never publish real student data merely
because a password form exists.

## 3. First Demo: Attach Your PDF and Personalize

1. Open Copilot or your instructor-approved AI workspace.
2. Attach your own **redacted resume PDF** and optional project document.
3. If PDF attachment/extraction is unavailable, paste redacted plain text.
4. Use [exercise 00](exercises/00-personalize.md).
5. Review changes to `data/profile.json` and the rendered homepage.

**The portfolio website does not upload or parse PDFs.** The approved assistant
reads the attachment; you approve the extracted facts. Never place the source PDF
in public assets. An optional [private-inputs folder](private-inputs/README.md)
ignores local source files; it is not encrypted storage.

## 4. Build the Three Private Parts

First complete and verify [authentication](exercises/00-authentication.md), then:

1. [Job Fit Analyzer](exercises/01-job-fit.md)
2. [Cover Letter Generator](exercises/02-cover-letter.md)
3. [Interview Prep / Study Plan](exercises/03-career-plan.md)

Use your instructor's chosen model provider. Only then install its SDK, add the
dependency to this app, and store its key/model setting in `.env.local`.
Copilot access does not provide model API credits.

Keep the public profile as the shared factual context. Keep the JD and output
in request/UI state, not in committed files or public profile data.

## Folder Map

```text
data/profile.json                  public profile and project facts
private-inputs/                    ignored local source documents
src/app/page.tsx                   working public portfolio
src/app/globals.css                responsive styles
src/app/login/                     login page
src/app/dashboard/                 protected dashboard + three tool pages
src/app/api/auth/route.ts          login/logout 501 exercise shell
src/app/api/fit-analyzer/route.ts   exercise 1 entry point
src/app/api/cover-letter/route.ts   exercise 2 entry point
src/app/api/career-plan/route.ts    exercise 3 entry point
src/components/ToolWorkbench.tsx   forms, loading/errors, initial JSON results
src/lib/tools.ts                   input validation and result contracts
src/lib/exercise-route.ts          authenticated 501 exercise response
src/lib/api.ts                     JSON parsing and API session guard
src/lib/auth.ts                    explicit unimplemented-auth errors; student replaces them
src/lib/private-page.tsx           shared guard called by layout AND each private page
src/lib/session.ts                 students create signed/expiring session helpers
exercises/                        prompts and measurable acceptance checks
tests/                            fail-closed starter and input/origin tests
```

## Checks

Before class, run `npm run preflight` for all checks in order. It builds before the
standalone type check to generate Next.js types in a fresh copy. Individual commands:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npm run test:http
```

**Before the auth build:** homepage works; same-origin auth requests and all private
APIs return explicit auth 501 errors, even with fake cookies or configured settings.
Dashboard routes show the implementation notice without tool content.

**After the auth build:** no session means JSON 401 on every tool API and a login
redirect on dashboard URLs. Missing/weak configuration means API 503 and no access.
With a valid session, invalid input returns 400; valid input returns each tool's
deliberate 501 until that exercise is implemented. Test cookie flags, expiry,
tampering, cross-origin requests, throttling, and logout. Replace starter-only auth
assertions with tests for the real implementation; retain input/origin coverage.
`test:http` starts/stops its own production server on a free local port and requires
a current build. Its starter assertions cover configured credentials, forged cookies,
direct private APIs, and absence of private children in HTML/RSC responses. Replace
these baseline expectations with real login/session HTTP checks during the auth build.

At both stages, check the homepage at 375px and 1440px. Passing starter checks is
not evidence that authentication or model features are complete.

## Publishing

**Full starter and completed private tools:** deploy to Vercel with Next.js,
root `.` for this standalone repository. Configure `SITE_PASSWORD`, `SESSION_SECRET`, and any
provider settings added in the exercises; redeploy after setting them.

**GitHub Pages:** static public portfolio only. Create a separate static version;
remove login, dashboard, all server APIs, and related links. Then configure static
export and the repository base path. Do not enable `output: "export"` on this
full-stack starter and expect its private tools to work.

Do not commit `.env.local`, raw documents, or private career outputs. A successfully
published shell does not mean the AI exercises are implemented.
