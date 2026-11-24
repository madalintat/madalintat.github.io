#!/bin/zsh
# art/key.sh <in.png> <out-prefix> [min-area]
# Keys a chroma-green sheet to transparency, pulls the green fringe out of the edges, and writes one trimmed webp per
# object (<out-prefix>-1.webp …), largest first. A single-object sheet gives <out-prefix>-1.webp.
set -e
in=$1; out=$2; min=${3:-4000}
tmp=$(mktemp -d)
# alpha from how much green beats the other two channels; then the green spill on the edges is pulled down to them
magick "$in" \( +clone -fx "g-max(r,b)" -level 6%,30% -negate \) -alpha off -compose copy_opacity -composite \
  -channel G -fx "min(g,max(r,b)+0.02)" +channel "$tmp/keyed.png"
# one box per object, from the opaque pixels
magick "$tmp/keyed.png" -alpha extract -threshold 50% -morphology Dilate Disk:6 \
  -define connected-components:verbose=true -define connected-components:area-threshold=$min \
  -connected-components 8 null: | awk 'NR>1 && $NF ~ /255/ {print $2, $4}' | sort -k2 -nr > "$tmp/boxes"
n=0
while read box area; do
  n=$((n+1))
  magick "$tmp/keyed.png" -crop "$box" +repage -trim +repage -quality 88 -define webp:alpha-quality=95 "$out-$n.webp"
  echo "$out-$n.webp $(magick identify -format '%wx%h' "$out-$n.webp")"
done < "$tmp/boxes"
rm -r "$tmp"
