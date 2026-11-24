---
title: when my labels fooled me
date: 2026-11-24
summary: who struck read 76% for weeks. clean labels from the referees' flags put it at 57%, a point under always guessing aka.
draft: true
---

ipporu reads a kendo match from video. at every strike it has to say who struck, aka or shiro. the referees raise flags only for the strikes they score, so for everything else a model has to decide.

## the number i liked

in e81 i put v-jepa 2 on each kendoka's crop, 32 frames around the strike, and trained a small logistic head on 196 strikes over 43 matches. it got 144 of 196, 73%. three earlier tries (motion, the shinai, a still dinov2 look) had all stopped near 65%, and the learning curve was still climbing with more labels.

in e93 i re-tracked all 43 matches on a better tracker, to see if bad boxes were holding it back. no change: 146 of 194 on the old tracks, 141 of 185 on the new ones. the spread between settings was bigger than the difference between trackers. who struck sat at about 76%.

## the first warning

e83 added labels from the flags on untracked matches: every ippon the flags called, the side from the tasuki. 144 went to 150. then e89 checked those labels by eye, one crop a second before the flags rose. 6 of 22 were wrong or pointed at someone who wasn't fighting: a referee, an official, a spectator. with only the 12 clean ones the gain went away.

i read that as "flag labels are noisy" and kept the 76%.

## clean labels

e101 asked it the other way round. the flags say who scored and when. the tasuki says which box is aka. the engine finds the strike just before the flags. so every ippon can be a label nobody marked, as long as the tracking round that moment holds.

i ran the flag reader over all 169 scanned matches (222 calls), cut a 20 second window round each call and ran the engine on that window only. a pair check drops windows where one box sits on someone seated. 83 labels were left. 20 random ones by eye: 16 right, 3 right with half-hidden crops, 1 late.

then the same model, trained and tested one match out:

| train on | agent labels (155) | e73 (12) | e101 flags (83) |
|---|---|---|---|
| agent + e73 | 119 | 10 | 47 |
| flags only | 107 | 8 | 41 |
| all | 126 | 7 | 55 |
| always aka | | | 48 |

on the 83 flag labels the model gets 47, 57%. always saying aka gets 48, 58%.

the 76% was real on the labels it was measured on. those were marked on short strips by agents, and the model learned whatever made them easy to mark. on labels that came from the referees it is at chance.

## what else i tried on the 83

- who moved in more over the last half second, from the tracker boxes: 48 to 49 of about 80.
- rules on the shinai tip, from a distilled tip model: whose tip reaches the other's upper body 35 of 68, nearest the other's men 48 of 83, highest above the head 36 of 83, fastest over the last half second 57 of 83.

tip speed is the best single reading at 69%, and it is real (chance on this set is 41.5 ± 4.5). the gate is 85%. on 170 fresh labels in e105 it came out at 65%.

## what ships instead

for ippon, the side doesn't come from a model. it comes from the flags and the tasuki, and the strike is the one just before the flags. against the record, 177 matches agree on ippon count and side.

the who-struck model is only needed for strikes that don't score. in the app those stay marked as unsure.

## what changed in how i work

a number gets tested on labels from a source the model can't see before i believe it. for kendo that source is the referees. the flag pass cost about $7.5 and each window $0.14, so a clean test set costs less than a wrong week.
