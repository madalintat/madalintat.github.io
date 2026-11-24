# the sea: madalintat.github.io, rebuilt at superstarling's level

Status: draft for the owner's approval, 2026-11-24. Replaces "the world" (2026-11-24-personal-site-v2-design.md), which the owner judged "totally sucks": abstract dots on black, small fact lists, nothing big happening.

## Why

Land remote, well-paid applied-AI work. A recruiter must read name, role, cv and email in the first second. Someone curious must come away knowing exactly what each model does, one by one, then all together, with real numbers and things to play. The site must feel like a game and be as crafted as the new Superstarling site (`~/superworkspace/apps/site`).

## What makes Superstarling good (studied 2026-11-24, desk and phone, code and process)

Process, in order:
1. A brand doc first: what is banned (eyebrow labels, card grids, dashes, middle dots), motion only where something changes.
2. A design spec per big idea with an art budget ($3 cap, about $0.04 an image) and the options it rejected.
3. A character bible before any scene: `catalogue/characters/STYLE.md`. One style (flat mid-century screen print, no outlines, two tones per colour, key light from the upper left, an orange rim on left edges, slate shadow right, fine paper grain, only the site's colour tokens, one height chart). Each character has a written brief: outfit, signature object, a Never list.
4. Generation with `google/gemini-nano-banana-2.1` on OpenRouter. The prompt is STYLE.md plus the brief, with the character's front cut-out as the reference. Cut-outs are drawn on chroma green and keyed out.
5. Every image is logged with its cost, rejects included, with the reason (`SPEND.md`: 151 requests, 109 kept, $6.09).
6. Review commits fix the art against the bible: one true scale, the bird on the right shoulder.
7. Rules as code before every build: token colours only, 4.5:1 contrast, banned words, no dead links, no emoji.

Craft:
- **One world on one scale, read by a camera.** Nine scene plates laid end to end, a person 58 units tall, four parallax layers (clouds ×0.12, far roofs ×0.35, street ×1, kerb ×1.28), sky plates crossfading per scene, a moon that becomes the sun.
- **A beat grammar.** A pinned story is counted in beats. Any element carries `data-at` / `data-to`; between them it types, counts up or runs `--t`. Scroll drives only the camera. Cards play on a clock at each stop, so a fast flick can't make them unreadable.
- **One by one, then together** (how-it-works): one window holds every part, each beat frames one part (`data-shot`), then pairs (`plan+desks`), then the whole. Hand-offs show as a face flying from one card to the next.
- **Characters carry the story.** Sprite sheets: walk cycles follow the scroll, crew members turn and wave as she passes, and the same faces sit on every card.
- **The product is rebuilt in HTML, not screenshots or video,** so it stays sharp at any size, accessible and still under reduced motion.
- **The phone has its own layout.** Under 900 px each stop becomes a still with a slight pan, picture then sentence then card, with one fixed button.
- **Performance budget:** largest picture under 250 KB, page under 1.5 MB to start, webp at 720 px and full size, the rest loads at idle, one rAF loop only while visible, 60 fps.
- **Palette:** print inks (#111318 print, #2B3140 slate, #F7F5F0 paper, #E0663A orange as the one accent), Inter only, four sizes, headings 600 at −0.04em.

What the research on other sites adds (Messenger, Igloo Inc, neal.fun The Deep Sea, Ellusion, Bijenkorf):
- Visuals take 85–90% of the screen, about 12 words per beat.
- One big moment per scene.
- Scroll maps to something real: depth in metres.
- Sound is off by default; when on, it's rich.
- Portrait art is drawn separately for phones.
- The proof is a live demo, not a claim.

## The world: sky to the sea floor

One vertical world with a real depth meter. Each stop is one beat or a short pinned story.

| depth | scene | what it shows |
|---|---|---|
| +3000 m | sky at dusk, a starling murmuration | hero: name, one line, cv and email, all readable at once |
| +40 m | ships on the horizon, a small fleet | surogates: each ship is a part of the runtime (calls, simulate, channels), signal lights pass messages |
| 0 m | seaside town, a dojo on the shore | ipporu: the story of the kendo engine (below) |
| −50 m | under the surface, light rays | the dive: the camera passes the surface line |
| −1000 m | whales | romanian speech (below) |
| −4000 m | the deep, bioluminescent | superstarling: a lit workspace in the dark, the crew working |
| −8000 m | trench walls, sediment layers e1 … e105 | the notebook; e101 glows: "the labels that fooled me" |
| −10 994 m | the floor, a beacon | contact: email, cv, github, huggingface |

(Superstarling moves from the sky to the deep because the sky now carries the hero. To decide at the style test: whether the murmuration should still spell out superstarling at the top.)

### ipporu, one model at a time, then all together

A pinned story at the dojo. One window: the real match clip, with an engine panel beside it. Beats:
1. **tracker.** Boxes follow both fighters. "keeps each fighter, 0 swaps on 7 test matches".
2. **aka / shiro.** The tasuki colour names each box.
3. **flags.** The referees' flags light up. "reads the flags, 99 of 103 calls".
4. **strike.** A strike mark pulses at the moment. "finds the strike, 152 of 182".
5. **ippon.** The flags and the strike just before them. "177 matches agree with the record".
6. **who struck.** Marked honestly as not solved: 57%, link to the note.
7. **together.** The whole match plays with every model's marks on it and the event list filling in.

### Romanian speech, the same pattern

A pinned story with the whales:
1. **asr.** A Romanian sentence plays and the transcript types under it. "5.69% wer on fleurs, on a cpu".
2. **streaming.** The same sentence fed live in 32 ms packets: words appear as it speaks, then settle. "7.03%, final text 0.72 s after you stop".
3. **voices.** Three whales sing: doina, tudor, radu. Tap one and it speaks. "one checkpoint, 2.02% wer, no pytorch".
4. **together.** Speech in, text, a reply spoken back: the loop surogates phone calls run on.

## Characters

- **The diver.** You, never a face, in silhouette or from behind. The same figure stands in the dojo in bogu, then descends. (Decided at the style test: the diver, a kendoka, or both.)
- **Three whales.** Doina, tudor and radu, each with its own markings, carrying the voices.
- **Models as creatures or machines** in the engine scenes, each with a signature object. They are labelled, not named people.

Each character gets a written brief, a front cut-out used as the reference, and a Never list, the same as Superstarling's crew.

## Look

- **Palette:** a dusk sky that cools to sea blues and ends near black, with bioluminescent highlights and one accent. The accent is kendo red or Superstarling's orange, decided at the style test.
- **Style:** flat mid-century screen print, matching Superstarling's family so the two sites look related.
- **Type:** Inter, lowercase in the cetusian voice. The cv stays in sentence case.

## Process and budget

- `art/STYLE.md` and a `art/<character>.md` brief for each character, in the repo. Prompts and references are versioned. `art/SPEND.md` logs every image, rejects included.
- Model: `google/gemini-nano-banana-2.1` on OpenRouter, about $0.04 an image. The cap is **$10 for the whole site** and is raised only with the owner's yes.
- **Style test first: three plates** (sky with ships, whales, the deep). The owner judges these before any build.
- Rules in code are kept and extended: tokens, contrast, slop words, voicecheck, links. Each phone scene is checked at 390 px.

## Keeps from the current build

Prerender, the project pages, notes, the cv with its pdfs, the ipporu demo data (`public/demo`), the voices, checks and the pages workflow. **Not deployed without the owner's go.**

## Anti-goals

- Abstract shapes instead of art.
- Fact lists.
- Anything that hides who you are and how to reach you.
- Fake ui screenshots.
- Pages that jump around.
- More than about 12 words per beat on the home page.
