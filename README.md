# Status
[![Tạo userscripts](https://github.com/luxysiv/userscripts/actions/workflows/auto-generate.yml/badge.svg)](https://github.com/luxysiv/userscripts/actions/workflows/auto-generate.yml)

# About
Copycat and edit from [xarantolus/bromite-userscripts](https://github.com/xarantolus/bromite-userscripts)

# How it works
A pipeline (`generate/cosmetic`) downloads cosmetic rules from filter lists
(EasyList, ABPVN), validates, de-duplicates and combines them into a
"Cosmetic Ad Block" userscript that hides annoying elements via injected CSS.

## Build modes
- **Single-file (default)**: `cosmetic.user.js` embeds ALL rules inline. Every
  visited page is injected with its matched CSS immediately at
  `document-start` — no network dependency, works offline. Two `<style>` tags
  per page: one with the **common** general rules (`*##...`), one with the
  **site's own** rules for the visited domain.
- **Lazy load (optional)**: uncomment the lazy block in
  `generate/cosmetic/generate.sh`. It produces a small shell
  (`cosmetic.user.js`) with a top-N domain baseline plus a separate JSON rules
  bundle (`cosmetic.rules.json`) that the shell fetches once per day and
  caches in `localStorage`. Rare domains get their rules ~a second after a
  first fetch instead of instantly.

### Runtime bundle (lazy mode only)
The lazy shell fetches rules from
`https://raw.githubusercontent.com/luxysiv/userscripts/main/cosmetic.rules.json`
(served with `Access-Control-Allow-Origin: *`, so `fetch` works under
`@grant none`). To shrink the daily download further, serve that file through
the Cloudflare Worker pre-compressed (gzip) — browsers transparently
decompress it before `response.json()`.

Run the generator manually for testing:
```bash
cd generate/cosmetic
bash generate.sh   # writes ../../cosmetic.user.js
```

# Thanks for [@xarantolus](https://github.com/xarantolus)