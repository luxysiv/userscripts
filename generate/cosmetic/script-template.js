// ==UserScript==
// @name         Cosmetic Ad Block for Browser{{if .isLite}} (Lite){{end}}{{if .isLazy}} (Lazy){{end}}
// @namespace    luxysiv
// @version      {{.version}}
// @description  Blocks annoying elements in pages, sourced from many different filter lists{{if .isLazy}} (rules loaded from a bundle){{end}}
// @author       luxysiv 
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @homepage     https://github.com/luxysiv/userscripts
// @updateURL    https://userscripts.timie.workers.dev/cosmetic.user.js
// @downloadURL  https://userscripts.timie.workers.dev/cosmetic.user.js
// ==/UserScript==
/// @stats {{.statistics}}
{
    "use strict";

    // Set to true to get verbose console output (defaults to off).
    const DEBUG = false;

    let log = function (...data) {
        if (DEBUG) console.log("[Cosmetic filters by luxysiv (v{{.version}} {{if .isLite}}lite{{else}}full{{end}}{{if .isLazy}} lazy{{end}})]:", ...data);
    }

    // A single invalid member of a selector list is ignored by CSS, so the
    // combined selector string is safe even if one source rule is broken.
    const HIDE_RULE = "{display:none!important;visibility:hidden!important}";

    // ---------------------------------------------------------------------
    // Inline rules (the full set for normal builds, an offline baseline for
    // lazy builds).
    // ---------------------------------------------------------------------
    let deduplicatedStrings = {{.deduplicatedStrings }};
    let injectionRules = {{.injectionRules }};
    let rules = {{.rules }};

    const IS_LAZY = {{if .isLazy}}true{{else}}false{{end}};
    const RULES_URL = "{{.lazyRulesURL}}";
    // The cache key is versioned, so the bundle is re-fetched once a day
    // (whenever the version changes) and served from cache in between.
    const CACHE_KEY = "cosmetic-rules-v{{.version}}";

    function makeStore(dedup, inj, r) {
        return { dedup: dedup, inj: inj, rules: r };
    }

    function loadCachedFull() {
        try {
            let raw = localStorage.getItem(CACHE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) { /* storage unavailable or corrupted */ }
        return null;
    }

    // Returns the full rule bundle: a cached copy or a network fetch. Never
    // rejects; on any failure the caller falls back to the inline baseline.
    function loadFull() {
        let cached = loadCachedFull();
        if (cached) {
            log("Using cached rules bundle");
            return Promise.resolve(cached);
        }
        log("Fetching rules bundle from", RULES_URL);
        return fetch(RULES_URL, { cache: "no-store" })
            .then(function (res) {
                if (!res.ok) throw new Error("HTTP " + res.status);
                return res.json();
            })
            .then(function (data) {
                try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) { /* quota */ }
                return data;
            })
            .catch(function (err) {
                log("Could not load rules bundle, using inline baseline:", err);
                return null;
            });
    }

    // ---------------------------------------------------------------------
    // Domain-suffix rule lookup
    // ---------------------------------------------------------------------
    function getRules(store, host) {
        let domainSplit = host.split(".");
        let output = [];

        // Check host, then each shorter suffix (sub.example.com, example.com, ...).
        for (let i = 0; i < domainSplit.length - 1; i++) {
            let domain = domainSplit.slice(i, domainSplit.length).join(".").toLowerCase();

            let rule = store.rules[domain];
            if (rule != null) {
                if (typeof rule === 'number') {
                    output.push({ "s": store.dedup[rule] });
                } else {
                    output.push({ "s": rule });
                }
            }

            let injection = store.inj[domain];
            if (injection != null) {
                if (typeof injection === 'number') {
                    output.push({ "i": store.dedup[injection] });
                } else {
                    output.push({ "i": injection });
                }
            }
        }

        return output;
    }

    function resolveVal(v, store) {
        return (typeof v === 'number') ? store.dedup[v] : v;
    }

    // ---------------------------------------------------------------------
    // Style injection
    // ---------------------------------------------------------------------
    let active = { sig: "", page: "" };
    let observer = null;
    let pendingScan = false;
    let styleEls = [];

    function appendStyle(cssText) {
        let style = document.createElement('style');
        style.type = "text/css";
        style.textContent = cssText;
        // documentElement already exists at document-start (it is created
        // before the body), so we never have to wait for <head>.
        (document.documentElement || document.head).appendChild(style);
        styleEls.push(style);
    }

    // Two injections per page:
    //   1. the "common" <style>: general "*##..." rules that apply everywhere
    //   2. the site's own <style>: rules specific to the visited domain
    function applyStore(store, source) {
        let host = (location.hostname || "").toLowerCase();
        let found = getRules(store, host);

        let general = resolveVal(store.rules[""], store);
        let generalInj = resolveVal(store.inj[""], store);

        let generic = found.filter(r => r["s"] != null)
            .map(r => r["s"]).join(",");
        let css = found.filter(r => r["i"] != null).map(r => r["i"]).join("");

        log("Applying", source, "rules for", host,
            "common:" + (general ? general.length : 0) + " own:" + generic.length + " selector chars");

        let sig = (general || "") + "|" + (generalInj || "") + "|" + generic + "|" + css;
        if (sig !== active.sig) {
            styleEls.forEach(el => {
                if (el.parentNode) el.parentNode.removeChild(el);
            });
            styleEls = [];

            let common = "";
            if (general) common += general + HIDE_RULE;
            if (generalInj) common += generalInj;
            if (common) appendStyle(common);

            let own = "";
            if (generic) own += generic + HIDE_RULE;
            if (css) own += css;
            if (own) appendStyle(own);

            active.sig = sig;
        }

        active.page = generic;
        ensureObserver();
        scanPage("apply");
    }

    // ---------------------------------------------------------------------
    // Hiding elements that resist the stylesheet (inline styles)
    // ---------------------------------------------------------------------
    function applyHide(el) {
        let st = el.style;
        // Inline styles beat <style> rules, so override them directly.
        st.setProperty("display", "none", "important");
        st.setProperty("visibility", "hidden", "important");
    }

    function scanPage(source) {
        let page = active.page;
        if (!page) return;

        let elems = [];
        try {
            elems = document.querySelectorAll(page);
        } catch (e) {
            // One broken selector must not nuke hiding for everything else.
            let parts = page.split(",");
            for (let i = 0; i < parts.length; i++) {
                try {
                    elems.push.apply(elems, document.querySelectorAll(parts[i]));
                } catch (e2) { /* skip bad selector */ }
            }
        }
        elems.forEach(applyHide);
        log("scan(", source, ") hid", elems.length, "elements");
    }

    function scheduleScan() {
        if (pendingScan) return;
        pendingScan = true;
        setTimeout(function () {
            pendingScan = false;
            scanPage("observer");
        }, 200);
    }

    function ensureObserver() {
        if (observer || typeof MutationObserver === "undefined") return;
        observer = new MutationObserver(function () {
            // The stylesheet already hides static matches; this catches
            // elements inserted later (cookie banners, lazy ads, ...).
            if (active.page) scheduleScan();
        });
        try {
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        } catch (e) { /* documentElement missing (should not happen) */ }
    }

    // ---------------------------------------------------------------------
    // Boot
    // ---------------------------------------------------------------------
    let baseline = makeStore(deduplicatedStrings, injectionRules, rules);

    // In a normal build the inline data is already the full rule set, so this
    // runs once and everything is synchronous. documentElement is available at
    // document-start, no waiting for <head>.
    applyStore(baseline, "baseline");

    if (IS_LAZY) {
        loadFull().then(function (full) {
            if (full && full.r) {
                applyStore(makeStore(full.d || [], full.i || {}, full.r), "full");
            }
        });
        // If the cache is empty long after load (fetch failed earlier, e.g.
        // due to network), retry periodically.
        setInterval(function () {
            if (loadCachedFull() == null) {
                loadFull().then(function (full) {
                    if (full && full.r) {
                        applyStore(makeStore(full.d || [], full.i || {}, full.r), "full");
                    }
                });
            }
        }, 6 * 60 * 60 * 1000);
    }
}