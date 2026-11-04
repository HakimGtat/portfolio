---
version: 1
slug: "src-pages-alt-index-astro"
primary_target: "src/pages/alt/index.astro"
related_targets: ["src/pages/alt/projects/[slug].astro"]
---

## Scope

`/alt` home and `/alt/projects/[slug]`: a clean, professional alternate of the portfolio, built to be compared against the notebook design at `/`. Mode: Experience (portfolio). Code-led build (no image generation available).

Audience and job: recruiters and hiring engineers skim, judge whether Hakim writes and explains real code well, then email. Proof: the real walkthrough of this site's own source. Constraints: no invented projects, metrics, logos or testimonials; phone never shown.

Pinned by the user: "clean portfolio type website, really professional", system taken from awesome-design-md's Vercel DESIGN.md (system only, no brand clothes: no mesh gradient, no logos).

## Direction contract

THESIS: The walkthrough is the proof, so it sits in the first viewport working, not behind a click. Refuses the centred headline + buttons + equal card grid portfolio.

OWN-WORLD: Ink #171717 on #fafafa with a strict grey ladder (#4d4d4d body, #6b6b6b mute, #ebebeb hairlines), stacked soft shadows with inset hairline rings, Geist 400/500/600 with negative display tracking, Geist Mono only for code, paths, line numbers and commit IDs. One colour job: link blue #0070f3 marks highlighted lines and links. Dark ink editor panel is the only dark surface on light pages.

STORY: Visitor reads who Hakim is in one sentence, watches real code annotate itself line by line, understands he builds and explains low-level software, opens a project, emails him.

FIRST VIEWPORT: Desktop: left 5/12 column, 56px headline (sentence case, period), one-sentence intro, black pill "View work" + white pill "Email me". Right 7/12: dark editor showing `src/lib/validate.ts` with three annotated steps auto-advancing every 5s, step tabs under it. Mobile: headline first, editor below at full width.

FORM: Vercel-system pinned by brief (position 1 of 1, brief-pinned). seed: none (unavailable)

SIGNATURE INTERACTION: hero editor steps through real line ranges (highlight sweeps in, note crossfades); hover or focus pauses; tabs jump; reduced motion shows step 1 static.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Which design (notebook at `/` or clean at `/alt`) ships.
