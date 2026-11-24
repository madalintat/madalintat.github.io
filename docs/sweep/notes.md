# sweep, 2026-11-24

`npm run build && npx vite preview --port 4179`, then `npm run sweep` (ego space 8): 9 routes at 390, 820, 1280, 1600.
Assertions: no sideways scroll, no button under 40 px on a phone. Screenshots in this folder (not committed).

Found by looking, and fixed:
- note titles rendered grey: demo.css `.note` (the "video did not load" line) also styled the note article. renamed `.demo-note`.
- the flock flew over the sky tag line on a phone. the flock now sits above the copy on narrow screens.
- the project chain figures were boxed in red (v1's cyan, recoloured). now a quiet left mark on the steps that ship.
- the chain's ↓ arrows sat on the step numbers on a phone. centred.
- earlier in the build: the gauge's `.bar` collided with the header `.bar` (grey block); the home `.chain` took the project figure's boxes; the drill core collapsed to zero width; superstarling's eight facts overflowed 800 px. all fixed before this sweep.

Lighthouse, mobile, simulated slow 4g (`npx lighthouse@12`):
- `/`: performance 93–94, accessibility 100, best practices 100, seo 100.
- `/work/ipporu/`: performance 93, accessibility 100.
- what moved it: the flock went from every bird checking every bird to a 40 px grid (blocking time 2,060 → 80–180 ms); the world starts when the page is idle; inter and jetbrains mono are preloaded.
- what is left: the h1 repaints when inter (latin-ext, for the ă) lands, about 3.0 s on slow 4g. font-display optional would fix the number and show a system font on first visits.
