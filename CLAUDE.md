# Portfolio site

Hakim Gtat's personal portfolio and project hub. Live at https://applai.gtata.workers.dev, repo https://github.com/HakimGtat/portfolio (public). Headline: "I automate the boring parts." Audience and voice rules live in `PRODUCT.md`; read it before changing copy.

## Commands

- `npm run dev`: dev server on http://localhost:4321
- `npm run check`: type check (`astro check`); keep it at 0 errors
- `npm run build`: production build to `dist/`; fails on purpose if a walkthrough is unreviewed or its line ranges don't exist
- `npm run explain <slug>`: draft a walkthrough with the Claude API (needs `ANTHROPIC_API_KEY` in `.env`)

## Layout

- `src/pages/index.astro`, `src/pages/projects/[slug].astro`: the live design (warm split layout, machine toy). Components in `src/alt/` (`Machine.astro`, `CopyEmail.astro`, `AltLayout.astro`, `alt.css`, `Icon.astro`).
- `src/pages/notebook/`: the original "engineering notebook" design, kept as a backup and marked noindex. Uses `src/layouts/BaseLayout.astro`, `src/components/`, `src/styles/global.css`. Don't delete it.
- Branch `backup-notebook`: older layout with the notebook at `/` and the current design at `/alt`.
- `src/content/projects/*.mdx`: one hand-written file per project (role, stack, results, key files, pinned `repo` + `commit`).
- `src/content/explanations/*.json`: one walkthrough per project, same slug. `reviewed: false` blocks production builds.
- `src/lib/`: `source.ts` (reads code from GitHub at a pinned commit), `validate.ts` (line-range checks), `project.ts` (loads and highlights), `notes.ts` (formats notes, `[[glossary]]` terms from `src/data/glossary.ts`).
- `src/components/explorer/ProjectExplorer.tsx`: the shared "Explain this" code viewer (React island), styled per design via CSS variables.
- `src/data/site.ts`: name, email, links, description, certifications. `public/resume.pdf` makes the resume links appear.

## Rules

- Never invent facts: results and numbers come only from Hakim's resume or what he says. Label demo data as sample data. `career-ops` is someone else's open-source project; never present it as his.
- Walkthrough line ranges point at a pinned commit. When code shown in a walkthrough changes, bump the project's `commit`, update the explanation's `commit` and ranges (or re-run `npm run explain`), and have Hakim re-review.
- Ask before every commit and before every push. Pushing to `main` deploys the live site.
- Keep the warm direction for the live design (Bricolage Grotesque + Figtree, tangerine/sun/teal/grape on warm light, real dark mode). Bounce easing and Geist are user-approved; their detector ignores are in `.impeccable/config.json`.
- Design work uses the project skills in `.claude/skills/` (impeccable, design-taste-frontend, web-design-guidelines). Critique snapshots are in `.impeccable/critique/`.

## Deploy

Cloudflare Workers Builds deploys `main` automatically. `wrangler.jsonc` uploads `dist/` as static assets; its `name` must match the Worker (`applai`). Node 24 is pinned in `.node-version`. No Cloudflare adapter: the site is fully static.

## Adding a project

1. Push the code to GitHub (public).
2. Add `src/content/projects/<slug>.mdx` with `repo: HakimGtat/<repo>`, a full `commit` SHA, role, stack, results and 2–5 key files.
3. `npm run explain <slug>`, review and fix the draft, set `"reviewed": true`.
4. Move the project from the "From my resume" list in `src/pages/index.astro` to the featured section if it has a write-up.

## Still open

- Custom domain: `site` in `astro.config.mjs` is a placeholder (`abdelhakimgtat.dev`).
- Projects not yet published: Markov prefetcher, LiDAR scanner, network servers, Breezy, image decompressor, ApplAi (on the resume; Hakim said not to list it yet).
