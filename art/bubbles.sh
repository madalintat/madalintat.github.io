#!/bin/sh
# art/bubbles.sh: the bubble cloud I change pose in, cut from the dive into scuba (public/sea/me-dive-to-me-scuba.webp,
# 8 frames of 539x300 to a row). Frames 23-37 are bubbles only: gathering is 31 back to 24, the cloud thickest at 23
# (the pose swaps under it), then it clears 24 to 37. Frame 0 is empty, which is what the sprite rests on between changes.
# The kendo chain clips it replaced are kept out of the build in art/scratch/retired.
set -e
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
magick public/sea/me-dive-to-me-scuba.webp -crop 539x300 +repage "$T/f-%02d.png"
magick -size 539x300 xc:none "$T/blank.png"
L="$T/blank.png"
for i in 31 30 29 28 27 26 25 24 23 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37; do L="$L $T/f-$i.png"; done
# shellcheck disable=SC2086
magick montage $L -background none -tile 8x -geometry 539x300+0+0 -define webp:alpha-quality=90 -quality 60 public/sea/bubbles.webp
# /sea is cached for a week: the sheet's line in sprites.json gets its new hash
node -e '
const fs=require("fs"),c=require("crypto"),p="src/content/sprites.json",all=JSON.parse(fs.readFileSync(p));
all.bubbles={src:"/sea/bubbles.webp?v="+c.createHash("sha1").update(fs.readFileSync("public/sea/bubbles.webp")).digest("hex").slice(0,8),n:25,w:539,h:300,fps:16};
fs.writeFileSync(p,JSON.stringify(Object.fromEntries(Object.entries(all).sort()),null,2)+"\n")'
