// Package sync handles git-based repository synchronization
// between the local machine and AgentBox pocket dimensions.
package sync

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// GitSync manages repo synchronization to sandboxes.
type GitSync struct {
	baseDir string
}

// NewGitSync creates a sync manager.
func NewGitSync(baseDir string) *GitSync {
	return &GitSync{baseDir: baseDir}
}

// Push synchronizes the current git repository to a sandbox.
// It uses rsync over SSH for efficiency, falling back to git bundle.
func (g *GitSync) Push(name, ip, keyPath string) error {
	// Find repo root
	repoRoot, err := findGitRoot()
	if err != nil {
		return fmt.Errorf("not in a git repository: %w", err)
	}

	repoName := filepath.Base(repoRoot)
	remotePath := fmt.Sprintf("/root/%s", repoName)

	// Try rsync first (most efficient for incremental sync)
	if _, err := exec.LookPath("rsync"); err == nil {
		return g.rsyncPush(ip, keyPath, repoRoot, remotePath)
	}

	// Fallback: git bundle + scp
	return g.bundlePush(ip, keyPath, repoRoot, remotePath)
}

// Pull fetches changes from a sandbox back to local.
func (g *GitSync) Pull(name, ip, keyPath string) error {
	repoRoot, err := findGitRoot()
	if err != nil {
		return fmt.Errorf("not in a git repository: %w", err)
	}

	repoName := filepath.Base(repoRoot)
	remotePath := fmt.Sprintf("/root/%s", repoName)

	// Create a bundle on the remote
	bundlePath := fmt.Sprintf("/tmp/%s.bundle", name)
	sshCmd := fmt.Sprintf("cd %s && git bundle create %s HEAD", remotePath, bundlePath)

	cmd := exec.Command("ssh",
		"-i", keyPath,
		"-o", "StrictHostKeyChecking=no",
		"-o", "UserKnownHostsFile=/dev/null",
		fmt.Sprintf("root@%s", ip),
		sshCmd,
	)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("create remote bundle: %w", err)
	}

	// SCP bundle down
	localBundle := filepath.Join(g.baseDir, "state", name+".bundle")
	cmd = exec.Command("scp",
		"-i", keyPath,
		"-o", "StrictHostKeyChecking=no",
		"-o", "UserKnownHostsFile=/dev/null",
		fmt.Sprintf("root@%s:%s", ip, bundlePath),
		localBundle,
	)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("fetch bundle: %w", err)
	}
	defer os.Remove(localBundle)

	// Unbundle into local repo
	cmd = exec.Command("git", "bundle", "unbundle", localBundle)
	cmd.Dir = repoRoot
	cmd.Stdout = os.Stdout
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("unbundle: %w", err)
	}

	fmt.Println("  ✓ Changes pulled from pocket dimension")
	return nil
}

// ─── Private ─────────────────────────────────────────────────────

func (g *GitSync) rsyncPush(ip, keyPath, localPath, remotePath string) error {
	// Build exclude list
	excludes := buildExcludeList(localPath)

	args := []string{
		"-avz",
		"--delete",
		"-e", fmt.Sprintf("ssh -i %s -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null", keyPath),
	}

	for _, exc := range excludes {
		args = append(args, "--exclude", exc)
	}

	args = append(args, localPath+"/", fmt.Sprintf("root@%s:%s", ip, remotePath))

	cmd := exec.Command("rsync", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("rsync: %w", err)
	}

	fmt.Println("  ✓ Repo synced via rsync")
	return nil
}

func (g *GitSync) bundlePush(ip, keyPath, localPath, remotePath string) error {
	// Create git bundle
	bundleFile := filepath.Join(g.baseDir, "state", "sync.bundle")
	os.MkdirAll(filepath.Dir(bundleFile), 0755)

	cmd := exec.Command("git", "bundle", "create", bundleFile, "HEAD")
	cmd.Dir = localPath
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("git bundle: %w", err)
	}
	defer os.Remove(bundleFile)

	// SCP bundle to remote
	cmd = exec.Command("scp",
		"-i", keyPath,
		"-o", "StrictHostKeyChecking=no",
		"-o", "UserKnownHostsFile=/dev/null",
		bundleFile,
		fmt.Sprintf("root@%s:/tmp/sync.bundle", ip),
	)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("scp bundle: %w", err)
	}

	// Clone or pull on remote
	sshRun := func(command string) error {
		c := exec.Command("ssh",
			"-i", keyPath,
			"-o", "StrictHostKeyChecking=no",
			"-o", "UserKnownHostsFile=/dev/null",
			fmt.Sprintf("root@%s", ip),
			command,
		)
		c.Stdout = os.Stdout
		c.Stderr = os.Stderr
		return c.Run()
	}

	// Check if repo exists on remote
	checkCmd := fmt.Sprintf("test -d %s/.git", remotePath)
	check := exec.Command("ssh",
		"-i", keyPath,
		"-o", "StrictHostKeyChecking=no",
		fmt.Sprintf("root@%s", ip),
		checkCmd,
	)

	if err := check.Run(); err != nil {
		// Repo doesn't exist — clone from bundle
		if err := sshRun(fmt.Sprintf("git clone /tmp/sync.bundle %s", remotePath)); err != nil {
			return fmt.Errorf("remote clone: %w", err)
		}
	} else {
		// Repo exists — pull from bundle
		if err := sshRun(fmt.Sprintf("cd %s && git fetch /tmp/sync.bundle && git reset --hard FETCH_HEAD", remotePath)); err != nil {
			return fmt.Errorf("remote pull: %w", err)
		}
	}

	// Cleanup remote bundle
	sshRun("rm -f /tmp/sync.bundle")

	fmt.Println("  ✓ Repo synced via git bundle")
	return nil
}

// buildExcludeList creates a list of patterns to exclude from sync.
func buildExcludeList(repoRoot string) []string {
	excludes := []string{
		".env",
		".env.*",
		"*.pem",
		"*.key",
		".agentbox/",
		"node_modules/",
		"__pycache__/",
		".git/",
		".terraform/",
		"*.tfstate",
		"*.tfstate.backup",
		".DS_Store",
		"Thumbs.db",
		"vendor/",
		".venv/",
		"venv/",
		"dist/",
		"build/",
		".next/",
	}

	// Read .gitignore and add those too
	gitignorePath := filepath.Join(repoRoot, ".gitignore")
	if data, err := os.ReadFile(gitignorePath); err == nil {
		for _, line := range strings.Split(string(data), "\n") {
			line = strings.TrimSpace(line)
			if line != "" && !strings.HasPrefix(line, "#") {
				excludes = append(excludes, line)
			}
		}
	}

	// Read .agentboxignore if it exists
	agentboxIgnore := filepath.Join(repoRoot, ".agentboxignore")
	if data, err := os.ReadFile(agentboxIgnore); err == nil {
		for _, line := range strings.Split(string(data), "\n") {
			line = strings.TrimSpace(line)
			if line != "" && !strings.HasPrefix(line, "#") {
				excludes = append(excludes, line)
			}
		}
	}

	return excludes
}

// findGitRoot walks up from cwd to find the .git directory.
func findGitRoot() (string, error) {
	cmd := exec.Command("git", "rev-parse", "--show-toplevel")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(string(output)), nil
}
