# madalintat.github.io Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stale Jekyll site with a prerendered static site in the cetusian voice: one-screen home, four project pages, a live ipporu demo, research notes and a CV page with matching PDFs.

**Architecture:** Vite + React 19 + TypeScript app, every route prerendered to its own `index.html` by a small SSR script, so pages work without JS and survive refresh on GitHub Pages. All content (projects, numbers, notes, CV) lives in typed data and Markdown under `src/content/`, and every number carries its source. Checks (token lint, slop scan, voicecheck, links, sources) run in `npm run check`.

**Tech Stack:** Node 24, Vite 8, React 19, react-router-dom 7, TypeScript, vitest, oxlint, `marked` (notes), `@fontsource/ibm-plex-mono`, `@fontsource-variable/inter`. Chrome headless for PDFs. ffmpeg + yt-dlp for the demo clip.

**Spec:** `docs/superpowers/specs/2026-11-24-personal-site-design.md`

## Global Constraints

- Copy: lowercase, dry, specific; no em dashes; no burned words from `~/cetusian/social/identity/rules.json`; every block passes `~/cetusian/social/tools/voicecheck linkedin -`.
- Every number on the site has a source and a condition in `src/content/sources.ts`; no number without one.
- Invergent: public things only. Name only the Surogates runtime (708 commits) and the public HF models jackrabbit-110m-ro, jackrabbit-110m-ro-streaming, amami-357m-ro. Never name Superstar or Ops.
- who-struck: the V-JEPA 2 model's 76% came from agent-made labels; on 83 clean flag labels it is 57% vs 58% always-aka (notebook E101, 2026-11-11). Never publish 73–74% as a result.
- Counts: ipporu ~2,600 commits since 2026-10-08; Superstarling ~800 commits since 2026-11-11; 99 logged experiments.
- No email in page text; email only inside the CV.
- Type: IBM Plex Mono (name, headings, labels, numbers, code), Inter (long note paragraphs only); at most four font sizes.
- Accent: cetusian cyan `#0099cc` (light), a lighter cyan in dark that passes 4.5:1; ipporu aka red only inside the demo.
- Home fits one screen at 1280×800; no horizontal scroll at 390 px.
- No deploy, no push to `main`, no change to Pages settings without the owner's explicit go.
- 8 GB Mac: one dev server or heavy job at a time.
- Commits: plain present tense, no Claude attribution.

## Review Focus

1. **Refresh or deep link on GitHub Pages** (`/work/ipporu`, `/work/ipporu/`, `/notes/<slug>`): a real page, not a 404. Pinned in Task 8.
2. **JS disabled or slow:** all text, numbers and links visible from the prerendered HTML; the demo shows its event list without JS. Pinned in Tasks 5 and 8.
3. **Video fails to load** (blocked, offline): poster shows, demo timeline still lists strikes and ippon with times. Pinned in Task 5.
4. **`prefers-reduced-motion`:** no autoplay on home or demo; a visible play button instead. Pinned in Tasks 3 and 5.
5. **Phone width 390 px, touch:** no sideways scroll; demo markers are at least 44 px tall tap targets. Pinned in Tasks 5 and 9.

---

### Task 1: Scaffold, tokens, token lint; remove Jekyll

**Files:**
- Delete: `_config.yaml`, `_config.yml`, `_layouts/`, `_site/`, `Gemfile`, `Gemfile.lock`, `assets/` (after Task 6 moves the PS3 Eye post), `.DS_Store`
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles/tokens.css`, `src/styles/base.css`, `rules/css-tokens.mjs`, `rules/css-tokens.test.mjs`, `.gitignore`
- Keep: `favicon_io/`, `work/ipporu.mp4`, `work/ipporu.jpg` (move into `public/work/`)

**Interfaces:**
- Produces: CSS tokens `--bg --surface --ink --soft --line --accent --accent-ink --aka --font-mono --font-sans --size-display --size-head --size-body --size-small --radius --gap`; `npm run dev | build | check | test`.

- [ ] **Step 1:** Copy `~/superworkspace/apps/web/rules/css-tokens.mjs`, pointing `SRC` at `../src/`. Write `rules/css-tokens.test.mjs` asserting `undefinedTokens()` returns `[]` for a sheet that defines `--a` and uses `var(--a)`, and returns `[["--b", …]]` for one using undefined `var(--b)`.
- [ ] **Step 2:** `npx vitest run rules` → FAIL (no package yet), then add `package.json` (Node 24, `"type": "module"`, scripts `dev`, `build` = `node rules/css-tokens.mjs && tsc -b && vite build && node scripts/prerender.mjs`, `test` = `vitest run`, `check` = `node rules/check.mjs`) and deps listed in Tech Stack. `npm i`. Re-run → PASS.
- [ ] **Step 3:** Write `tokens.css` with light values on `:root`, dark values under `@media (prefers-color-scheme: dark)`. Light: `--bg #fbfbfa`, `--ink #16181d`, `--soft #5f646e`, `--line #e4e4e1`, `--accent #0099cc`, `--aka #d23c3c`. Dark: `--bg #0f1012`, `--ink #ebebe8`, `--soft #8f949d`, `--line #25272b`, `--accent #3fb8e6`. Sizes: display 28px, head 15px, body 15px, small 12.5px.
- [ ] **Step 4:** `npm run build` → exits 0 with an empty `App` route. `node rules/css-tokens.mjs` → exits 0.
- [ ] **Step 5:** Commit `scaffold: vite, react, tokens and the token lint; jekyll removed`.

### Task 2: Content model with sources

**Files:**
- Create: `src/content/types.ts`, `src/content/sources.ts`, `src/content/work.ts`, `src/content/content.test.ts`

**Interfaces:**
- Produces:
  - `type Source = { id: string; text: string; href?: string; path?: string; date: string }`
  - `type Num = { value: string; label: string; condition: string; source: string /* Source.id */ }`
  - `type Work = { slug: 'ipporu'|'romanian-speech'|'superstarling'|'surogates'; title: string; line: string; hero: { kind: 'film'|'image'|'figure'; src: string; poster?: string; alt: string }; numbers: Num[]; links: { label: string; href: string }[]; sections: { heading: string; body: string }[]; mine: string; limits: string[]; next: { label: string; href: string } }`
  - `export const work: Work[]`, `export const sources: Source[]`, `getWork(slug)`.

- [ ] **Step 1:** Write `content.test.ts`:
  - every `Num.source` exists in `sources`; every `Num.condition` is non-empty;
  - `work.length === 4` and slugs in the order ipporu, romanian-speech, superstarling, surogates;
  - no string anywhere in `work` contains `—`, `Superstar ` followed by `(`, `Surogate Ops`, `73`, `74%`;
  - every `title` and `line` equals its `.toLowerCase()` except names in `['V-JEPA', 'FLEURS', 'CPU', 'WER', 'HF']`.
- [ ] **Step 2:** `npx vitest run src/content` → FAIL.
- [ ] **Step 3:** Fill `work.ts` and `sources.ts` from the spec's "Content per page", using only these numbers:
  - ipporu: 99 countries (ipporu.com meta); ~2,600 commits since 2026-10-08 (git); strikes 152 of 182 found, 32% of calls wrong, 20 held-out matches (VIDEO_PRODUCTS.md l.79); who-struck 76% on agent labels vs 57% on 83 clean flag labels, always-aka 58% (notebook E101).
  - romanian-speech: 110M params; 5.00% WER offline CTC+4-gram and 5.75% streaming, 3,196 clips FLEURS/CV22/VoxPopuli (HF card jackrabbit-110m-ro); 357M Magpie, three voices, 7.15–8.08% WER on 301 stress sentences (HF card amami-357m-ro); amami downloads read live from the HF API at build time, omitted if the fetch fails.
  - superstarling: 31 block types, 10 agents, 1,200+ server tests, ~800 commits since 2026-11-11 (superworkspace README, git). Status "in private build", no link.
  - surogates: 708 commits to invergent-ai/surogates (git, no merges); link to the public repo.
- [ ] **Step 4:** Run tests → PASS.
- [ ] **Step 5:** Commit `content: the four projects and every number with its source`.

### Task 3: Layout and the one-screen home

**Files:**
- Create: `src/layout/Shell.tsx`, `src/pages/Home.tsx`, `src/pages/home.css`, `src/components/Film.tsx`, `src/pages/home.test.tsx`

**Interfaces:**
- Consumes: `work` (Task 2), `notes` (Task 6, until then an empty list).
- Produces: `<Film src poster alt />`: muted, loop, playsinline, a pause/play button with `aria-label` "pause film"/"play film"; autoplays only when `prefers-reduced-motion` is not `reduce`.

- [ ] **Step 1:** `home.test.tsx` (vitest + `react-dom/server`): rendering `<Home/>` gives `h1` "mădălin tatarciuc", the handle "cetusian", four links to `/work/<slug>`, links to github.com/madalintat, huggingface.co/cetusian, x.com/cetusian, linkedin.com/in/madalin-tatarciuc, a link to `/cv`, and no `mailto:`. `Film` with `matchMedia` reduce → no `autoplay` attribute and the button reads "play film".
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Build `Home` per the spec's home sketch: left column (name, handle, one line, "work" rows with title / line / one number, "notes" rows, "start here: ipporu, one note, cv", links); right column the ipporu film (`/work/ipporu.mp4`). One column under 820 px, film after the work list.
- [ ] **Step 4:** Run → PASS. `npm run dev`, open in ego-browser at 1280×800 light and dark, screenshot; home has no vertical scroll. Close the page.
- [ ] **Step 5:** Commit `home: one screen, the work, the notes and the film`.

### Task 4: Project pages and figures

**Files:**
- Create: `src/pages/Work.tsx`, `src/pages/work.css`, `src/figures/IpporuChain.tsx`, `src/figures/SpeechPipeline.tsx`, `src/pages/work.test.tsx`
- Copy into `public/work/`: from `~/kendo_world/platform/film/out/`: `live-desk.png`, `dojo-desk.png`, `flow-desk.png` (re-encode to webp ≤ 200 KB each); from `~/superworkspace/docs/readme/`: `home-dark.png`, `playbooks-light.png`, `connections-light.png` (webp).

**Interfaces:**
- Consumes: `getWork(slug)`; `<Film/>`.
- Produces: route `/work/:slug`; figures as inline SVG components using tokens only.

- [ ] **Step 1:** `work.test.tsx`: for each slug the page renders the title, every `Num.value` with its `condition`, a "what i did" section, a "limits" section with ≥ 1 item, and a footnote list whose entries match the numbers' sources. Unknown slug renders the 404 component.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Build the page in the spec's order (title + hero + links, numbers strip, how it works with figure, what i did, limits, one closing line + next link). `IpporuChain`: tracker → pose → strike → flag reader → who struck → shinai → ribbon, with "flags + tasuki decide who scored" drawn as the path that ships. `SpeechPipeline`: audio → parakeet 110M encoder → ctc + 4-gram / streaming cache → text; text → magpie 357M → three voices → cpu.
- [ ] **Step 4:** Run → PASS. Look at all four pages in ego at 1280 and 390 px, both themes. Close the page.
- [ ] **Step 5:** Commit `work: four project pages with numbers, figures and limits`.

### Task 5: The ipporu demo

**Files:**
- Create: `scripts/demo-data.mjs`, `scripts/demo-clip.sh`, `src/demo/events.ts`, `src/demo/events.test.ts`, `src/demo/IpporuDemo.tsx`, `src/demo/demo.css`
- Output: `public/demo/all-japan-2024.json`, `public/demo/all-japan-2024.mp4`, `public/demo/all-japan-2024.jpg`

**Interfaces:**
- Consumes: `~/kendo_world/platform/replay/studio/lib.json`, entry `id === "-BctO8XF2Gw"` (All Japan Championships 2024, 1st round; `win: [100, 195]`; `strikes: [t, side 0|1, conf]`; `ips: {t, who, waza, letter}`; `flags: [t, colour]`).
- Produces:
  - `type DemoEvent = { kind: 'strike'|'ippon'|'flag'; t: number /* seconds into the clip */; side?: 'aka'|'shiro'; conf?: number; waza?: string; colour?: string }`
  - `toClipEvents(m: LibMatch): DemoEvent[]`: keeps events inside `win`, shifts `t` by `win[0]`, maps side 0→aka 1→shiro, sorted by `t`.
  - `eventAt(events: DemoEvent[], t: number, tol = 0.5): DemoEvent | undefined`
  - `<IpporuDemo src poster data />`

- [ ] **Step 1:** `events.test.ts` with a fixture `{win:[100,195], strikes:[[99,0,.9],[108.26,0,.83],[154.05,1,.87]], ips:[{t:154.2,who:'shiro',waza:'men',letter:'M'}], flags:[[155,'white']]}`: `toClipEvents` drops t=99, returns strike t≈8.26 aka, strike t≈54.05 shiro, ippon t≈54.2, flag t≈55, in that order; `eventAt(e, 54.1)` is the strike at 54.05; `eventAt(e, 30)` is undefined.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement `events.ts`. `scripts/demo-data.mjs` writes `public/demo/all-japan-2024.json` = `{ title, sub, source: "youtube.com/watch?v=-BctO8XF2Gw", win, events }`. Before writing, grep `~/kendo_world/platform/research/tracking` training manifests for the id and write `seenInTraining: boolean` into the JSON. The page says "held out" or "seen in training" accordingly.
- [ ] **Step 4:** `scripts/demo-clip.sh`: `yt-dlp -f "bv*[height<=720]" --download-sections "*100-195" -o tmp.mp4 https://www.youtube.com/watch?v=-BctO8XF2Gw`, then `ffmpeg -an -c:v libx264 -crf 26 -movflags +faststart`, then a poster at t=8. Check the clip under 10 MB and that player names are not legible in it (blur any name card with `ffmpeg boxblur` over the scoreboard region if they are; look at frames at 0, 30, 60, 90 s).
- [ ] **Step 5:** Build `IpporuDemo`: video, a timeline under it with one marker per event (strike dots sized by `conf`, ippon as the waza letter, flags as small ticks; aka red, shiro white with outline), at least 44 px tall tap rows on phone; click or Enter jumps the video; the current event label updates from `eventAt`; layer toggles "strikes / ippon / flags". The prerendered HTML includes an ordered list of all events with times, so it works without JS and when the video fails (`onerror` shows the poster and keeps the list). No autoplay under reduced motion. Credit line: "footage: all japan kendo championships 2024, public stream. engine output: ipporu."
- [ ] **Step 6:** Run tests → PASS. In ego: click two markers and confirm the video time moves; block the mp4 with `page.cdp('Network.setBlockedURLs', ...)` and confirm the list still shows. Close the page.
- [ ] **Step 7:** Commit `demo: the ipporu engine on all japan 2024, strikes, ippon and flags on a timeline`.

### Task 6: Notes

**Files:**
- Create: `src/content/notes.ts`, `src/content/notes.test.ts`, `content/notes/when-my-labels-fooled-me.md`, `content/notes/ps3-eye-driver-on-apple-silicon.md`, `src/pages/Notes.tsx`, `src/pages/Note.tsx`, `src/pages/notes.css`
- Move: the PS3 Eye post from `_projects/2025-03-04-ps3eye_driver.md`.

**Interfaces:**
- Produces: `type Note = { slug: string; title: string; date: string; summary: string; html: string }`, `export const notes: Note[]` sorted newest first; routes `/notes`, `/notes/:slug`.

- [ ] **Step 1:** `notes.test.ts`: every note has slug, lowercase title, ISO date, summary ≤ 160 chars; slugs unique; no `—`; the labels note contains "57%", "58%", "83" and "E101" and does not contain "74%".
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** `notes.ts` loads `content/notes/*.md` with `import.meta.glob(..., { query: '?raw', eager: true })`, parses `---` front matter (title, date, summary) and renders with `marked`.
- [ ] **Step 4:** Write "when my labels fooled me" (600–900 words) from notebook E81, E89, E93 and E101 in `~/kendo_world/platform/research/tracking/notebook.md`: what was measured, why 76% looked real, the 83 clean flag labels, 57% vs 58% always-aka, what ships instead (flags + tasuki), what is next. Include the E101 table as a Markdown table. Port the PS3 Eye post as is, lowercased title.
- [ ] **Step 5:** Run tests → PASS; run every note paragraph through `voicecheck linkedin -`; fix until it exits 0.
- [ ] **Step 6:** Commit `notes: when my labels fooled me, and the ps3 eye driver`.

### Task 7: CV page and PDFs from one source

**Files:**
- Create: `src/content/cv.ts`, `src/content/cv.test.ts`, `src/pages/Cv.tsx`, `src/pages/cv.css`, `scripts/cv-pdf.mjs`
- Output: `public/cv/madalin-tatarciuc-research.pdf`, `public/cv/madalin-tatarciuc-builder.pdf`
- Source text: `~/cv/cv-research.html`, `~/cv/cv-builder.html` (current, owner-approved content).

**Interfaces:**
- Produces: `type CvVersion = 'research'|'builder'`; `cv: Record<CvVersion, { role: string; summary: string; sections: { heading: string; items: { title: string; when?: string; sub?: string; bullets?: string[] }[] }[] }>`; route `/cv` with a two-option switch (buttons, `aria-pressed`) defaulting to research, and `?v=builder` selecting builder.

- [ ] **Step 1:** `cv.test.ts`: both versions contain "EU citizen", "jackrabbit-110m-ro", "Surogates", "708"; neither contains "Superstar " + "(", "Surogate Ops", "74%"; research contains "57%"; email `madalintat@gmail.com` appears once per version.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Move the content of the two HTML files into `cv.ts` (the CV keeps sentence case: it is a document for recruiters, not the cetusian voice). `Cv.tsx` renders the version; `cv.css` has an `@media print` A4 layout matching `~/cv/cv.css`. Download links for both PDFs.
- [ ] **Step 4:** `scripts/cv-pdf.mjs` runs after prerender: serves `dist/`, prints `/cv/?v=research&print=1` and `/cv/?v=builder&print=1` with Chrome headless `--no-pdf-header-footer` into `public/cv/` and `dist/cv/`, then asserts each PDF has exactly 1 page.
- [ ] **Step 5:** Run tests → PASS; `node scripts/cv-pdf.mjs` → two 1-page PDFs. Copy them over `~/cv/Madalin-Tatarciuc-CV-*.pdf` so the owner's copies match.
- [ ] **Step 6:** Commit `cv: one source for the page and both pdfs`.

### Task 8: Prerender, meta, 404, sitemap

**Files:**
- Create: `src/entry-server.tsx`, `scripts/prerender.mjs`, `scripts/prerender.test.mjs`, `src/pages/NotFound.tsx`

**Interfaces:**
- Consumes: routes from Tasks 3–7.
- Produces: `dist/<route>/index.html` for `/`, `/work/<4 slugs>`, `/notes`, `/notes/<each slug>`, `/cv`; `dist/404.html`; `dist/sitemap.xml`; per page `<title>`, description, `og:title`, `og:description`, `og:image`.

- [ ] **Step 1:** `prerender.test.mjs` (runs on `dist/` after build): each route file exists; each contains its `h1` text in the raw HTML (no JS needed); `work/ipporu/index.html` contains the demo's event list; titles are unique; `404.html` exists; the sitemap lists every route.
- [ ] **Step 2:** `npm run build && npx vitest run scripts` → FAIL.
- [ ] **Step 3:** SSR build (`vite build --ssr src/entry-server.tsx`) rendering each route with `StaticRouter` into the client `index.html` template; hydrate with `hydrateRoot` in `main.tsx`.
- [ ] **Step 4:** Run → PASS. Serve `dist/` with `npx serve dist`, open `/work/ipporu` and `/work/ipporu/` directly in ego, refresh: both render. Close the page.
- [ ] **Step 5:** Commit `build: every route prerendered, with meta, 404 and sitemap`.

### Task 9: The checks, and the owner's look

**Files:**
- Create: `rules/check.mjs`, `rules/links.mjs`, `rules/copy.mjs`, `rules/sweep.mjs`

**Interfaces:**
- Consumes: `dist/`, `src/content/*`.
- Produces: `npm run check` exits 0 only when all pass.

- [ ] **Step 1:** `rules/copy.mjs` extracts visible text from every `dist/**/index.html` except `/cv`, splits it into blocks, and pipes each block to `~/cetusian/social/tools/voicecheck linkedin -`; it also runs `python3 ~/real-design-no-stupidass-slop/skills/slop-audit/scripts/check.py` on the same text. `rules/links.mjs` checks every internal link resolves in `dist/` and every external link answers < 400 (HEAD, then GET). `rules/check.mjs` runs: css-tokens, `node ~/real-design-no-stupidass-slop/skills/slop-audit/scripts/uislop-scan.mjs src --strict`, copy, links, `vitest run`.
- [ ] **Step 2:** `npm run check`; fix every finding or add a `deslop-ignore` with a reason.
- [ ] **Step 3:** `rules/sweep.mjs` drives ego-browser (one task space, one page, reused): every route at 390, 820, 1280 and 1600 px in light and dark (emulated media). It writes screenshots to `docs/sweep/` and asserts: no `scrollWidth > clientWidth`; home `scrollHeight <= 800` at 1280×800; one primary-styled element per screen; every tap target ≥ 44 px at 390. It finishes the space with `keep: []`.
- [ ] **Step 4:** Look at every screenshot. Write the blunt list in `docs/sweep/notes.md`, fix it, re-run sweep.
- [ ] **Step 5:** Lighthouse (`npx lighthouse` with `--chrome-flags=--headless`) on `/` and `/work/ipporu`: performance and accessibility ≥ 95.
- [ ] **Step 6:** Commit `checks: tokens, slop, voice, links, sources and the sweep`.

### Task 10: Deploy prep, then stop

**Files:**
- Create: `.github/workflows/pages.yml`, `README.md`

- [ ] **Step 1:** `pages.yml`: on push to `main`, Node 24, `npm ci`, `npm run build`, `npm run check` (skipping the ego sweep and voicecheck in CI, which need the owner's machine), upload `dist/` with `actions/upload-pages-artifact`, deploy with `actions/deploy-pages`.
- [ ] **Step 2:** README: what the site is, `npm run dev|build|check`, where content and sources live.
- [ ] **Step 3:** Commit `deploy: pages workflow and readme`. Push the branch `redesign-2026-11` only after the owner says so.
- [ ] **Step 4:** Report to the owner with screenshots of home, ipporu and cv at desk and phone in both themes, the check output, and the open question: "deploy? this switches pages to github actions and replaces the jekyll site."
