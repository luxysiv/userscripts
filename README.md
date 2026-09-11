# Status
[![Tạo userscripts](https://github.com/luxysiv/userscripts/actions/workflows/auto-generate.yml/badge.svg)](https://github.com/luxysiv/userscripts/actions/workflows/auto-generate.yml)

# About
Copycat and edit from [xarantolus/bromite-userscripts](https://github.com/xarantolus/bromite-userscripts)

# How it works
A pipeline (`generate/cosmetic`) downloads cosmetic rules from filter lists
(EasyList, ABPVN), validates, de-duplicates and combines them into a
"Cosmetic Ad Block" userscript that hides annoying elements via injected CSS.

## Build modes
- **Lazy load (default)**: `cosmetic.user.js` is a small shell with an inline
  baseline covering the top 1.000 domains (plus general rules), which are
  hidden immediately at `document-start`. The full ruleset lives in
  `cosmetic.rules.json` (the runtime bundle) and is fetched once per day,
  cached in `localStorage`, and applied as an upgrade on top of the baseline.
- **Single-file (legacy)**: `-no-lazy`-like build — replace the `main.go`
  invocation in `generate/cosmetic/generate.sh` with the commented-out
  single-file alternative. All rules are embedded inline; no network
  dependency at runtime, but the userscript is the full bundle size.

### Runtime bundle
The lazy shell fetches rules from
`https://raw.githubusercontent.com/luxysiv/userscripts/main/cosmetic.rules.json`
(served with `Access-Control-Allow-Origin: *`, so `fetch` works under
`@grant none`). To shrink the daily download further, serve that file through
the Cloudflare Worker pre-compressed (gzip) — browsers transparently
decompress it before `response.json()`.

Run the generator manually for testing:
```bash
cd generate/cosmetic
bash generate.sh   # writes ../../cosmetic.user.js + ../../cosmetic.rules.json
```

# Thanks for [@xarantolus](https://github.com/xarantolus)