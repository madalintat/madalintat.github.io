# madalintat.github.io v2: cinematic + proof

Supersedes the *look* and *home layout* of `2026-11-24-personal-site-design.md`. Everything not named here
(content rules, verified numbers, Invergent public-only, no inflated claims, checks, no deploy without the owner's go)
still holds from v1.

## Why the change (owner, 2026-11-24)

The v1 look (IBM Plex Mono, cyan, lowercase list) read as a plain terminal page. The owner wants the coolest site he
can have, built the way Superstarling's site was built: illustrated, scrolling, superb on a phone. The research
(14 exemplar sites, hiring posts from ElevenLabs and Hugging Face, Chip Huyen, Eugene Yan, an HN thread) says what wins
interviews is checkable proof: numbers, demos, eval method, repos, an obvious CV and contact. A flashy template with
nothing behind it "reads as junior". So: the Superstarling look as the frame, proof inside the first screen.

## Decided by the owner

- Direction **cinematic + proof** (chosen over full scene-per-project storytelling and over a plain researcher list).
- The old Jekyll / cetusian site is removed entirely from the repo (`_projects`, `_layouts`, `images`, `contact.html`,
  old `index.html` content, `_config.yml`, the PS3 post moves into the new notes).
- **Email in the header** (mailto). Overrides v1's "email only in the CV".
- **Voice samples**: the three public samples from `surogate/amami-357m-ro/samples/{doina,tudor,radu}.wav`, served as
  small mp3/opus files with a credit and the model card link. No live model.
- Scrolling page is fine here (his no-scroll rule is for apps, not this site).

## The look

- Superstarling's system: Inter Variable display headlines (large, tight, sentence case), Inter body, a mono only for
  numbers and code; dark slate night palette with cream ink and **one accent** (kendo aka red, `--aka`), light theme
  as a cream paper version.
- Sentence case replaces v1's all-lowercase. Brand names keep their caps.
- One original illustrated hero: a dojo at night in Superstarling's print style (ink, slate, cream, one red accent,
  no real people, no readable names). Made with an OpenRouter image model, one fixed style preamble, **hard budget $2**.
  Two more small spot illustrations at most (speech, workspace), same preamble, same budget.
- Motion: one gentle hero parallax and reveal-on-scroll, all off under `prefers-reduced-motion`. No scroll-jacking,
  no WebGL.

## The home page (one scroll, top to bottom)

1. **Header**: name, work · notes · cv · email · GitHub · Hugging Face. Sticky, thin.
2. **Hero** over the dojo illustration: "I build AI models and ship them." plus one line (applied AI researcher at
   Invergent; competes for Romania's national kendo team). **Proof strip in the first screen**: 5.00% WER · 152/182
   strikes · 99 logged experiments · 3 voices on a CPU, each linking to its source.
3. **ipporu**: full-width section, the match demo (All Japan 2024) inline, the chain figure, the honest who-struck
   number, link to the project page.
4. **Romanian speech**: numbers with test sets named, the pipeline, **three voice players**, model card links.
5. **Superstarling**: the product screenshots, what it is, the numbers.
6. **Surogates**: the runtime contribution, short.
7. **How I measure** strip: the 99-experiment log and the "labels fooled me" note as the proof of method.
8. **Notes** feed (dated) and **CV** (research / builder) with PDF links.
9. Footer: email, profiles.

Project pages, notes pages and the CV page keep v1's routes and content, restyled.

## Checks (in addition to v1's)

- Home first screen at 390×844 and 1280×800 shows the headline and the proof strip.
- Lighthouse ≥ 95 performance on mobile; hero image ≤ 250 KB (AVIF/JPEG), voice files ≤ 150 KB each.
- Every number on the page has a source; the slop scan and voicecheck still pass.

## Left to the builder

Exact image model within the budget, prompt wording, crops, section spacing, reveal timings.
