#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="../../cosmetic.user.js"

# Single self-contained userscript: ALL rules are inline, so every page is
# injected with its matched CSS immediately at document-start, with no network
# dependency at runtime.
go run main.go -input "filter-lists.txt" -output "$SCRIPT_PATH"