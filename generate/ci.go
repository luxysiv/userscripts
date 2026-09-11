package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func runCmd(dir, name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.Dir = dir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

// repoRoot resolves the git repository root, no matter the current directory.
func repoRoot() (string, error) {
	out, err := exec.Command("git", "rev-parse", "--show-toplevel").Output()
	if err != nil {
		return "", fmt.Errorf("git rev-parse: %w", err)
	}
	return strings.TrimSpace(string(out)), nil
}

// gitStageDiffers reports whether the staged diff for relPath is non-empty.
func gitStageDiffers(dir, relPath string) (bool, error) {
	cmd := exec.Command("git", "diff", "--cached", "--exit-code", "--quiet", "--", relPath)
	cmd.Dir = dir
	err := cmd.Run()
	if err == nil {
		return false, nil
	}
	if ee, ok := err.(*exec.ExitError); ok && ee.ExitCode() == 1 {
		return true, nil
	}
	return false, fmt.Errorf("git diff: %w", err)
}

// commitIdentity returns the author name/email. In CI these come from the
// workflow environment (GITHUB_ACTOR / GITHUB_ACTOR_ID); the display name is
// looked up via the GitHub API when a token is available.
func commitIdentity() (name, email string) {
	actor := strings.TrimSpace(os.Getenv("GITHUB_ACTOR"))
	actorID := strings.TrimSpace(os.Getenv("GITHUB_ACTOR_ID"))

	if actor == "" {
		return "", ""
	}

	if token := strings.TrimSpace(os.Getenv("GITHUB_TOKEN")); token != "" {
		if n := githubDisplayName(actor, token); n != "" {
			name = n
		}
	}
	if name == "" {
		name = actor
	}

	email = actor + "@users.noreply.github.com"
	if actorID != "" {
		email = actorID + "+" + actor + "@users.noreply.github.com"
	}
	return name, email
}

func githubDisplayName(actor, token string) string {
	req, err := http.NewRequest(http.MethodGet, urlBase(), nil)
	if err != nil {
		return ""
	}
	req.URL.Path = "/users/" + url.PathEscape(actor)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("User-Agent", "luxysiv-userscripts")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return ""
	}

	var u struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&u); err != nil {
		return ""
	}
	return strings.TrimSpace(u.Name)
}

func urlBase() string {
	return "https://api.github.com"
}

// commitIfChanged stages the freshly generated userscript and, only when it
// actually changed, commits it as "Update userscript" and pushes to origin one.
// Keeps the repository free of both per-run noise and a written cache.
func commitIfChanged(scriptAbs string) error {
	root, err := repoRoot()
	if err != nil {
		return err
	}

	rel, err := filepath.Rel(root, scriptAbs)
	if err != nil {
		return err
	}
	if rel == ".." || strings.HasPrefix(rel, ".."+string(filepath.Separator)) {
		return fmt.Errorf("output %q is outside the repository root %q", scriptAbs, root)
	}
	rel = strings.TrimPrefix(rel, "."+string(filepath.Separator))

	if err := runCmd(root, "git", "add", rel); err != nil {
		return fmt.Errorf("git add: %w", err)
	}

	changed, err := gitStageDiffers(root, rel)
	if err != nil {
		return err
	}
	if !changed {
		fmt.Println("No changes to commit")
		return nil
	}

	name, email := commitIdentity()
	if name == "" || email == "" {
		return fmt.Errorf("cannot determine git identity (GITHUB_ACTOR not set)")
	}

	if err := runCmd(root, "git", "-c", "user.name="+name, "-c", "user.email="+email,
		"commit", "-m", "Update userscript"); err != nil {
		return fmt.Errorf("git commit: %w", err)
	}
	if err := runCmd(root, "git", "push", "origin", "main"); err != nil {
		return fmt.Errorf("git push: %w", err)
	}
	fmt.Println("Pushed updated userscript")
	return nil
}
