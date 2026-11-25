#!/bin/sh
# art/no-shinai.sh: while I film I have put the shinai away. The me-record clip has it on the floor right of my feet
# (x 323-412, y 250-280 of each 539x300 frame, 8 frames to a row): that strip is cleared in every frame of the sheet.
# Run after node art/sprites.mjs me-record, then that sheet's ?v= hash in src/content/sprites.json is refreshed.
set -e
F=public/sea/me-record.webp
DRAW=""
for r in 0 1 2 3 4; do for c in 0 1 2 3 4 5 6 7; do
  x=$((c * 539 + 323)); y=$((r * 300 + 250)); DRAW="$DRAW rectangle $x,$y $((x + 89)),$((y + 30))"
done; done
magick "$F" \( +clone -alpha transparent -fill white -draw "$DRAW" \) -compose DstOut -composite -quality 82 "$F"
node -e '
const fs=require("fs"),c=require("crypto"),p="src/content/sprites.json",all=JSON.parse(fs.readFileSync(p));
all["me-record"].src="/sea/me-record.webp?v="+c.createHash("sha1").update(fs.readFileSync("public/sea/me-record.webp")).digest("hex").slice(0,8);
fs.writeFileSync(p,JSON.stringify(all,null,2)+"\n")'
