#!/bin/sh
# Contact sheet of a clip or film: 6 frames across its length -> film/out/sheets/<name>.jpg (for review).
# Usage: sh film/sheet.sh film/out/clips/hook.mp4 [cols]
F="${FFMPEG:-ffmpeg}"; P="${FFPROBE:-ffprobe}"
in="$1"; cols="${2:-3}"; name=$(basename "$in" .mp4)
mkdir -p film/out/sheets
d=$("$P" -v error -show_entries format=duration -of csv=p=0 "$in")
rate=$(echo "$d" | awk '{printf "%f", 6/$1}')
"$F" -y -v error -i "$in" -vf "fps=$rate,scale=640:-1,tile=${cols}x2" -frames:v 1 "film/out/sheets/$name.jpg"
echo "film/out/sheets/$name.jpg ($d s)"
