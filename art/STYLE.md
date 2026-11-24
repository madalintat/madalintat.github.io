# the sea's style

One style for every plate and every character on the site. It is the same family as Superstarling's
(`~/superworkspace/catalogue/characters/STYLE.md`), so the two read as made by one hand, moved from a city street
to the open sea. A character's own brief (`<name>.md`) says who it is; this file says how everything is drawn.

## Line and shape
- A flat screen print, like a mid-century travel poster redrawn today: crisp flat shapes, no outlines.
- Two tones per colour, a lit tone and one shadow tone. Depth comes from layered flat silhouettes and haze, not
  gradients. The one allowed gradient is the sky and the water column itself, banded in three to five flat steps.
- A very fine paper grain over the whole print, never a halftone pattern.
- Not a cartoon, not anime, not 3D, not a photo.

## Light
- Above the water: one key light from the upper left, a low dusk sun. A thin warm rim on left edges, cool slate
  shadow on the right.
- Under the water: light comes from the surface, in a few flat shafts slanting down from upper left. It fades with
  depth; below about a thousand metres the only light is bioluminescence (`--glow`) and the one accent.

## Palette

| Use | Token | Hex |
|---|---|---|
| Darkest shapes, the abyss | `--print` | #111318 |
| Night, far ships, deep water | `--slate` | #2B3140 |
| Mid greys | `--floor` | #454C5C |
| Hulls, rock, whale backs | `--street` | #6E7483 |
| Sand, dusk haze | `--warm` | #CFC8BC |
| Foam, sails, light sky | `--stone` | #E3DED6 |
| The brightest light, paper | `--paper` | #F7F5F0 |
| Shallow sea | `--sea` | #2E5E6E |
| Mid sea | `--mid` | #1B3A48 |
| Deep sea | `--deep` | #0C1A23 |
| Bioluminescence, used sparingly | `--glow` | #8FE3D2 |
| Lit windows, lanterns, the sun's core | `--lamp` | #FFD7A8 |
| The one accent: the sun, a ship's lamp, a red tasuki | `--aka` | #E0563A |

The accent appears once or twice per plate, never as a field.

## Every plate
- No text, letters, numbers, logos or flags with symbols. Screens are dark and blank.
- No painted birds: the starlings are a live flock drawn in code over the plates.
- No people with visible faces: figures are seen from behind or in silhouette.
- No fish that look like cartoons: whales and creatures are drawn with real anatomy, simplified to flat shapes.
- Wide plates are 16:9; phone plates are 9:16, composed again, not cropped.
- Leave the upper left third calm (sky or open water) where the headline sits.

## Cut-outs
Anything that moves (ships, whales, creatures, the bathysphere) is drawn alone on flat chroma green (#00FF00), keyed
out to a transparent PNG, and laid over an empty background plate, so it can move on its own layer.

## Making more
Model: `google/gemini-nano-banana-2.1` on OpenRouter, about $0.04 an image. Prompt with this file's rules plus the
plate or character brief word for word. Once a plate is kept, it is the reference for every later plate, so the
whole sea stays one world. Log every image, rejects included, in `SPEND.md`. Budget: $10 for the site.
