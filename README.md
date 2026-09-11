# Status
[![Tạo userscripts](https://github.com/luxysiv/userscripts/actions/workflows/auto-generate.yml/badge.svg)](https://github.com/luxysiv/userscripts/actions/workflows/auto-generate.yml)

# How it works
`cosmetic.user.js` is a self-contained userscript: the full rule set (from
EasyList, ABPVN, ...) is embedded inline, so it needs no network dependency at
runtime. At `document-start`, every visited page is injected with two
`<style>` tags:

1. **Common** — the general rules (`*##...`) that apply on every site.
2. **Site-specific** — only the rules declared for the visited domain
   (plus its subdomains). E.g. on `vnexpress.net` only the `vnexpress.net`
   selectors are injected (like `#banner_top`, `#admbackground`,
   `div[id^="ads_"]`), never rules from other sites.

An (optional) `MutationObserver` re-scans the page to defeat elements that
appear late or rely on inline styles (cookie banners, lazy-loaded ads).

# Development
All generator Go code lives in a single folder, `generate` (one flat package,
no subdirectories). It downloads the filter lists, renders `cosmetic.user.js`,
and with `-commit` also stages, commits and pushes the result when it changed
(the daily CI step).

```bash
cd generate
go run . -input filter-lists.txt -output ../cosmetic.user.js   # build only
go run . -input filter-lists.txt -output ../cosmetic.user.js -commit   # build + commit & push if changed
```

Daily, a GitHub Actions workflow re-runs this and commits the fresh script.
