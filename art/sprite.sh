#!/bin/zsh
# art/sprite.sh <clip.mp4> <out-name> [height=320] [fps=12]
# A clip on chroma green → public/sea/<out-name>.webp, a sheet of its frames, 8 to a row, keyed and cropped to where the
# figure moves (the box every frame shares, so the figure never jumps), and art/scratch/<out-name>-preview.webp,
# the same frames playing over the deep-water plate, for review. Prints "frames cell-w cell-h".
set -e
clip=$1; name=$2; h=${3:-320}; fps=${4:-12}
tmp=$(mktemp -d)
# the clip's own green, read off a corner, and its frames keyed: 8 px off every edge (video models draw a line there)
green=$(ffmpeg -v error -ss 0.5 -i "$clip" -frames:v 1 -f image2pipe -vcodec png - | magick - -crop 40x40+12+12 -resize 1x1! -format '%[hex:p{0,0}]' info:)
ffmpeg -v error -i "$clip" -vf "crop=iw-16:ih-16:8:8,fps=$fps,colorkey=0x$green:0.28:0.06,despill=type=green,format=rgba" "$tmp/f%03d.png"
n=$(ls "$tmp"/f*.png | wc -l | tr -d ' ')
# the box all frames share
box=${BOX:-$(magick "$tmp"/f*.png -alpha extract -evaluate-sequence max -threshold 12% -format "%@" info:)}
magick "$tmp"/f*.png -crop "$box" +repage -resize "x$h" "$tmp/c%03d.png"
size=$(magick identify -format '%w %h' "$tmp/c000.png")
montage "$tmp"/c*.png -tile 8x -geometry +0+0 -background none -quality 76 -define webp:alpha-quality=80 -define webp:method=6 "public/sea/$name.webp"
magick -delay $((100 / fps)) "$tmp"/c*.png -background '#1B3A48' -alpha remove -loop 0 -quality 80 "art/scratch/$name-preview.webp"
echo "$n $size  public/sea/$name.webp $(du -k "public/sea/$name.webp" | cut -f1)K  box $box"
rm -r "$tmp"
