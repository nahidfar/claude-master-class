# Before the Masterclass

Allow 45-60 minutes outside the live session; installations/account approval can take longer.

## Student Setup: Complete Before Arriving

Send students the standalone [pre-class checklist](pre-class.md).
It travels with the starter even if the course repository is not distributed.

**Copying the repository is not enough.** Install Node.js **22.18+** using the
instructor-approved LTS version; its normal installer includes **npm**. There is no
separate npm installation. Students must also install/sign in to VS Code and the
approved coding assistant, get the correct starter branch/ZIP, and run `npm ci`
from the starter folder to install its locked project dependencies.

Students should pass `npm run preflight`, then run `npm run dev` and open the printed
local URL **before class**. Preflight includes tests, lint, build, types, and direct
HTTP/RSC boundary checks; it requires no model credentials.

Class begins with the starter already running and the redacted PDF ready to attach
in the approved assistant. There is no PDF upload feature on the website. Prepare
redacted plain text if the assistant cannot read PDF attachments. Do not make
authentication or provider setup a prerequisite for the first personalization step.

No model key is needed for these initial checks. For live AI implementation, the
instructor must specify a provider/model and account access before class. Store
provider credentials only in `.env.local`; do not use public client variables.
Copilot subscription access is separate from model API usage/credits.

## Bring

- Your own redacted resume PDF or plain text.
- Optional project document with evidence the resume omits.
- One target JD, at most 5,000 characters, including company/role.
- A realistic weekly learning budget for study mode.

Attach the PDF to an approved assistant; never put it in the website's public files.
Use the optional ignored [private-inputs folder](private-inputs/README.md)
only for local source documents. Do not use confidential employer/third-party records.

## Instructor Readiness

- Distribute `https://github.com/nahidf_microsoft/claude-master-class` and starter
  branch `main`. This repository is private: invite students and confirm acceptance
  before class, or provide an authorized starter ZIP. Do not assume URL access.
- This repository already has the standalone starter at its root. Include the
  [pre-class checklist](pre-class.md) when distributing a ZIP. State the exact tested
  Node version and OS instructions.
- Include source, sample data, styles, exercises, tests, manifests/lockfile, config,
  `.env.example`, and `.gitignore`. Exclude `node_modules`, `.next`, actual `.env`
  files, raw PDFs, and private notes. Do not distribute a copy of the current working
  folder wholesale: local generated/dependency files may be present.
- Test the released package from a clean folder with no sibling course apps,
  no copied dependencies, no secrets, and no model key: install, preflight, start,
  and inspect the public page. Do not rely on an instructor's populated environment.
- Preflight a completed reference implementation of authentication and all three tools.
- Choose the provider/model, credential/endpoint variable names, account approvals,
  and usage limits before class. Publish reusable server integration guidance and
  verify real access in the reference app; never distribute actual keys.
- Confirm the approved assistant's PDF support and provide the plain-text fallback.
- Collect readiness confirmations before class; resolve install/network/account
  issues in advance. Prepare a pairing/demo option for remaining blocked students.
- Verify template auth 501s and blocked dashboard, then completed-reference
  login/logout, direct API denial, cookie expiry/tampering, outputs, and failure cases.
- Prepare a reviewed demo PDF and target JD, plus a clearly unrelated weak-fit JD.
- Prepare the publishing walkthrough; full app requires Vercel/server hosting,
  while Pages requires a separate static-only version.

The template is ready to implement features, not a claim those features or a final
reference branch are already completed. If setup/provider access is blocked, pair
or follow the demo and mark personal checks unfinished.
