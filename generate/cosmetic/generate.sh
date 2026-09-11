#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="../../cosmetic.user.js"
BUNDLE_PATH="../../cosmetic.rules.json"
TOP1M_CSV="top1m/top-1m.csv"

# Download top 1M domains. Needed for the offline baseline baked into the
# lazy-load shell (rules for the most popular sites are always available,
# even before the full bundle is fetched).
wget -q "http://s3-us-west-1.amazonaws.com/umbrella-static/top-1m.csv.zip" -O "top1m.zip"
if unzip -o "top1m.zip" -d "top1m" 2>/dev/null; then
    :
elif python3 -c "import zipfile; zipfile.ZipFile('top1m.zip').extractall('top1m')" 2>/dev/null; then
    :
else
    busybox unzip -o "top1m.zip" -d "top1m"
fi

# Default: lazy-load build = tiny shell script + separate JSON rules bundle.
# The shell fetches the bundle once a day, caches it in localStorage and keeps
# an inline baseline for the top N domains as a fallback.
go run main.go \
    -input "filter-lists.txt" \
    -output "$SCRIPT_PATH" \
    -top "$TOP1M_CSV" \
    -lazy \
    -lazyRulesURL "https://raw.githubusercontent.com/luxysiv/userscripts/main/cosmetic.rules.json" \
    -bundlePath "$BUNDLE_PATH"

# Alternative without lazy loading: a single self-contained userscript
# containing all rules inline (larger file, no network dependency at runtime).
# go run main.go -input "filter-lists.txt" -output "$SCRIPT_PATH" -bundlePath "$BUNDLE_PATH"