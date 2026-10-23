# Before Class: Student Setup

**Goal:** arrive with the sample website running, an AI key ready, and your redacted resume PDF.
It works on **Mac and Windows**. Where a command differs, both are shown.

## 1. Install VS Code

Download and install [VS Code](https://code.visualstudio.com/), then open it.

We use VS Code in class. Already use another editor with a coding assistant built in,
such as Cursor or Windsurf? That works too. The steps are the same; open the folder there instead.

## 2. Create a GitHub Account

1. Create a free account at [github.com/signup](https://github.com/signup) and verify your email.
2. In VS Code, open **Accounts -> Sign in with GitHub** and complete the browser sign-in.

## 3. Set Up One Coding Assistant

Pick one and sign in:

- **Claude Code**
- **GitHub Copilot** (Copilot Free has usage limits)
- **Cowork**

Send it `Hello` to check it responds. In class, it writes the code; you prompt, check and decide.

## 4. Get an AI API Key

The website's three AI tools need their own key. Your coding assistant's plan does not pay for these calls.

1. Create a key with **one** of: [OpenAI](https://platform.openai.com/api-keys),
   [Anthropic](https://console.anthropic.com/settings/keys) or [Google Gemini](https://aistudio.google.com/apikey).
2. Add a little credit. **$5 to $10 is plenty** for class.
3. Keep the key private. Do not paste it into chat, email or Git. We add it to `.env.local` together in class.

## 5. Install Node.js (Includes npm) and Git

1. Install [Node.js LTS](https://nodejs.org/en/download), **22.18 or newer**. npm comes with it.
2. Install [Git](https://git-scm.com/downloads). On a Mac, it may already be installed.
3. Close and reopen VS Code. Select **Terminal -> New Terminal**.
4. Run these checks:

```
node --version
npm --version
git --version
```

**Pass:** all three print version numbers; Node is 22.18+.
There is no separate command to install npm. If a command is not recognized,
finish the installation and reopen VS Code.
**Windows only:** if PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm` below.

## 6. Clone the Student Repository and Open It

Run each command separately. Stop if one fails.

```
git clone --branch main https://github.com/nahidfar/claude-master-class.git my-portfolio
cd my-portfolio
code .
```

If `code .` is not recognized, use **File -> Open Folder** and select the
cloned `my-portfolio` folder.
In the opened window, select **Terminal -> New Terminal**.
You should see `package.json` and `package-lock.json` in the VS Code Explorer.

**Already cloned it before?** Open the folder and run `git pull` to get the latest version.
**Clone once. Do not clone individual folders or copy `node_modules`.**

## 7. Install and Check the App

In the cloned app's terminal, run:

```
npm ci
```

Wait for it to finish. This installs the app's libraries, **not npm itself**. Then run:

```
npm run preflight
```

**Pass:** the tests, lint, build and type checks finish without errors. Then start the website:

```
npm run dev
```

Open the local URL printed in the terminal, usually **http://localhost:3000**.
**Pass:** the sample portfolio homepage loads. Stop the server with Ctrl+C.
Login and the private tools are unfinished; blocked screens or 501 messages there are expected.

**If a step fails:** copy the whole error, paste it into your coding assistant and ask it to fix it.
That's also how we work in class. Do not delete the lockfile or run force-fix commands.

## 8. Bring This to Class

- [ ] Sample homepage working.
- [ ] VS Code open with the student app and your coding assistant signed in.
- [ ] Your AI API key with credit, kept private.
- [ ] Your **redacted resume PDF** (no phone number or home address), plus plain text as a fallback.
- [ ] One target job description, at most 5,000 characters.
- [ ] Optional: a square photo of yourself for your portfolio.

**At the start of class:** attach the PDF in your coding assistant's chat,
not on the website. If PDF attachments are unsupported, paste the redacted text.
The website has no PDF upload feature. Do not put raw resumes in public folders or Git.

Next time you open the app, open the same cloned folder and run
`npm run dev`. No need to clone or install again unless dependencies change.
