# 00 - PDF to Your Portfolio

## Why

Learn to turn unstructured source material into reviewed structured data without
asking AI to invent a professional identity. One verified profile then grounds
the public portfolio and all three private tools.

## Work

Attach your redacted resume PDF and project notes to an approved assistant.
Do not upload them to the portfolio or commit them. Inspect `data/profile.json`,
`src/app/page.tsx`, and `src/app/layout.tsx` before edits.

## Good Prompt

```text
Use my attached resume PDF and project notes as evidence.
Inspect data/profile.json and its consumers before editing.
Extract my identity, experience, skills, projects, education, and approved contact.
Preserve the existing schema. Ask about missing required facts or conflicts.
Do not invent dates, employers, metrics, credentials, or project results.
Replace fictional Alex Morgan content with facts I approve.
Keep source PDFs and private notes out of public assets and Git.
Update the public portfolio and metadata; preserve login and exercise shells.
Check 375px and 1440px layouts. Explain the edits and remaining unknowns.
```

## Done When

- No fictional/sample identity, project claims, or placeholder contact links remain.
- You can explain the evidence behind every public claim.
- Education and career history are truthful; academic/personal work is labeled.
- Homepage, navigation, and metadata show the new identity.
- Lint, type check, and build pass; no horizontal overflow at either viewport.

The avatar uses initials, so there is no missing-photo dependency. Add a photo only
if desired, authorized, and tested. Do not add a PDF parser or new app scaffold.

## Boundaries, Do's and Don'ts

| Section | Do | Don't |
|---------|----|-------|
| PDF -> reviewed facts | Use redacted sources; ask about gaps and conflicts | Invent credentials or publish source PDFs |
| Public portfolio | Change approved profile data and metadata; preserve schema | Rewrite the app, change auth, or expose private job-search data |
| Verification | Check every claim and both viewport sizes | Treat attractive output as evidence of truth |

## Bad Prompts

**Extraction:** "Make my resume impressive; fill in missing achievements and metrics."
This invents evidence rather than extracting it.

**Portfolio:** "Rebuild everything and put my resume and job applications online."
This expands scope and crosses the public/private boundary.

## Good Extraction Prompt

```text
Extract facts from my redacted resume and project notes into the existing profile
schema. List conflicting or missing facts for my review before changing files.
Do not invent achievements or publish source documents. Wait for my approval.
```

Use the good implementation prompt above only after approving the extracted facts.
Next: [build authentication](00-authentication.md) before opening private tools.
