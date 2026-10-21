# Before Class: Arrive Ready to Attach Your PDF

Complete this on the laptop and network you will use in class. Start class with
the sample portfolio running, the starter open in VS Code, and your redacted PDF
ready to attach in the approved AI assistant. Do not start by installing software.

## Is Copying the Repository Enough?

**No.** The repository supplies source code and a dependency lockfile, not an
installed development environment.

| Item | What students need to do |
|------|--------------------------|
| Node.js and npm | Install the instructor-approved Node.js LTS release, **22.18+**. The normal Node.js installer includes npm; no separate npm installation is needed. |
| VS Code and coding assistant | Install VS Code and the instructor-approved coding assistant, sign in, and confirm chat/edit access. |
| Git | Install if cloning, committing, or pushing. A ZIP download can get you started without Git, but does not provide version history. |
| Starter source | Clone the exact instructor branch or extract the complete ZIP, including dotfiles. Use the student template, not the older reference app. |
| Project dependencies | Run `npm ci` in the folder containing this starter's `package.json` and `package-lock.json`. |
| Model API access | Not needed for the public portfolio or first PDF step. Required later for the three AI tools; arrange provider/model access before class. |

You do **not** need Python, Docker, a database, a global Next.js installation,
hosting, a domain, or a model API key to open the starter. React, Next.js,
TypeScript, and the test/lint tools are declared in the project and installed by
`npm ci`. Do not install each one globally.

## 1. Install and Verify Tools

Install Node.js using the [official download](https://nodejs.org/en/download) and
VS Code from its [official site](https://code.visualstudio.com/).
Use the same Node version as the instructor's tested environment when specified.
Close and reopen VS Code/its terminal after installing Node.

In a VS Code PowerShell terminal:

```powershell
node --version
npm --version
git --version
```

Node must be 22.18 or newer and npm must print a version. Git is needed for the
clone/push path; ZIP-only users can skip that check initially.

In the approved coding assistant, sign in and send a harmless test message.
Confirm your account/organization allows the workspace and intended assistant.
Do not assume installing an extension also grants a subscription or API credits.

## 2. Get the Correct Starter and Open It

This private repository's starter branch is `main`. Accept your instructor's
GitHub invitation before cloning. If your account cannot access it, request access
or an instructor-authorized ZIP before class; knowing the URL alone is not enough.

**Clone the standalone starter:**

```powershell
git clone --branch main https://github.com/nahidf_microsoft/claude-master-class.git
Set-Location .\claude-master-class
```

**ZIP download:** extract first, then open the extracted repository folder directly.
It must contain `package.json`, `package-lock.json`,
`.env.example`, `src`, `data`, `exercises`, and `tests`. ZIP extraction may add an
extra parent folder; do not run npm from the wrong level.

Open **this starter folder** in VS Code using File -> Open Folder. Its Explorer
should show `data/profile.json` and `exercises/00-personalize.md`. Open a new terminal
there. A new VS Code window may not inherit the folder of your previous terminal.

Do not copy an instructor's `node_modules`, `.next`, `.env.local`, credentials, or
private documents. Install dependencies on your own machine from the lockfile.

## 3. Install Dependencies and Prepare Local Settings

From the starter folder:

```powershell
npm ci
if (-not (Test-Path .env.local)) {
  Copy-Item .env.example .env.local
}
npm run preflight
```

Run these sequentially and stop if any command fails. `npm ci` needs internet or a
usable local package cache. It installs the locked project dependencies; it does
not install Node itself. Keep `package-lock.json`; do not run `npm update` or
`npm audit fix --force` to prepare for class.

`preflight` runs unit tests, lint, a production build, type checking, and HTTP/RSC
boundary tests. Its test server uses an available local port and stops afterward.
The first build prepares generated Next.js types before the standalone type check.
All stages must finish successfully. No credentials or model calls are required.

You can leave `SITE_PASSWORD` and `SESSION_SECRET` blank for the first PDF exercise.
Prepare a unique password and generate a random session secret locally when you
reach [the authentication exercise](exercises/00-authentication.md). Merely filling
these values does not implement authentication.

## 4. Start the Portfolio

After preflight finishes:

```powershell
npm run dev
```

Leave this terminal running. Open the **local URL printed by Next.js** in your
browser, usually `http://localhost:3000`. If that port is occupied, use the alternative
URL printed by the server. Stop only this server with Ctrl+C when finished; restart
it with the same command when class begins.

Expected starting state:

- The homepage shows the fictional sample portfolio, projects, skills, and contact.
- `/login` shows a supplied form, but successful sign-in is not implemented.
- `/dashboard` and nested tool pages show **Build authentication first**, not tools.
- Valid same-origin auth/private API requests return an explicit **501** message.
- No model key is requested and no paid model call runs.

The blocked dashboard is intentional. Do not "fix" it, bypass guards, or build the
authentication/tool exercises before class unless instructed.

## 5. Prepare the PDF Handoff

Bring:

- Your own **redacted resume PDF**, plus a plain-text version as a fallback.
- Optional project notes with real evidence missing from the resume.
- One target job description, at most 5,000 characters, including company and role.
- A realistic weekly learning budget for the later study-plan mode.

Remove private identifiers, confidential employer information, and third-party
personal data. Do not put raw PDFs in public assets or Git. The optional local
`private-inputs` folder is ignored by Git, not encrypted storage.

Check whether your approved assistant/account supports attaching and reading PDFs.
If allowed, test with a small non-sensitive document and confirm it can read the
text; scanned/image-only PDFs may need your own reviewed text transcription.
If attachments are unsupported, prepare redacted text to paste instead. This
workshop does **not** require installing a PDF parser.

**At the start of class:**

1. Open the starter folder in VS Code and run `npm run dev`.
2. Keep the working public homepage visible.
3. Open [exercise 00](exercises/00-personalize.md) and the approved assistant chat.
4. Attach the redacted PDF **in the assistant**, not on the portfolio website.
5. Ask for extracted facts and unknowns first; review them before changing the
   public profile. Then use the exercise's personalization prompt.

**There is no PDF upload button on the website.** The AI assistant reads the
document; the website displays the facts you approve.

## 6. Arrange Later AI Access Before Class

The instructor must announce the chosen model provider, model name, authentication
method, endpoint/region if applicable, and access/cost limits. Confirm your account
can use it before class. VS Code/Copilot access and a model API billing account
are separate things.

Do not guess environment-variable names, install an arbitrary provider SDK, or paste
API keys into chat. Follow the instructor's provider guidance; keep any required
credentials only in local server environment settings, never `NEXT_PUBLIC_` variables.
No provider integration is supplied in this starter: students build it later.

## Troubleshooting Before Class

| Symptom | Action |
|---------|--------|
| `node` or `npm` not recognized | Finish installing Node.js, reopen VS Code/terminal, and rerun version checks. |
| PowerShell says `npm.ps1` cannot run | Use `npm.cmd` instead of `npm` for these commands. Do not disable machine-wide execution policy. |
| npm cannot find `package.json` | Open the actual starter folder, not the course root or ZIP's wrapper folder. |
| Clone returns "Repository not found" | This repo is private. Accept the invitation and authenticate the authorized GitHub account, or ask for an authorized ZIP. Never put a token in the URL. |
| `npm ci` fails | Check Node version, network/proxy, and the full error. Send the instructor the error with secrets removed; do not delete the lockfile or bypass TLS checks. |
| An old copied folder behaves strangely | Use a fresh starter copy without copied `node_modules` or `.next`, then run `npm ci`. |
| Port 3000 is busy | Use the available URL printed by Next.js; do not stop unrelated processes. |
| Dashboard says authentication is unimplemented | Expected baseline; begin on the public homepage. |
| PDF cannot be read | Use the reviewed redacted plain-text fallback in the approved assistant. |
| Assistant/provider access is blocked | Resolve account/organization approval before class; contact the instructor for pairing/demo arrangements. |

## Ready-to-Start Checklist

- [ ] Node/npm versions verified; VS Code and approved assistant work.
- [ ] Correct starter folder open; `npm ci` and `npm run preflight` passed.
- [ ] `npm run dev` serves the sample public portfolio on the printed URL.
- [ ] Expected blocked private state understood; no bypass or prebuilt auth added.
- [ ] Redacted PDF and plain-text fallback ready; attachment support checked.
- [ ] Target JD/project notes ready; later model access confirmed with the instructor.
- [ ] Ready to begin at **attach PDF -> review facts -> personalize portfolio**.
