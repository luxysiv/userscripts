package main

import (
	"bufio"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// ReadListFile returns all URLs read from file `name` without duplicates, sorted
func ReadListFile(fn string) (entries []string, err error) {
	var entriesMap = map[string]bool{}

	f, err := os.Open(fn)
	if err != nil {
		return
	}
	defer f.Close()

	scan := bufio.NewScanner(f)

	for scan.Scan() {
		t := strings.TrimSpace(scan.Text())

		// Remove comments and empty lines
		if strings.HasPrefix(t, "#") || t == "" {
			continue
		}

		// Warn about invalid URLs
		if _, uerr := url.ParseRequestURI(t); uerr != nil {
			log.Printf("Invalid URL %q\n", t)
			continue
		}

		if entriesMap[t] {
			// We have seen this URL before. Just warn about it, nothing else
			log.Printf("Duplicate URL %q will only be downloaded once\n", t)
		} else {
			// If we haven't seen this URL before, we add it to the list
			entriesMap[t] = true
		}
	}

	for url := range entriesMap {
		entries = append(entries, url)
	}

	sort.Strings(entries)

	return
}

var httpClient = http.Client{
	Timeout: 30 * time.Second,
}

// DownloadURLs downloads every URL in inputURLs into tempDir and returns the
// file paths of the successfully downloaded ones. Fails only if more than half
// of the URLs could not be downloaded.
func DownloadURLs(inputURLs []string, tempDir string) (outputPaths []string, err error) {
	var dlFile = func(url string, file string) (err error) {
		f, err := os.Create(file)
		if err != nil {
			return
		}
		defer f.Close()

		resp, err := httpClient.Get(url)
		if err != nil {
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode < 200 || resp.StatusCode >= 400 {
			return fmt.Errorf("unexpected status code %d", resp.StatusCode)
		}

		_, err = io.Copy(f, resp.Body)

		return
	}

	var errCount int

	for _, dlURL := range inputURLs {
		fn := filepath.Join(tempDir, generateFilename(dlURL))

		err = dlFile(dlURL, fn)
		if err != nil {
			errCount++

			log.Printf("[Warning]: Failed to download %s: %s\n", dlURL, err.Error())
			continue
		}

		outputPaths = append(outputPaths, fn)
	}

	if errCount > (len(inputURLs) / 2) {
		err = fmt.Errorf("%d/%d urls couldn't be downloaded", errCount, len(inputURLs))
	}

	return
}

func generateFilename(url string) string {
	h := sha256.New()
	_, err := h.Write([]byte(url))
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(h.Sum(nil)) + ".txt"
}

// ParseFilterList parses the cosmetic rules from a filter list reader.
func ParseFilterList(f io.Reader) (filters []Rule) {
	scan := bufio.NewScanner(f)

	for scan.Scan() {
		txt := strings.TrimSpace(scan.Text())

		if len(txt) == 0 || strings.HasPrefix(txt, "!") {
			continue
		}

		filter, ok := ParseLine(txt)
		if ok {
			filters = append(filters, filter)
		}
	}

	return filters
}

// FiltersFromFile reads a downloaded filter list and parses its rules.
func FiltersFromFile(filepath string) (filters []Rule) {
	f, err := os.Open(filepath)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	return ParseFilterList(f)
}
