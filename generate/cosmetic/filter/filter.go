package filter

import (
	"regexp"
	"strings"
	"unicode"

	"github.com/andybalholm/cascadia"
)

type Rule struct {
	Domains []string

	CSSSelector string

	InjectedCSS string
}

// hasParenthesesBalanced is a light sanity check used as a fallback for
// selectors that target the modern Chromium-only :has() pseudo-class, which
// the older cascadia parser does not fully understand.
func hasParenthesesBalanced(s string) bool {
	depth := 0
	for _, r := range s {
		switch r {
		case '(':
			depth++
		case ')':
			depth--
			if depth < 0 {
				return false
			}
		}
	}
	return depth == 0
}

func isIncompatibleSelector(s string) bool {
	_, err := cascadia.Parse(s)
	if err == nil {
		// Valid for our parser, assume it also works in the browser
		return false
	}

	// :has() has been supported by Chromium since v105 (2022). cascadia 1.3.1
	// only understands simple :has() arguments, so a parse failure alone is no
	// reason to drop rules that use it. Require at least balanced parentheses
	// so plainly broken selectors don't end up in the generated script.
	if strings.Contains(s, ":has(") && hasParenthesesBalanced(s) {
		return false
	}

	return true
}

var (
	injectedStyleRegex = regexp.MustCompile(`(.*?)\:style\((.*?)\)`)
)

// See https://help.eyeo.com/en/adblockplus/how-to-write-filters, "Content Filters"
func ParseLine(line string) (f Rule, ok bool) {
	var isCSSInjection bool

	var split []string
	// Check which type of rule we got in this line
	if split = strings.SplitN(line, "##", 2); len(split) == 2 {
		// Element hiding rule
		// Example:   domain1.com,domain2.com##.blocked-element
		isCSSInjection = false
	} else if split = strings.SplitN(line, "#$#", 2); len(split) == 2 {
		// A CSS injection
		// Example:   domain1.com,domain2.com#$#.cookie { display: none!important; }
		isCSSInjection = true
	} else {
		// The statement in this line is not recognized, ignore it
		return f, false
	}

	// We currently only support very basic filters.
	// This check makes sure the other filters types are filtered out
	if split[0] != "*" && strings.ContainsAny(split[0], "*~#@") {
		return f, false
	}

	var (
		injectedStyle string
		selector      = split[1]
	)
	if strings.Contains(split[1], ":style") {
		matches := injectedStyleRegex.FindStringSubmatch(split[1])
		if len(matches) != 3 {
			return f, false
		}
		selector = ""
		injectedStyle = matches[1] + "{" + matches[2] + "}"
	} else if isCSSInjection {
		selector = ""
		injectedStyle = split[1]
	} else {
		// Make sure we only get valid selectors
		if isIncompatibleSelector(selector) {
			return f, false
		}
	}

	domains := strings.FieldsFunc(split[0], func(r rune) bool {
		return unicode.IsSpace(r) || r == ','
	})
	if len(domains) == 0 {
		// General rules for all domains need the empty domain to work with the script
		domains = append(domains, "")
	}
	if split[0] == "*" {
		domains = []string{""}
	}

	return Rule{
		Domains:     domains,
		CSSSelector: selector,
		InjectedCSS: injectedStyle,
	}, true
}

type CombineResult struct {
	Selectors   []string
	InjectedCSS []string
}

func Combine(filters []Rule) (m map[string]CombineResult) {
	m = make(map[string]CombineResult)

	for _, f := range filters {
		for _, d := range f.Domains {
			out := m[d]

			if f.CSSSelector != "" && !contains(out.Selectors, f.CSSSelector) {
				out.Selectors = append(out.Selectors, f.CSSSelector)
			}
			if f.InjectedCSS != "" && !contains(out.InjectedCSS, f.InjectedCSS) {
				out.InjectedCSS = append(out.InjectedCSS, f.InjectedCSS)
			}

			m[d] = out
		}
	}

	return m
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
