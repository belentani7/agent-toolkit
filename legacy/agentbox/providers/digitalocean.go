// Package providers implements cloud provider backends for AgentBox.
// Each provider creates and manages VMs in a specific cloud platform,
// spawning pocket dimensions for AI agents to work in isolation.
package providers

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

// Provider is the interface every cloud backend must implement.
// Each method represents a phase in the lifecycle of a pocket dimension.
type Provider interface {
	// Name returns the provider identifier
	Name() string

	// CreateVM provisions a new VM and returns its public IP
	CreateVM(name, region, size, pubKey string) (ip string, err error)

	// DestroyVM tears down a VM by name
	DestroyVM(name string) error

	// InstallAICLI installs the chosen AI CLI on the remote VM
	InstallAICLI(ip, keyPath, aiCLI string) error

	// MonthlyCost returns the approximate monthly cost for a given size
	MonthlyCost(size string) float64

	// Validate checks that credentials are configured
	Validate() error
}

// ─── DigitalOcean ────────────────────────────────────────────────

// DigitalOcean provisions $4-6/mo droplets as pocket dimensions.
type DigitalOcean struct {
	token string
}

func NewDigitalOcean() *DigitalOcean {
	token := os.Getenv("DO_TOKEN")
	if token == "" {
		// Try reading from config
		token = readTokenFromConfig("digitalocean")
	}
	return &DigitalOcean{token: token}
}

func (d *DigitalOcean) Name() string { return "digitalocean" }

func (d *DigitalOcean) CreateVM(name, region, size, pubKey string) (string, error) {
	if d.token == "" {
		return "", fmt.Errorf("DO_TOKEN not set. Get a token at https://cloud.digitalocean.com/account/api/tokens")
	}

	// Upload SSH key
	keyID, err := d.uploadSSHKey(name, pubKey)
	if err != nil {
		return "", fmt.Errorf("upload ssh key: %w", err)
	}

	// Create droplet via API
	image := "ubuntu-22-04-x64"
	cmd := exec.Command("curl", "-s", "-X", "POST",
		"https://api.digitalocean.com/v2/droplets",
		"-H", "Authorization: Bearer "+d.token,
		"-H", "Content-Type: application/json",
		"-d", fmt.Sprintf(`{
			"name": "%s",
			"region": "%s",
			"size": "%s",
			"image": "%s",
			"ssh_keys": ["%s"],
			"backups": false,
			"ipv6": false,
			"monitoring": false,
			"tags": ["agentbox", "pocket-dimension"]
		}`, name, region, size, image, keyID),
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("create droplet: %s", string(output))
	}

	// Extract IP (simplified — real impl would parse JSON properly)
	ip := extractJSONField(string(output), "ip_address")
	if ip == "" {
		// Droplet created but IP not assigned yet — need to wait and query
		dropletID := extractJSONField(string(output), "id")
		ip, err = d.waitForIP(dropletID)
		if err != nil {
			return "", err
		}
	}

	return ip, nil
}

func (d *DigitalOcean) DestroyVM(name string) error {
	if d.token == "" {
		return fmt.Errorf("DO_TOKEN not set")
	}

	// Find droplet by name
	cmd := exec.Command("curl", "-s",
		"https://api.digitalocean.com/v2/droplets?tag_name=agentbox",
		"-H", "Authorization: Bearer "+d.token,
	)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("list droplets: %s", string(output))
	}

	// Find ID matching name (simplified)
	dropletID := extractDropletID(string(output), name)
	if dropletID == "" {
		return fmt.Errorf("droplet '%s' not found", name)
	}

	// Destroy
	cmd = exec.Command("curl", "-s", "-X", "DELETE",
		fmt.Sprintf("https://api.digitalocean.com/v2/droplets/%s", dropletID),
		"-H", "Authorization: Bearer "+d.token,
	)
	output, err = cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("destroy droplet: %s", string(output))
	}

	// Clean up SSH key
	d.deleteSSHKey(name)

	return nil
}

func (d *DigitalOcean) InstallAICLI(ip, keyPath, aiCLI string) error {
	var installCmd string
	switch aiCLI {
	case "claude":
		installCmd = "curl -fsSL https://claude.ai/install.sh | bash"
	case "aider":
		installCmd = "pip3 install aider-chat"
	case "codex":
		installCmd = "npm install -g @openai/codex"
	default:
		return fmt.Errorf("unknown AI CLI: %s", aiCLI)
	}

	return sshExec(ip, keyPath, installCmd)
}

func (d *DigitalOcean) MonthlyCost(size string) float64 {
	costs := map[string]float64{
		"s-1vcpu-1gb":  4.00,
		"s-1vcpu-2gb":  6.00,
		"s-2vcpu-2gb":  12.00,
		"s-2vcpu-4gb":  24.00,
		"s-4vcpu-8gb":  48.00,
	}
	if c, ok := costs[size]; ok {
		return c
	}
	return 4.00 // default
}

func (d *DigitalOcean) Validate() error {
	if d.token == "" {
		return fmt.Errorf("DO_TOKEN not set. Set it in environment or ~/.agentbox/config.yaml")
	}

	// Test token
	cmd := exec.Command("curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
		"https://api.digitalocean.com/v2/account",
		"-H", "Authorization: Bearer "+d.token,
	)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("api test failed: %v", err)
	}
	if string(output) != "200" {
		return fmt.Errorf("invalid token (HTTP %s)", string(output))
	}
	return nil
}

// ─── Private helpers ─────────────────────────────────────────────

func (d *DigitalOcean) uploadSSHKey(name, pubKey string) (string, error) {
	cmd := exec.Command("curl", "-s", "-X", "POST",
		"https://api.digitalocean.com/v2/account/keys",
		"-H", "Authorization: Bearer "+d.token,
		"-H", "Content-Type: application/json",
		"-d", fmt.Sprintf(`{"name":"agentbox-%s","public_key":"%s"}`, name, pubKey),
	)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("upload key: %s", string(output))
	}
	return extractJSONField(string(output), "id"), nil
}

func (d *DigitalOcean) deleteSSHKey(name string) {
	// Best-effort cleanup
	exec.Command("curl", "-s", "-X", "DELETE",
		fmt.Sprintf("https://api.digitalocean.com/v2/account/keys/agentbox-%s", name),
		"-H", "Authorization: Bearer "+d.token,
	).Run()
}

func (d *DigitalOcean) waitForIP(dropletID string) (string, error) {
	if dropletID == "" {
		return "", fmt.Errorf("no droplet ID")
	}

	for i := 0; i < 30; i++ {
		cmd := exec.Command("curl", "-s",
			fmt.Sprintf("https://api.digitalocean.com/v2/droplets/%s", dropletID),
			"-H", "Authorization: Bearer "+d.token,
		)
		output, _ := cmd.CombinedOutput()
		ip := extractJSONField(string(output), "ip_address")
		if ip != "" {
			return ip, nil
		}
		// Sleep 2 seconds between retries
		exec.Command("sleep", "2").Run()
	}
	return "", fmt.Errorf("timed out waiting for droplet IP")
}

// ─── Shared utilities ────────────────────────────────────────────

func sshExec(ip, keyPath, command string) error {
	cmd := exec.Command("ssh",
		"-i", keyPath,
		"-o", "StrictHostKeyChecking=no",
		"-o", "UserKnownHostsFile=/dev/null",
		"-o", "ConnectTimeout=10",
		fmt.Sprintf("root@%s", ip),
		command,
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func extractJSONField(json, field string) string {
	// Simple JSON field extraction (avoids external dependency)
	key := fmt.Sprintf(`"%s":`, field)
	idx := strings.Index(json, key)
	if idx == -1 {
		key = fmt.Sprintf(`"%s" :`, field)
		idx = strings.Index(json, key)
	}
	if idx == -1 {
		return ""
	}
	rest := json[idx+len(key):]
	rest = strings.TrimSpace(rest)
	if len(rest) == 0 {
		return ""
	}

	if rest[0] == '"' {
		end := strings.Index(rest[1:], `"`)
		if end == -1 {
			return ""
		}
		return rest[1 : end+1]
	}

	// Number or other type
	end := strings.IndexAny(rest, `,} ]`)
	if end == -1 {
		end = len(rest)
	}
	return strings.TrimSpace(rest[:end])
}

func extractDropletID(json, name string) string {
	// Simplified: find droplet by name tag, extract ID
	// In production, use proper JSON parsing
	marker := fmt.Sprintf(`"name":"%s"`, name)
	idx := strings.Index(json, marker)
	if idx == -1 {
		return ""
	}
	// Walk backwards to find "id" field in the same object
	chunk := json[max(0, idx-500):idx]
	idIdx := strings.LastIndex(chunk, `"id":`)
	if idIdx == -1 {
		return ""
	}
	rest := chunk[idIdx+5:]
	end := strings.IndexAny(rest, `,}`)
	if end == -1 {
		return ""
	}
	return strings.TrimSpace(rest[:end])
}

func readTokenFromConfig(provider string) string {
	home, _ := os.UserHomeDir()
	data, err := os.ReadFile(home + "/.agentbox/config.yaml")
	if err != nil {
		return ""
	}
	// Simple extraction
	lines := strings.Split(string(data), "\n")
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "token:") {
			val := strings.TrimPrefix(trimmed, "token:")
			val = strings.TrimSpace(val)
			val = strings.Trim(val, "\"'")
			if val != "" {
				return val
			}
		}
	}
	return ""
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
