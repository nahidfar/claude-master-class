# Student Portfolio Starter

**Start with the [numbered setup instructions](pre-class.md).**
They cover installing VS Code, GitHub sign-in, a coding assistant, an AI key, Node.js/npm, cloning, testing,
and bringing your resume PDF to class.

Already completed setup? Open this folder in VS Code and run:

```text
npm run dev
```

Open the local URL printed in the terminal. Stop your server with Ctrl+C.

During class, start with [your profile data](data/profile.json).
The sample homepage works without API keys. Login and private AI tools are
intentionally unfinished; you do not need to complete exercises before class.

## What Belongs in This Repository

Keep `src/`, `data/`, package files, project configuration, `.gitignore`,
`.env.example`, and these two short guides.

`npm ci` creates `node_modules/`; Next.js creates build/type files.
Do not commit or distribute those generated files, secrets, or raw resumes.
The class exercises are in `exercises/`, the checks in `tests/`, and the class slides in `slides/`.
