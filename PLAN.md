# Portfolio Hub — Build Plan

Personal portfolio for Abdelhakim Gtat (Computer Engineer — embedded, networking, systems). Linked to GitHub (`Hakim112`) and the central hub for all future projects. Signature feature: an "Explain this" view that walks through real code in plain English.

---

## 1. Goals & audience

- **Primary audience:** recruiters and hiring engineers for embedded / networking / systems roles.
- **Explanation reader baseline:** someone with roughly first-year programming — knows variables, functions, loops, what memory and a network are. Domain jargon (cache, socket, FSM, PWM, IDCT, …) gets a one-line definition on first use via a hover glossary. One reading level only.
- **Voice:** first-person, warm, a little casual (occasional dry aside), proper capitalization. Professional in project write-ups and results.

## 2. Content sourcing

- **Curated projects.** Each featured project is one MDX file in the site repo. Projects are added as prototypes get cleaned up and committed to GitHub.
- **Code is fetched at build time from GitHub, pinned to a commit SHA** set in the project's frontmatter. Updating a project = bump the SHA, regenerate/review the explanation.
- **Coursework policy:** publish with course-specific scaffolding stripped; group projects state clearly which parts were mine. If a course still reuses the assignment, keep the repo private and show a write-up, diagrams and short excerpts only.

## 3. Stack & hosting

| Concern | Choice |
|---|---|
| Framework | Astro + TypeScript, MDX content collections |
| Interactivity | React islands (explanation panel, demos, LiDAR hero) |
| Syntax highlighting | Shiki at build time, theme matched to site palette |
| Hosting | Cloudflare Pages |
| Domain | Custom domain via Cloudflare Registrar (e.g. `abdelhakimgtat.dev`) |
| Analytics | Cloudflare Web Analytics (cookieless, no banner) |
| Site repo | Public; listed as a project on the site with its own walkthrough |

## 4. Site structure

### Home (top → bottom)
1. **Hero** — name, "Computer Engineer — embedded, networking, systems", Ottawa. LiDAR sweep reveal (see §7).
2. **Featured projects grid** — cards: title, one-line summary, color-coded tech tags, preview image/clip.
3. **About** — short bio + certifications line (AZ-900; AZ-204 in progress).
4. **Contact** — email link, LinkedIn, GitHub, resume PDF download. **No phone number.**

### Project page template
1. Problem
2. My role (explicit for group work)
3. Tech stack (tags)
4. Results with real numbers (frontmatter only — never AI-generated)
5. Demo (clip / video / visualization)
6. Overview (plain-English summary of architecture)
7. Code viewer — 2–5 key files listed in frontmatter, with **"Explain this"**
8. Links — repo + pinned commit; "Browse full repo on GitHub"

No in-site file-tree browser.

### Future
Structure leaves room for a `/notes` blog section; not in v1.

## 5. Explanation feature

### UX
- **"Explain this"** toggle on the code viewer.
  - Desktop: side panel beside the code.
  - Mobile: bottom sheet.
- **Overview** sits at the top of the project page.
- **Walkthrough mode:** numbered steps (2–4 key sections per project). Selecting a step scrolls the code to its line range and highlights it while the annotation explains it.
- Annotations are styled as **margin notes** with hand-drawn-style arrows pointing at the highlighted code.
- **Glossary hovers** on jargon terms, defined once in a shared glossary file.

### Content format (sketch)
```yaml
# src/content/projects/markov-prefetcher.mdx frontmatter
title: Markov Prefetcher
repo: Hakim112/markov-prefetcher
commit: <sha>
role: Solo
stack: [C++, Linux, MacSim, x86]
results:
  - "−30% average memory access time"
files:
  - path: src/markov_prefetcher.cpp
  - path: src/markov_table.h
walkthrough:
  - file: src/markov_prefetcher.cpp
    lines: [42, 71]
    note: ./walkthrough/01-predict.md
```

### Generation pipeline
- `npm run explain <project>` — local CLI script.
  - Fetches the listed files at the pinned SHA.
  - Calls the Claude API (**Claude Sonnet 5.5**) with the code + reader-baseline rules.
  - Writes a **draft** overview + walkthrough MDX for me to review, edit and commit.
  - API key stays local (`.env`, git-ignored).
- Later option: GitHub Action that opens a PR with a draft when a SHA is bumped.

### Accuracy guardrails
- Prompt forces every walkthrough step to cite a specific file + line range.
- Prompt forbids inventing metrics; results come only from frontmatter.
- **Build-time validation fails** if any cited line range doesn't exist in the file at the pinned commit.

## 6. Demos & media

- Short clips (< ~15 s): self-hosted, muted, looping, compressed WebM/MP4.
- Longer walkthroughs: YouTube, click-to-load embed (no third-party load until clicked).
- Embedded/hardware work is shown via recorded demos or browser visualizations of its output (e.g. LiDAR point cloud plotted in-browser).

## 7. Visual design

- **Theme: engineering notebook / schematic.** Professional, clean base with personality in a few signature touches.
  - Faint blueprint grid background.
  - Section dividers drawn as circuit traces.
  - Explanations as handwritten-style margin annotations.
- **Signature moment:** LiDAR sweep in the hero — rotating scan line reveals name + point-cloud outline.
- **Micro-interaction:** a small "packet" travels along the trace on project-card hover.
- **Motion:** all animation disabled under `prefers-reduced-motion`.
- **Color:** resume teal + purple accents on an off-white "paper" background; dark mode in deep navy. Light/dark toggle.
- **Tech tags color-coded by category:** languages · hardware/embedded · networking · tools.
- **Type:** clean sans for body; monospace for headings/labels and code.
- **Logo:** "AG" monogram drawn as an IC chip (pins + notch). Used as favicon and nav mark; must read at 16 px.
- No 3D, particles or scroll-jacking.

## 8. v1 scope (definition of done)

- [ ] Site live on the custom domain via Cloudflare Pages
- [ ] Home, project template, about, contact all built
- [ ] Explanation feature working end-to-end (panel, walkthrough, glossary, build validation)
- [ ] `npm run explain` pipeline working
- [ ] **Project 1:** the portfolio site itself, with walkthrough of the explanation feature
- [ ] **Project 2:** C++ Markov prefetcher — or Breezy (smart fan) if the prefetcher course still reuses the assignment
- [ ] Light/dark mode, responsive down to phone width, reduced-motion respected
- [ ] Cloudflare Web Analytics enabled

## 9. Adding a project later

1. Clean up the prototype and push it to GitHub.
2. Add `src/content/projects/<slug>.mdx` with frontmatter (repo, commit SHA, role, stack, results, key files).
3. `npm run explain <slug>` → review and edit the draft.
4. Add demo media.
5. Push → Cloudflare Pages rebuilds.

## 10. Candidate future projects (from resume)

- Markov prefetching algorithm (C++, MacSim)
- LiDAR spatial measurement system (Embedded C, MSP432)
- Communication network servers (Python, TCP/UDP, IPv4/IPv6, sockets)
- Breezy smart fan (Python, Flask, Raspberry Pi, TF Lite) — my part: motor control module
- Image decompression (SystemVerilog, FSMs, SRAM/VGA/UART)
