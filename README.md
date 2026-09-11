# Status
[![Tạo userscripts](https://github.com/luxysiv/userscripts/actions/workflows/auto-generate.yml/badge.svg)](https://github.com/luxysiv/userscripts/actions/workflows/auto-generate.yml)

# About
Copycat and edit from [xarantolus/bromite-userscripts](https://github.com/xarantolus/bromite-userscripts)

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
The generator lives in `generate/cosmetic` (Go).

```bash
cd generate/cosmetic
bash generate.sh   # downloads filter lists, writes ../../cosmetic.user.js
```

Daily, a GitHub Actions workflow re-runs this and commits the fresh script.

# Thanks for [@xarantolus](https://github.com/xarantolus)