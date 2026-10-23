# Before Class: Student Setup

**Goal:** arrive with the sample website running, an AI key ready, and your redacted resume PDF.
It works on **Mac and Windows**. Where a step differs, both are shown.

| Step | What you set up | Why |
|---|---|---|
| 1 | VS Code | Where you build |
| 2 | GitHub account | Where your code lives |
| 3 | One coding assistant | Writes the code with you |
| 4 | Git + the masterclass code | Your copy of the project |
| 5 | Node.js + a check run | Runs the sample website on your laptop |
| 6 | AI API key with $10 credit | Powers your website's three AI tools in class |
| 7 | Your resume and a job description | What you build from in class |

Steps 1 to 3 get your editor ready. From step 4, your coding assistant can do most of the work:
each step has a prompt to paste, with the by-hand commands as a fallback.

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

## 4. Get the Masterclass Code

**The fast way.** Open VS Code with any folder you keep projects in (**File -> Open Folder**,
for example `Documents`). Paste this into your coding assistant's chat:

```text
I'm setting up my laptop for a class. Please do this step by step:
1. Check whether Git is installed. If it isn't, install it for me
   if you can; otherwise tell me exactly how, and wait until I confirm.
2. Clone https://github.com/nahidfar/claude-master-class.git
   into a new folder called my-portfolio here.
Stop when the clone is done and tell me the full path of my-portfolio.
```

Then open the new folder: **File -> Open Folder -> my-portfolio**.
You should see `package.json` and `package-lock.json` in the VS Code Explorer.

**By hand.** Install [Git](https://git-scm.com/downloads) (on a Mac it may already be installed),
reopen VS Code, select **Terminal -> New Terminal**, and run each command separately:

```
git --version
git clone --branch main https://github.com/nahidfar/claude-master-class.git my-portfolio
cd my-portfolio
code .
```

If `code .` is not recognized, use **File -> Open Folder** and select the cloned `my-portfolio` folder.

**Already cloned it before?** Open the folder and run `git pull` to get the latest version.
**Clone once. Do not clone individual folders or copy `node_modules`.**

## 5. Install Node.js and Check the Sample Website

**The fast way.** In the `my-portfolio` window, paste this into your coding assistant's chat:

```text
This is my class project. Please get it running:
1. Check that Node.js 22.18 or newer and npm are installed. If not,
   install Node.js LTS for me if you can; otherwise tell me exactly
   how, and wait until I confirm.
2. Run npm ci, then npm run preflight.
3. Start npm run dev and give me the local URL.
If a step fails, show me the error, explain it in one line,
fix it, and run the step again. Don't delete package-lock.json
or run npm audit fix --force. Finish with a short summary of
what passed and anything I still need to do.
```

**By hand.**
1. Install [Node.js LTS](https://nodejs.org/en/download), **22.18 or newer**. npm comes with it.
2. Close and reopen VS Code, open **Terminal -> New Terminal** in `my-portfolio`, and run:

```
npm config get registry
node --version
npm --version
npm ci
npm run preflight
npm run dev
```

`npm ci` installs the app's libraries, **not npm itself**. There is no separate command to install npm.
**Windows only:** if PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm`.

The first command shows where npm downloads packages. The repository lockfile uses the standard
public npm registry and also works with compatible company or school mirrors. If `npm ci` reports
`404 Not Found` from a custom package feed, do not delete the lockfile. If your network permits
public npm access, retry just that installation with:

```
npm ci --registry=https://registry.npmjs.org/
```

On a managed network that blocks public npm, share the complete error with your instructor or
support contact so the mirror can be checked.

**Pass:** Node is 22.18+, the checks in `npm run preflight` finish without errors, and the sample
portfolio opens at the local URL, usually **http://localhost:3000**. Stop the server with Ctrl+C.
Login and the private tools are unfinished; blocked screens or 501 messages there are expected.

**If a step fails:** copy the whole error, paste it into your coding assistant and ask it to fix it.
That's also how we work in class. Do not delete the lockfile or run force-fix commands.

## 6. Get an AI API Key with $10 of Credit

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

You don't need the key to finish steps 1 to 5; it's only used once the AI tools are built in class.

## 7. Bring This to Class

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
