// Package ssh manages SSH key generation, distribution, and connections
// for AgentBox pocket dimensions.
package ssh

import (
	"fmt"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

// Manager handles SSH key lifecycle for sandboxes.
type Manager struct {
	baseDir string
}

// NewManager creates an SSH manager rooted at the agentbox config dir.
func NewManager(baseDir string) *Manager {
	return &Manager{baseDir: baseDir}
}

// GenerateKeyPair creates an ed25519 SSH keypair for a sandbox.
// Returns the private key path and the public key string.
func (m *Manager) GenerateKeyPair(name string) (keyPath string, pubKey string, err error) {
	keysDir := filepath.Join(m.baseDir, "keys")
	os.MkdirAll(keysDir, 0700)

	keyPath = filepath.Join(keysDir, name)

	// Don't overwrite existing keys
	if _, err := os.Stat(keyPath); err == nil {
		pubData, err := os.ReadFile(keyPath + ".pub")
		if err != nil {
			return "", "", fmt.Errorf("read existing pub key: %w", err)
		}
		return keyPath, string(pubData), nil
	}

	// Generate ed25519 keypair
	cmd := exec.Command("ssh-keygen",
		"-t", "ed25519",
		"-C", fmt.Sprintf("agentbox-%s@pocket-dimension", name),
		"-f", keyPath,
		"-N", "", // no passphrase — sandboxes are ephemeral
		"-q",
	)

	if err := cmd.Run(); err != nil {
		return "", "", fmt.Errorf("ssh-keygen: %w", err)
	}

	// Set restrictive permissions
	os.Chmod(keyPath, 0600)
	os.Chmod(keyPath+".pub", 0644)

	// Read public key
	pubData, err := os.ReadFile(keyPath + ".pub")
	if err != nil {
		return "", "", fmt.Errorf("read pub key: %w", err)
	}

	return keyPath, string(pubData), nil
}

// KeyPath returns the private key path for a named sandbox.
func (m *Manager) KeyPath(name string) string {
	return filepath.Join(m.baseDir, "keys", name)
}

// WaitForSSH polls the target IP until SSH accepts connections or timeout.
func (m *Manager) WaitForSSH(ip, keyPath string, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	attempts := 0

	for time.Now().Before(deadline) {
		attempts++

		// Try TCP connection to port 22
		conn, err := net.DialTimeout("tcp", ip+":22", 5*time.Second)
		if err == nil {
			conn.Close()
			// SSH port is open — verify we can actually authenticate
			cmd := exec.Command("ssh",
				"-i", keyPath,
				"-o", "StrictHostKeyChecking=no",
				"-o", "UserKnownHostsFile=/dev/null",
				"-o", "ConnectTimeout=5",
				"-o", "BatchMode=yes",
				fmt.Sprintf("root@%s", ip),
				"echo ready",
			)
			output, err := cmd.CombinedOutput()
			if err == nil {
				return nil
			}
			// SSH port open but auth failed — key might not be propagated yet
			_ = output
		}

		// Exponential backoff: 1s, 2s, 4s, 5s cap
		sleep := time.Duration(min(attempts*2, 5)) * time.Second
		time.Sleep(sleep)
	}

	return fmt.Errorf("SSH not ready after %v (%d attempts)", timeout, attempts)
}

// Connect establishes an interactive SSH session to a sandbox.
func (m *Manager) Connect(ip, keyPath string) error {
	cmd := exec.Command("ssh",
		"-i", keyPath,
		"-o", "StrictHostKeyChecking=no",
		"-o", "UserKnownHostsFile=/dev/null",
		"-o", "ServerAliveInterval=30",
		"-o", "ServerAliveCountMax=3",
		fmt.Sprintf("root@%s", ip),
	)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

// PortForward sets up SSH port forwarding to a sandbox.
func (m *Manager) PortForward(ip, keyPath string, localPort, remotePort int) error {
	cmd := exec.Command("ssh",
		"-i", keyPath,
		"-o", "StrictHostKeyChecking=no",
		"-o", "UserKnownHostsFile=/dev/null",
		"-N", // no remote command
		"-L", fmt.Sprintf("%d:localhost:%d", localPort, remotePort),
		fmt.Sprintf("root@%s", ip),
	)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

// CopyFile SCPs a file to the sandbox.
func (m *Manager) CopyFile(ip, keyPath, localPath, remotePath string) error {
	cmd := exec.Command("scp",
		"-i", keyPath,
		"-o", "StrictHostKeyChecking=no",
		"-o", "UserKnownHostsFile=/dev/null",
		localPath,
		fmt.Sprintf("root@%s:%s", ip, remotePath),
	)
	return cmd.Run()
}

// Cleanup removes SSH keys for a sandbox after teardown.
func (m *Manager) Cleanup(name string) {
	keysDir := filepath.Join(m.baseDir, "keys")
	os.Remove(filepath.Join(keysDir, name))
	os.Remove(filepath.Join(keysDir, name+".pub"))

	// Remove known_hosts entry (best effort)
	knownHosts := filepath.Join(os.Getenv("HOME"), ".ssh", "known_hosts")
	if data, err := os.ReadFile(knownHosts); err == nil {
		// Simple: just log that cleanup happened
		// In production, would filter out the sandbox IP
		_ = data
	}
}

// ListKeys returns all sandbox names that have SSH keys.
func (m *Manager) ListKeys() []string {
	keysDir := filepath.Join(m.baseDir, "keys")
	entries, err := os.ReadDir(keysDir)
	if err != nil {
		return nil
	}
	var names []string
	for _, e := range entries {
		name := e.Name()
		if filepath.Ext(name) != ".pub" && name != "" {
			names = append(names, name)
		}
	}
	return names
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
