# Before Class: Student Setup

**Goal:** arrive with the sample website running, an AI key ready, and your redacted resume PDF.
It works on **Mac and Windows**. Where a step differs, both are shown.

| Step | What you set up | Why |
|---|---|---|
| 1 | VS Code | Where you build |
| 2 | GitHub account | Where your code lives |
| 3 | One coding assistant | Writes the code with you |
| 4 | AI API key with $10 credit | Powers your website's three AI tools |
| 5-7 | Node.js, Git, the course code | Runs the website on your laptop |
| 8 | Your resume and a job description | What you build from in class |

Steps 1 to 4 are sign-ups you do yourself. For steps 5 to 7, your coding assistant can do most of the work.

## 1. Install VS Code

Download and install [VS Code](https://code.visualstudio.com/), then open it.

We use VS Code in class. Already use another editor with a coding assistant built in,
such as Cursor or Windsurf? That works too. The steps are the same; open the folder there instead.

## 2. Create a GitHub Account

1. Create a free account at [github.com/signup](https://github.com/signup) and verify your email.
2. In VS Code, click the **Accounts** icon (bottom left) -> **Sign in with GitHub** and complete the browser sign-in.

## 3. Set Up One Coding Assistant

The assistant reads your project, edits files and runs terminal commands for you. Pick **one**.
The entry-level plan is enough for class.

| Assistant | Plan you need | Setup guide |
|---|---|---|
| **GitHub Copilot** | Copilot Free works to start (monthly limits); Copilot Pro if you run out | [Set up Copilot in VS Code](https://code.visualstudio.com/docs/copilot/setup) |
| **Claude Code** | A paid Claude plan (Pro or higher) or a Claude Console account; the free Claude plan doesn't include it | [Claude Code for VS Code](https://code.claude.com/docs/en/vs-code) |
| **OpenAI Codex** | ChatGPT Plus or higher (Free and Go don't include the VS Code extension) | [Codex IDE extension](https://developers.openai.com/codex/ide) |

**GitHub Copilot**
1. Copilot is built into VS Code. Hover over the **Copilot icon** in the Status Bar (bottom of the window) -> **Use AI Features**.
2. Sign in with your GitHub account. Without a paid plan you are put on Copilot Free.
3. Open the chat: **Ctrl+Alt+I** (Windows) or **Ctrl+Cmd+I** (Mac).
4. In the chat, set the mode to **Agent**, so it can edit files and run commands.

**Claude Code**
1. In VS Code, open **Extensions** (**Ctrl+Shift+X** / **Cmd+Shift+X**), search **Claude Code**, and install the one published by **Anthropic**.
2. Click the **Spark icon** in the left sidebar (or at the top right of an open file) to open it.
3. Sign in with your Claude account and approve in the browser.

**OpenAI Codex**
1. In VS Code, open **Extensions**, search **Codex**, and install the one published by **OpenAI**.
2. Click the **Codex icon** in the sidebar. Not there? Open the Command Palette (**Ctrl+Shift+P** / **Cmd+Shift+P**) and run **Codex: Open Codex Sidebar**.
3. Choose **Sign in with ChatGPT** and approve in the browser.

**Check it works:** send `Hello, can you see my files?` in the assistant's chat. It should reply.
When it asks for permission to edit a file or run a command, read what it wants to do, then allow it.

## 4. Get an AI API Key with $10 of Credit

Your website's three AI tools (Job Fit, Cover Letter, Interview Prep) call an AI model with your own key.
This is separate from your coding assistant's plan. The key and credit are yours: only the tools you run use it.

Pick **one** provider:

| Provider | Create a key | Add credit |
|---|---|---|
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | [Billing](https://platform.openai.com/settings/organization/billing) -> add $10 |
| **Anthropic** | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) | [Billing](https://console.anthropic.com/settings/billing) -> buy $10 of credits |
| **Google Gemini** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Starts on a free tier; turn on billing in AI Studio if you hit limits |

1. Sign up, add **$10** of credit. That is plenty to start.
2. Create a key and copy it into a private note. Most sites show it only once.
3. **Keep it private.** Do not paste it into chat, email, your coding assistant or Git.
   We put it in a private `.env.local` file together in class.

## 5-7. The Fast Way: Let Your Coding Assistant Set Up the Rest

Open VS Code with any folder you keep projects in (**File -> Open Folder**, for example `Documents`).
Paste this into your coding assistant's chat:

```text
I'm setting up my laptop for a class. Please do this step by step:
1. Check whether Node.js 22.18 or newer, npm and Git are installed.
   If one is missing or too old, install it for me if you can;
   otherwise tell me exactly how, and wait until I confirm.
2. Clone https://github.com/nahidfar/claude-master-class.git
   into a new folder called my-portfolio here.
Stop when the clone is done and tell me the full path of my-portfolio.
```

Then open the new folder: **File -> Open Folder -> my-portfolio**. In that window, paste this:

```text
This is my class project. Please check it is ready:
1. Run npm ci, then npm run preflight.
2. Start npm run dev and give me the local URL.
If a step fails, show me the error, explain it in one line,
fix it, and run the step again. Don't delete package-lock.json
or run npm audit fix --force. Finish with a short summary of
what passed and anything I still need to do.
```

**Pass:** the summary says the checks passed, and the sample portfolio opens at the URL it gives
you, usually **http://localhost:3000**. Login and the private tools are unfinished; blocked
screens or 501 messages there are expected.

If you did this, skip to **step 8**. Prefer to do it by hand? Follow steps 5 to 7 below.

## 5. By Hand: Install Node.js (Includes npm) and Git

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

## 6. By Hand: Clone the Student Repository and Open It

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

## 7. By Hand: Install and Check the App

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
