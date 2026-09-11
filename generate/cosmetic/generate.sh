#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="../../cosmetic.user.js"

# Default build: single self-contained userscript with ALL rules inline.
# Every page is injected with its matched CSS immediately at document-start,
# with no network dependency at runtime.
go run main.go -input "filter-lists.txt" -output "$SCRIPT_PATH"

# Optional: lazy-load build = tiny shell script + separate JSON rules bundle.
# The shell bakes a top-N domain baseline and fetches the full bundle once a
# day, caching it in localStorage. Requires the top-1M domain list.
#
# wget -q "http://s3-us-west-1.amazonaws.com/umbrella-static/top-1m.csv.zip" -O "top1m.zip"
# if unzip -o "top1m.zip" -d "top1m" 2>/dev/null; then
#     :
# elif python3 -c "import zipfile; zipfile.ZipFile('top1m.zip').extractall('top1m')" 2>/dev/null; then
#     :
# else
#     busybox unzip -o "top1m.zip" -d "top1m"
# fi
# go run main.go \
#     -input "filter-lists.txt" \
#     -output "$SCRIPT_PATH" \
#     -top "top1m/top-1m.csv" \
#     -lazy \
#     -lazyRulesURL "https://raw.githubusercontent.com/luxysiv/userscripts/main/cosmetic.rules.json" \
#     -bundlePath "../../cosmetic.rules.json"