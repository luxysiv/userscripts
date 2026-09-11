package main

import (
	_ "embed"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"sort"
	"strings"
	"text/template"
	"time"

	"cosmetic/filter"
	"cosmetic/topdomains"
	"cosmetic/util"
)

//go:embed script-template.js
var scriptTemplateRaw []byte

func joinSorted(f []string, comma string) string {
	sort.Strings(f)
	return strings.Join(f, comma)
}

func toJSObject(x interface{}) string {
	b, err := json.Marshal(x)
	if err != nil {
		panic(err)
	}
	return string(b)
}

// compileTable converts a combined rule table into the runtime data format:
//   - a list of deduplicated strings (indexed by the rules),
//   - a map domain -> (string selector, or index into the deduplicated list)
//   - a map domain -> (injected CSS, or index into the deduplicated list)
type compiledRules struct {
	deduplicatedStrings []string
	rulesJSON           string
	injJSON             string
	numDomains          int
	numInjections       int
}

func compileTable(table map[string]filter.CombineResult) compiledRules {
	duplicateCount := map[string]int{}
	for _, f := range table {
		joined := joinSorted(f.Selectors, ",")
		duplicateCount[joined]++
		joined = joinSorted(f.InjectedCSS, "")
		duplicateCount[joined]++
	}

	deduplicatedStrings := make([]string, 0, len(duplicateCount))
	for f, count := range duplicateCount {
		if count > 1 {
			deduplicatedStrings = append(deduplicatedStrings, f)
		}
	}
	sort.Strings(deduplicatedStrings)

	deduplicatedIndexMapping := map[string]int{}
	for i, r := range deduplicatedStrings {
		deduplicatedIndexMapping[r] = i
	}

	// Compiled rules are either:
	//   - a string, a CSS selector (usually selecting many elements), or
	//   - an int, the index of a common rule (present in more than one domain)
	compiledSelectorRules := map[string]interface{}{}
	compiledInjectionRules := map[string]interface{}{}
	for domain, filter := range table {
		if len(filter.Selectors) > 0 {
			joined := joinSorted(filter.Selectors, ",")
			if duplicateCount[joined] > 1 {
				compiledSelectorRules[domain] = deduplicatedIndexMapping[joined]
			} else {
				compiledSelectorRules[domain] = joined
			}
		}

		if len(filter.InjectedCSS) > 0 {
			joined := joinSorted(filter.InjectedCSS, "")
			if duplicateCount[joined] > 1 {
				compiledInjectionRules[domain] = deduplicatedIndexMapping[joined]
			} else {
				compiledInjectionRules[domain] = joined
			}
		}
	}

	var injCount int
	if len(compiledInjectionRules) > 0 {
		injCount = len(compiledInjectionRules)
	}

	return compiledRules{
		deduplicatedStrings: deduplicatedStrings,
		rulesJSON:           toJSObject(compiledSelectorRules),
		injJSON:             toJSObject(compiledInjectionRules),
		numDomains:          len(compiledSelectorRules),
		numInjections:       injCount,
	}
}

// subsetForTopDomains keeps the rules for the N most popular domains (plus the
// general "" rules). Used by the lazy-load shell as an offline baseline so a
// usable amount of ads is still hidden before/while the full rules are fetched.
func subsetForTopDomains(table map[string]filter.CombineResult, top *topdomains.TopDomainStorage, n int) map[string]filter.CombineResult {
	out := map[string]filter.CombineResult{}
	domains := make([]string, 0, len(table))
	for d := range table {
		if d != "" {
			domains = append(domains, d)
		}
	}
	sort.Strings(domains)

	kept := 0
	for _, domain := range domains {
		if kept >= n {
			break
		}
		if top.Contains(domain) {
			out[domain] = table[domain]
			kept++
		}
	}
	if r, ok := table[""]; ok {
		out[""] = r
	}
	return out
}

func main() {
	var (
		inputLists        = flag.String("input", "filter-lists.txt", "Path to file that defines URLs to blocklists")
		scriptTarget      = flag.String("output", "cosmetic.user.js", "Path to output file")
		topDomainsPath    = flag.String("top", "", "Path to file downloaded from http://s3-us-west-1.amazonaws.com/umbrella-static/index.html")
		topDomainCount    = flag.Int("topCount", 1_000_000, "Include up to this rank of highest-ranking top domains, only makes sense with -top")
		lazy              = flag.Bool("lazy", false, "Generate a small shell script that fetches the rules bundle at runtime")
		lazyBaselineCount = flag.Int("lazyBaselineCount", 1000, "Number of top domains baked into the lazy shell as an offline baseline")
		lazyRulesURL      = flag.String("lazyRulesURL", "https://raw.githubusercontent.com/luxysiv/userscripts/main/cosmetic.rules.json", "URL the lazy shell fetches rules from (must be CORS-enabled)")
		bundlePath        = flag.String("bundlePath", "", "Optionally also write the full rules bundle as JSON (used by the lazy shell)")
	)
	flag.Parse()

	var topDomains *topdomains.TopDomainStorage
	if strings.TrimSpace(*topDomainsPath) != "" {
		tdm, err := topdomains.FromFile(*topDomainsPath, *topDomainCount)
		if err != nil {
			log.Fatalf("Reading top domains from file: %v", err)
		}
		topDomains = &tdm
		fmt.Printf("Read %d top domains\n", tdm.Len())
	}

	var scriptTemplate = template.Must(template.New("").Parse(string(scriptTemplateRaw)))

	filterURLs, err := util.ReadListFile(*inputLists)
	if err != nil {
		log.Fatalf("cannot load list of filter URLs: %s\n", err.Error())
	}

	tempDir, err := os.MkdirTemp("", "cosmetic-filter-*")
	if err != nil {
		log.Fatalf("creating temp dir for cosmetic filters: %s\n", err.Error())
	}
	defer os.RemoveAll(tempDir)

	filterOutputFiles, err := util.DownloadURLs(filterURLs, tempDir)
	if err != nil {
		log.Fatalf("error downloading filter lists: %s\n", err.Error())
	}
	log.Printf("Downloaded %d filter files\n", len(filterOutputFiles))

	var filters []filter.Rule
	for _, fp := range filterOutputFiles {
		ff := util.FiltersFromFile(fp)
		if len(ff) == 0 {
			log.Printf("[Warning] No rules found in file %q\n", fp)
		}
		filters = append(filters, ff...)
	}
	fmt.Printf("Found %d filters in these files\n", len(filters))

	lookupTable := filter.Combine(filters)

	// The lazy rules bundle must always contain the FULL rule set, independent
	// of any lite filtering; only the shell's inline baseline is restricted.
	if *lazy && *bundlePath != "" {
		writeRulesBundle(lookupTable, *bundlePath)
	}

	// Lite mode (legacy, non-lazy): only keep filters for top/important domains.
	if !*lazy && topDomains != nil {
		topDomainLookupTable := make(map[string]filter.CombineResult)
		for domain, filter := range lookupTable {
			if domain == "" || topDomains.Contains(domain) {
				topDomainLookupTable[domain] = filter
			}
		}
		fmt.Printf("Selected %d top domains from %d domains with available filters\n", len(topDomainLookupTable), len(lookupTable))
		lookupTable = topDomainLookupTable
	}

	// The inline table is what gets baked into the script. In lazy mode this is
	// only the offline baseline, in normal mode it is the complete rule set.
	inlineTable := lookupTable
	if *lazy {
		if topDomains != nil {
			inlineTable = subsetForTopDomains(lookupTable, topDomains, *lazyBaselineCount)
			fmt.Printf("Baked %d domains into lazy shell baseline\n", len(inlineTable))
		} else {
			fmt.Println("Lazy mode without -top: full rule set baked inline (no baseline subset)")
		}
	}

	inline := compileTable(inlineTable)
	fmt.Printf("Combined them for %d domains\n", inline.numDomains)

	// Non-lazy builds may still want the JSON bundle for a later switch to the
	// lazy shell (which the committed cosmetic.rules.json enables).
	if !*lazy && *bundlePath != "" {
		writeRulesBundle(lookupTable, *bundlePath)
	}

	outputFile, err := os.Create(*scriptTarget)
	if err != nil {
		log.Fatalf("creating output file: %s\n", err.Error())
	}
	defer outputFile.Close()

	_, err = outputFile.WriteString("// THIS FILE IS AUTO-GENERATED. DO NOT EDIT. See generate/cosmetic directory for more info\n")
	if err != nil {
		log.Fatalf("could not write auto generated message: %s\n", err.Error())
	}

	err = scriptTemplate.Execute(outputFile, map[string]interface{}{
		"version":             time.Now().Format("2006.01.02"),
		"rules":               inline.rulesJSON,
		"injectionRules":      inline.injJSON,
		"deduplicatedStrings": toJSObject(inline.deduplicatedStrings),
		"statistics":          fmt.Sprintf("blockers for %d domains, injected CSS rules for %d domains", inline.numDomains, inline.numInjections),
		"isLite":              topDomains != nil && !*lazy,
		"topDomainCount":      *topDomainCount,
		"isLazy":              *lazy,
		"lazyRulesURL":        *lazyRulesURL,
		"lazyBaselineCount":   *lazyBaselineCount,
	})
	if err != nil {
		log.Fatalf("Error generating script text: %s\n", err.Error())
	}

	fmt.Printf("Wrote userscript to %s\n", *scriptTarget)
}

// writeRulesBundle serializes a combined rule table into the compact JSON
// bundle consumed by the lazy-load shell at runtime.
func writeRulesBundle(table map[string]filter.CombineResult, path string) {
	full := compileTable(table)
	var rulesObj, injObj interface{}
	if err := json.Unmarshal([]byte(full.rulesJSON), &rulesObj); err != nil {
		log.Fatalf("decoding rules for bundle: %s\n", err.Error())
	}
	if err := json.Unmarshal([]byte(full.injJSON), &injObj); err != nil {
		log.Fatalf("decoding injections for bundle: %s\n", err.Error())
	}
	bundle, err := json.Marshal(map[string]interface{}{
		"d": full.deduplicatedStrings,
		"r": rulesObj,
		"i": injObj,
	})
	if err != nil {
		log.Fatalf("marshalling rules bundle: %s\n", err.Error())
	}
	if err := os.WriteFile(path, bundle, 0o644); err != nil {
		log.Fatalf("writing rules bundle: %s\n", err.Error())
	}
	fmt.Printf("Wrote full rules bundle (%d bytes) to %s\n", len(bundle), path)
}
