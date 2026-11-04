# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers across a broad range (confirmed 2026-11-03): IT support, data analyst, automation, and embedded/networking/systems roles, including entry-level positions. They skim a portfolio between other tasks, often have no time to read raw source, and many are not programmers. Hakim positions himself as a broad generalist whose common thread is automation: with data, tasks or hardware.

## Product Purpose

Personal portfolio and long-term hub for Abdelhakim Gtat (Hakim), Computer Engineer (B.Eng., McMaster, Dec. 2024), Ottawa. Linked to GitHub (`HakimGtat`). Success: a reviewer understands what Hakim built, how it works, and what his part was, then reaches out by email.

## Positioning

Headline: "I automate the boring parts." Work automation from jobs (Thermo Fisher data pulls and Power BI pipeline, Pepsi dashboards and SAP/Azure rollout) appears in the career path with Hakim's own numbers. Code is a side feature shown on request. Every project can show its real source code next to a plain-English "Explain this" walkthrough whose steps highlight the exact lines they describe. Walkthroughs are pinned to a commit and checked at build time, so they cannot drift from the code.

## Operating Context

- Reviewers arrive from a resume, cover letter, LinkedIn or GitHub link.
- Explanations assume roughly first-year programming knowledge; jargon gets a hover glossary.
- Walkthroughs start as Claude drafts (`npm run explain`), are reviewed by Hakim, and only reviewed ones ship.

## Capabilities and Constraints

- Astro static site, React only for the code explorer island; Cloudflare Pages hosting (planned).
- Project content: one MDX file per project (`src/content/projects/`), one reviewed JSON explanation per project (`src/content/explanations/`).
- Two design directions exist for comparison: the original engineering-notebook site at `/` and a clean, professional alternate at `/alt`. One will be kept.
- Undecided: custom domain name.

## Brand Commitments

- Voice: first person, warm, a little casual, normal capitalization; professional in write-ups and results.
- "AG" chip monogram exists (`src/components/ChipLogo.astro`, `public/favicon.svg`).
- Phone number is never shown on the site.

## Evidence on Hand

- Resume projects: C++ Markov prefetcher (−30% average memory access time on MacSim), LiDAR spatial measurement system (MSP432, C), TCP/UDP network servers (Python, sockets), Breezy smart fan (Raspberry Pi, TF Lite; Hakim owned the motor module), SystemVerilog image decompressor.
- Live on the site so far: only "This Portfolio" (the site itself). The other projects are not on GitHub yet; do not show their code or invent screenshots of them.
- Certifications: AZ-900 (earned), AZ-204 (in progress).
- No testimonials, logos, employers' endorsements or demo videos exist. Do not fabricate any.

## Product Principles

1. Show the real code; never a mockup of code that doesn't exist.
2. Explanations must be checkable: every claim points at lines.
3. Results come only from Hakim's own numbers, never generated.
4. Respect a skimming reviewer's time: the important thing is visible in seconds.

## Accessibility & Inclusion

Keyboard-operable explorer, visible focus, reduced-motion respected, WCAG AA contrast in both themes.
