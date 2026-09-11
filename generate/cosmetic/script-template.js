// ==UserScript==
// @name         Cosmetic Ad Block for Browser{{if .isLite}} (Lite){{end}}
// @namespace    luxysiv
// @version      {{.version}}
// @description  Blocks annoying elements in pages, sourced from many different filter lists
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
        if (DEBUG) console.log("[Cosmetic filters by luxysiv (v{{.version}} {{if .isLite}}lite{{else}}full{{end}})]:", ...data);
    }

    // A single invalid member of a selector list is ignored by CSS, so the
    // combined selector string is safe even if one source rule is broken.
    const HIDE_RULE = "{display:none!important;visibility:hidden!important}";

    // ---------------------------------------------------------------------
    // Inline rules (the complete rule set of the build).
    // ---------------------------------------------------------------------
    let deduplicatedStrings = {{.deduplicatedStrings }};
    let injectionRules = {{.injectionRules }};
    let rules = {{.rules }};

    function makeStore(dedup, inj, r) {
        return { dedup: dedup, inj: inj, rules: r };
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

    // Runs once, synchronously, at document-start (documentElement exists
    // before <head>), so every page gets its styles immediately, with no
    // network dependency.
    applyStore(baseline, "baseline");
}