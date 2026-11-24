# madalintat.github.io: design

Date: 2026-11-24. Owner: Mădălin Tatarciuc. Status: draft for approval.

## Why

Mădălin is a full-time applied AI researcher at Invergent on about €2k net a month. Peers on remote AI roles earn €8–15k. The gap is not skill, it is that nobody can see the work: the best of it is private or under employer names, the current site is a stale Jekyll page from 2025, LinkedIn lists "Marketing" as a top skill. This site is the one place a hiring manager at a remote AI company (research lab, applied-AI startup, founding-engineer role) lands from the CV, LinkedIn, X or a cold email, and within two minutes understands: this person ships models **and** the products around them, with measured numbers and the limits said plainly.

Success: a hiring manager who opens one project page reads to the end and replies. Measurable proxy: the site is linked from both CVs and every application, and the owner is proud to send it.

## Goals

1. Show both sides equally: the researcher (numbers, method, honest limits) and the engineer (whole products, shipped alone).
2. One deep page per piece of work, with real footage, figures and numbers that have sources.
3. Two live things a visitor can touch (see Demos).
4. A research notes section the owner keeps writing in, starting with two notes at launch.
5. Built with the same discipline as Superstarling: spec, plan, tokens, tests, slop audit at desk and phone width in both themes, owner review before deploy.

## Non-goals

- No blog engine, CMS, comments, newsletter or analytics beyond what GitHub Pages gives.
- No Superstarling sign-up or "try it": it is private and not launched.
- No Surogate Router or other work the owner did not do.

## Anti-goals (failure even if it works)

- Looks like every AI portfolio: gradient hero, glowing orb, three icon cards, invented stats, "Get started". Owner's own `real-design-no-stupidass-slop` rules apply in full (copy-voice, marketing-page, slop-audit).
- Any number without a source or a condition. Any claim of someone else's work.
- Publishing Invergent IP the contract does not allow (see Constraints).
- A long scrolling home page: home is one screen at desk width (owner's no-scroll preference); depth lives on project pages.

## Constraints

- **IP.** The owner's contract does not allow publishing Invergent work under his name. Allowed: linking to and describing models Invergent already published (jackrabbit-110m-ro, amami-357m-ro on HF, CC-BY-NC-4.0) and stating he built them, using numbers already public in those model cards. Not allowed without a written yes from Invergent: new exports of their models, internal docs, code, private benchmarks.
- **ipporu** is entirely his. Model weights stay private (pending legal review over YouTube-derived labels). Footage is top Japanese matches from public streams (owner's choice), handled as in the ipporu launch kit: names blurred or omitted, source credited, short clips only.
- **Hosting:** GitHub Pages at madalintat.github.io, static files only. Deploy only after the owner's explicit go.
- **Email:** not printed in page text; it appears only inside the CV (owner said yes to the CV on the site, 11-24).
- **Mac:** 8 GB. One heavy job at a time; no parallel builds with other dev servers.

## Approaches considered

- **A. Static project pages.** Rich pages with films, figures, numbers. Fast, robust. Shows less than he can do.
- **B. A plus two live demos.** The demos are the thing almost no other candidate has.
- **C. B plus research notes.** Chosen by the owner: the strongest long-term signal for research roles, as long as he keeps writing.

## The site

### Stack (builder's call, stated)
Vite + React 19 + TypeScript + react-router, prerendered to static HTML per route so pages work without JS and share well. Same toolchain family as Superstarling's web app (Vite, Inter variable, JetBrains Mono, oxlint, vitest). CSS with tokens on `:root` and a dark theme, a token lint like Superstarling's `rules/css-tokens.mjs`. Notes are Markdown files with front matter rendered at build time. The old Jekyll content is removed; the PS3 Eye post moves into notes.

### Routes
```
/                      home: one screen
/work/ipporu           ipporu: kendo video understanding + platform
/work/romanian-speech  Romanian ASR and TTS (built at Invergent)
/work/superstarling    Superstarling: workspace with an agent team
/work/surogate         platform work at Invergent: Superstar, Ops, Surogates
/notes                 research notes index
/notes/<slug>          one note
/cv                    the CV as a clean web page, with both PDFs (research, builder) to download
```

### Home (one screen at 1280×800)
```
┌──────────────────────────────────────────────┬──────────────────┐
│ Mădălin Tatarciuc                            │                  │
│ Applied AI researcher. Models and the        │   ipporu film    │
│ products around them.                        │   (9:16, muted,  │
│                                              │    pause button) │
│ Work                                         │                  │
│ ipporu            video models for kendo  →  │                  │
│ Romanian speech   ASR on a CPU, 5.00% WER →  │                  │
│ Superstarling     agent team workspace    →  │                  │
│ Surogates         open agent runtime      →  │                  │
│                                              │                  │
│ Notes                                        │                  │
│ When my labels fooled me (V-JEPA 2)       →  │                  │
│ ...                                          │                  │
│ GitHub  Hugging Face  X  LinkedIn            │                  │
└──────────────────────────────────────────────┴──────────────────┘
```
Phone: one column, film after the work list.

### Project page shape (each)
1. Title, one line, the real thing (film or screenshot), links (live site, HF, GitHub).
2. **Numbers** strip: three or four measured figures, each with its condition and source.
3. **How it works**: one drawn figure of the real mechanism (e.g. ipporu's model chain), short sections.
4. **What I did**: the owner's part, plainly; for Invergent work, "built at Invergent" and links to the public artefacts.
5. **Limits**: what does not work yet, with numbers.
6. One closing line and one link onward.

### Content per page
- **ipporu.** Model chain figure (tracker → pose → strike → flag reader → who struck → shinai → ribbon). Numbers from `docs/VIDEO_PRODUCTS.md` and the tracking notebook: who struck: the V-JEPA 2 model's 76% came from agent-made labels; on 83 clean flag labels it is at chance (57% vs 58% always-aka), E101 11-11; ippon side comes from flags + tasuki and is product-ready; strikes 152 of 182 found on 20 held-out matches with 32% wrong calls. Live demo (below). Launch film, desk and phone screenshots from `platform/film/out`. ~2,600 commits since 8 Oct 2026. Link ipporu.com.
- **Romanian speech.** Only public facts from the two HF model cards: 110M Parakeet fine-tune, 5.00% WER offline / 5.75% streaming on 3,196 clips (FLEURS, Common Voice 22, VoxPopuli); 357M Magpie TTS, three voices in one CPU checkpoint, 7.15–8.08% WER on 301 stress sentences. No audio at launch (owner, 11-24): numbers, a figure of the pipeline and model links. Audio can be added later.
- **Superstarling.** README screenshots (home, playbooks, connections) and a short screen film recorded from the local app; 31 block types, 10 agents, 1,200+ server tests, ~800 commits since 11 Nov 2026. "In private build", no sign-up.
- **Surogate (Invergent).** Public things only (owner, 11-24): 708 commits to the open-source Surogates runtime, and the public speech models. Superstar and Ops are private and are not named anywhere on the site or CVs.

### Demos
1. **ipporu engine on a Japanese match (live).** Owner's call (11-24): use top Japanese footage, not his own Serbia/EKC bouts, because it shows the engine on the best kendo. Candidates already processed by the engine: the 8-dan match and the RsF3X match in `~/ipporu-journey/videos` (2026-11-05 ribbon runs, both with ippon). Same handling as the ipporu launch kit: player names blurred or omitted, source credited, clip short. Run or reuse the engine output and export a compact JSON (tracks per frame, strikes with times and confidence, flags, ippon). In the browser: the clip plays with a canvas overlay; a timeline of strikes underneath; click a strike to jump there; toggle layers (tracks, pose, strikes). Clip trimmed to under 60 s and under 10 MB.
2. **Romanian speech: none at launch** (owner, 11-24: no live model, skip audio for now). Later option: a recorded demo: a 30–45 s film of the owner speaking Romanian with the live transcript appearing, plus the three TTS voices reading one sentence, recorded on his own machine from the public models.

### Notes at launch
1. "When my labels fooled me": how a 76% who-struck model turned out to be reading agent-made labels, caught on 83 clean flag labels (E81, E89, E93, E101 in the tracking notebook). Honest failure stories are the strongest research signal.
2. "Building a PS3 Eye driver for Apple silicon" — the existing post, moved.
Then a template for the next ones. Research report (`/Users/madalintat/cv/research-remote-ai-jobs.md`, in progress) feeds copy and priorities when it lands.

### Visual direction: the cetusian vibe (owner, 11-24)
The site is the cetusian identity, grown up. Sources: `~/cetusian/social/identity/{voice,persona,positioning}.md` and the old site's CSS.
- **Copy:** lowercase, dry, understated, specific; the artifact leads; constraints and failures before outcomes; numbers, not adjectives; no em dashes, no closing epigrams, no copula equations ("x is the whole trick"), no self-deprecation; occasionally a little unhinged when it sharpens the idea. Lowercase overrides the sentence-case rule in the design skills. Project names keep their own case only where the brand does (ipporu is already lowercase).
- **Type:** IBM Plex Mono for the name, headings, labels, numbers and code (the old site's face); a readable sans (Inter) for long-form note paragraphs only. At most four sizes.
- **Colour:** near-white / near-black surfaces; one accent, the old cetusian cyan (`#0099cc`, adjusted per theme for contrast), for links and live states. ipporu's aka red appears only inside the ipporu demo, as its own brand.
- **Identity:** "cetusian" appears as the handle/wordmark (X, HF), next to the full name; the name is the page title.
- Owner's design rules still apply: one primary action per screen, no gradients, no glass, no eyebrows, no invented stats, real footage, light and dark themes.

### Checks before the owner sees it
- `uislop-scan.mjs` on `src` with `--strict`, `check.py` on all copy, and `~/cetusian/social/tools/voicecheck linkedin -` on every block of site copy: zero findings or a reasoned ignore.
- Rendered sweep at 390, 820, 1280 and 1600 px in both themes; screenshots looked at.
- Every link resolves (script); every number traced to a source listed in `docs/sources.md`.
- Lighthouse performance and accessibility at least 95 on home and one project page.
- Home fits one screen at 1280×800.

## Left to the builder
File layout, component names, the prerender method, the overlay drawing code, image sizes, exact copy within the voice rules.

### CV page (owner: yes, 11-24)
`/cv` renders the CV as a web page in the site's own type and tokens, minimal and clean: one column, the same content as the PDFs, a toggle between the research and builder versions, and a download for each PDF. Prints to one A4 page. The PDFs are generated from the same source so they never drift.

### ipporu demo source (owner, 11-24)
No new engine runs (builder check 11-24). Per-frame tracks and pose were never saved, so the demo uses what exists in `replay/studio/lib.json`: strikes with confidence, flags, ippon and the wave, for six matches. Pick a Japanese match from those six that was **not** in training (the 8-dan `pguDncSeoio` was, so it is out). Demo shows the video, a strike timeline with confidence, flag and ippon moments, click to jump; no tracks/pose layers. Overlay drawn from those events only.

## Repo and hosting (builder's call)
The first draft `index.html` on `redesign-2026-11` was discarded. Deploy moves GitHub Pages from the legacy Jekyll build to a GitHub Actions workflow; changing that setting happens only with the owner's go at deploy time.

## Decided by the owner
1. CV on the site: yes, nicely done.
2. Live speech model: no. Audio: skipped for now.
5. Invergent work: public things only (Surogates runtime, public HF models); Superstar and Ops not named.
3. Footage: Japanese matches, not his own bouts.
4. Build quality like Superstarling (same toolchain and checks), own identity.

## From the research report (2026-11-24, `/Users/madalintat/cv/research-remote-ai-jobs.md`)
- Every project page opens with **the number and the demo** in the first screen; reviewers give a first pass 7–10 s, hiring managers under 5 min.
- Restraint wins (karpathy.ai, jalammar, sander.ai); a few deep artefacts beat many repos.
- Notes are the hiring artefact (Keller Jordan's Muon post, fast.ai "a blog is a resume, only better"); a failure story with numbers is credible.
- A "Start here" path on home for a hiring manager: work, one note, CV.
- CV states "EU citizen · remote, CET · B2B or employment" to pass location filters.
