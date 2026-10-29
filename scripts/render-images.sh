#!/bin/sh
# Renders the social sharing image and favicons from the HTML sources in scripts/
# using a local Google Chrome (macOS path by default; override with CHROME=...).
set -eu

cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

render() {
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=8000 --window-size="$2" --screenshot="$3" "file://$PWD/scripts/$1" \
    >/dev/null 2>&1
}

mkdir -p public
render og-image.html 1200,630 public/og-image.png
render favicon.html 512,512 /tmp/rshibak-favicon-512.png
sips -z 180 180 /tmp/rshibak-favicon-512.png --out public/apple-touch-icon.png >/dev/null
sips -z 64 64 /tmp/rshibak-favicon-512.png --out public/favicon.png >/dev/null
rm -f /tmp/rshibak-favicon-512.png

echo "Wrote public/og-image.png, public/favicon.png, public/apple-touch-icon.png"
