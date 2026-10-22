# Before Class: Student Setup

**Goal:** arrive with the sample website running and your redacted resume PDF ready.
These commands are for **Windows PowerShell** in VS Code.

This is the standalone student repository. If it is private, accept the instructor's
GitHub invitation before cloning it.

## 1. Install VS Code

Download and install [VS Code](https://code.visualstudio.com/), then open it.

## 2. Create GitHub Account and Sign In

1. Create a free account at [github.com/signup](https://github.com/signup) and verify your email.
2. In VS Code, open **Accounts -> Sign in with GitHub** (or **Sign in to use Copilot**).
3. Complete the browser sign-in and return to VS Code.
4. Open Copilot Chat and send `Hello` to check it responds. Install official
   GitHub Copilot support if prompted. Copilot Free has usage limits.
5. If the course repository is private, accept the instructor's invitation.

If you use your own model instead, follow the instructor's provider instructions:
**Chat model picker -> Manage Language Models -> Add Models**. Do not buy API
credits just for setup.

## 3. Install Node.js (Includes npm) and Git

1. Install the instructor-approved [Node.js LTS](https://nodejs.org/en/download)
   release, **22.18 or newer**, with npm included.
2. Install [Git](https://git-scm.com/downloads).
3. Close and reopen VS Code. Select **Terminal -> New Terminal**.
4. Run these checks:

```powershell
node --version
npm --version
git --version
```

**Pass:** all three print version numbers; Node is 22.18+.
**There is no separate command to install npm.** If a command is not recognized,
finish the installation and reopen VS Code.
If PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm` below.

## 4. Clone the Student Repository and Open It

Run each command separately. Stop if one fails.
```powershell
git clone --branch main https://github.com/nahidfar/claude-master-class.git my-portfolio
Set-Location .\my-portfolio
code .
```

If `code .` is not recognized, use **File -> Open Folder** and select that
cloned `my-portfolio` folder manually.
In the opened window, select **Terminal -> New Terminal**.
You should see `package.json` and `package-lock.json` in the VS Code Explorer.

**Clone once. Do not clone individual folders or copy `node_modules`.**

## 5. Install the App's Dependencies and Test

In the cloned app's terminal, run:

```powershell
npm ci
```

Wait for it to finish successfully. This installs the app's libraries, **not npm itself**.
Then run:

```powershell
npm run build
```

**Pass:** the build finishes without errors. Then start the website:

```powershell
npm run dev
```

Open the local URL printed in the terminal, usually **http://localhost:3000**.
**Pass:** the sample portfolio homepage loads. Leave the terminal running.
Login/private tools are unfinished; blocked screens or 501 messages there are expected.

If installation or build fails, send the instructor the error with secrets removed.
Do not delete the lockfile or run force-fix commands.

## 6. Bring This to Class

- [ ] Sample homepage working.
- [ ] VS Code open with the student app and Copilot/approved assistant ready.
- [ ] Your **redacted resume PDF**, plus plain text as a fallback.
- [ ] One target job description, at most 5,000 characters.

**At the start of class:** attach the PDF in the approved AI assistant's chat,
not on the website. If PDF attachments are unsupported, paste the redacted text.
The website has no PDF upload feature. Do not put raw resumes in public folders or Git.

Next time you open the app, open the same cloned folder and run
`npm run dev`. No need to clone or install again unless dependencies change.

## Later: LLM API Access

No model API key or payment is needed for the steps above. The instructor will
guide API access during the AI-tool build. Copilot access does not pay for the
website's API calls. Store app keys only in `.env.local`, never chat or Git.

The starter has **no LLM call yet**. Later, the server routes for
[Job Fit](src/app/api/fit-analyzer/route.ts),
[Cover Letter](src/app/api/cover-letter/route.ts), and
[Interview/Study Plan](src/app/api/career-plan/route.ts) will call the chosen
provider after authentication and input checks.
