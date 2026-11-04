---
target: homepage (src/pages/index.astro)
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\Hakim\\Desktop\\ClaudeProjects\\Portfolio Website\\src\\pages\\index.astro"
target_fingerprint: "sha256:787fb4e64d8423dcc5f601936e06badbeed7a65ff301849d887dd2139b491d8b"
target_path: "C:\\Users\\Hakim\\Desktop\\ClaudeProjects\\Portfolio Website\\src\\pages\\index.astro"
timestamp: 2026-11-04T03-54-44Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review sub-agent · B: detector + browser sub-agent)

Target: homepage, src/pages/index.astro (live: https://applai.gtata.workers.dev). Mode: Experience.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Run shows "Running…", a status line and the active menu section; focus silently drops to <body> during a run, and on mobile the result lands off screen |
| 2 | Match System / Real World | 3 | Warm, plain copy; "Automates:" is strained on some cards ("Turning compressed data back into pixels") |
| 3 | User Control and Freedom | 3 | Re-run and job switching work; a run can't be skipped, but it is short |
| 4 | Consistency and Standards | 2 | Clickable and non-clickable project cards hover identically; one pill style means four things; timeline colour coding is broken (all grape) |
| 5 | Error Prevention | 3 | Controls lock during a run; little can go wrong |
| 6 | Recognition Rather Than Recall | 3 | Menu and contact stay in view on desktop; both vanish below 1000px |
| 7 | Flexibility and Efficiency | n/a | One-page portfolio, no expert paths |
| 8 | Aesthetic and Minimalist Design | 3 | Calm and well spaced; pill clutter and a very tall machine card on mobile |
| 9 | Error Recovery | 2 | Only contact is a mailto: button with no visible address; with no mail client the click does nothing |
| 10 | Help and Documentation | n/a | Not needed beyond the "how this site works" link |
| **Total** | | **22/32** | **Acceptable (69%)** |

## Design Specificity Verdict

LLM assessment: specific in concept, interchangeable in composition. The machine is the one piece only Hakim could have: its three jobs map onto his target roles (spreadsheet = data, tickets = IT support, sensor = his LiDAR work), the sample data is believably messy, and each project's "Automates:" line ties back to the thesis. Around it, the skeleton is a familiar recipe: Chiang-style split layout, cursor glow, dot + title + pill project list, vertical timeline. Cover the headline and the machine and it could be any warm dev portfolio. The machine itself is under-scaled (about 150–210px between two large beige trays), so the signature moment reads as a widget rather than a scene.

Deterministic scan: CLI `impeccable detect` on src/pages/index.astro + src/alt returned 0 findings (scoped ignores applied). Browser overlay on the homepage found 16 items: bounce-easing ×9 (cards and career steps; already accepted as the user's choice, the overlay ignores file-scoped exceptions), low-contrast ×2 ("IT support" pill #c2410c on #ffe7dc ≈4.4:1; "Data" job label #6e6587 on #ece6ff ≈4.47:1), hard-offset-shadow ×2 ("Say hello" and "Run", `0 4px 0 var(--grape)`), straggler ×1 (one-word last line in a career bullet), nested-cards ×1 (false positive: the output tray's empty-state text), plus page-level cream palette and an infinite pulsing dot. Project page: low-contrast ×1 ("My role" label), straggler ×2, hard-offset-shadow ×1.

Agreement: both assessments independently flagged the tangerine pill contrast and the pulsing dot. The detector added the second contrast miss (job role label), the offset shadow and the stragglers; the design review caught issues no detector can (lost focus, dead-end hover, broken timeline colours, misleading chart scale, fragile contact).

## Overall Impression

The concept lands: "I automate the boring parts" plus a toy that proves it is memorable and on-message. Execution around it is generic, and the page fails its one real job, getting a recruiter to contact Hakim, on mobile and on webmail machines. Biggest opportunity: make contact unmissable and make the projects section stop deflating the peak.

## What's Working

1. The toy's content is the argument: three jobs = three target roles, correct outputs, human status lines, aria-live, reduced-motion swap.
2. Career path copy is specific, quantified with his own numbers (40%, 20%, 80%) and in a warm first-person voice.
3. Token discipline: a real re-tuned dark mode, AA contrast almost everywhere, visible focus ring, working skip link.

## Priority Issues

[P1] Contact is fragile and disappears on mobile. Only a mailto: button (index.astro:163) with no visible address; below 1000px there's no contact after the hero; the page ends on a footer link to the site write-up; no resume PDF exists. Why: the primary conversion is "email him"; recruiters copy addresses into ATS/webmail and expect a resume. Fix: visible address + copy button with "Copied" state; a closing contact block after Career path (email, resume, LinkedIn); a compact sticky "Say hello" on mobile; upload the resume. Command: /impeccable clarify, /impeccable adapt.

[P1] The Projects section undermines the pitch. 5 of 6 cards say "Write-up coming soon", and non-link cards get the same hover lift as the link card (index.astro:186-189, 491-495), a false affordance. Why: right after the toy's peak, a recruiter hits a list of unfinished entries and a dead-end click. Fix: hover only on .card.is-link; split into one prominent "Read the write-up" card and a compact "From my resume" list led by results. Command: /impeccable distill, /impeccable layout.

[P1] Keyboard focus is lost on Run; the radio group is half-built. Disabling the Run button (Machine.astro:183-184) drops focus to <body>; all three job options are tab stops (no roving tabindex), only Left/Right work; aria-label on plain tray divs (Machine.astro:55, 81) is ignored. Why: keyboard and screen-reader users lose their place at the signature moment. Fix: aria-disabled + early return (or refocus Run after); roving tabindex + Up/Down; role="group" on trays. Command: /impeccable harden.

[P2] On mobile the payoff happens off screen and the card shifts the page. At 390px Run sits at the bottom of the first viewport with the output below it; card height changes between jobs (≈30–50px jumps). Fix: on narrow screens put the controls under the bot or scroll the Out tray into view on Run; give the stage a fixed min-height; tighten the mobile card. Command: /impeccable adapt.

[P2] Visual-system bugs a careful reviewer will spot. Timeline colours are all grape because .step (index.astro:589) is declared after .c-* with equal specificity; tangerine pill and job-role label miss AA (≈4.4:1); the spreadsheet bar chart exaggerates differences (calc(var(--h) - 18px), Machine.astro:544) and silently drops April. Fix: scope as .step.c-teal etc.; darken --tangerine-ink to ~#b23a0a and the role label; give bars their own track and show April as "n/a". Command: /impeccable polish.

## Persona Red Flags

Jordan (first-time, non-technical recruiter): the name "Abdelhakim Gtat" is a small grey line above a 70px slogan, the least prominent text in the hero; the role pills look like filters but do nothing; jargon on cards (MacSim, FSMs, Shiki, SystemVerilog) has no homepage glossary.

Casey (mobile, one thumb): Run shows no visible result without scrolling; no navigation or contact after the hero; ~5,600px page; job buttons fade to 60% during a run with no explanation.

Sam (keyboard / screen reader): focus dropped to <body> after Run; three tab stops in the "radiogroup", no Up/Down; theme toggle has a static label and no pressed state; messy input chips are read as garbled strings with no "sample messy input" label.

## Minor Observations

- theme-color meta follows the OS, not the manual toggle.
- Cursor spotlight is nearly invisible in light mode for its paint cost.
- "Login failure ×2" wraps in the narrow Out tray at 1440px.
- Sensor output reads as an abstract polygon; a wall or scale cue would help.
- The pulsing dot by "Hi, I'm…" animates forever and competes with the headline.
- "Say hello" and "Run" use a hard 4px offset shadow; intentional bounce styling, but it's the one element the detector calls a costume.
- Status text ("Full write-up and code" / "coming soon") is 13px grey at the far right.
- At 1440px the machine is small inside a wide right column.

## Questions to Consider

- If five of six projects can't be opened, should Career path, where the strongest quantified automation evidence lives, come before Projects?
- Could each machine job end with "I did this for real at Thermo Fisher / Pepsi →" so the toy becomes a doorway to real numbers?
- Would a hiring manager who reads only the first viewport learn your name, target role and how to reach you?
