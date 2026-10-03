package providers

import (
	"fmt"
	"os"
	"os/exec"
)

// ─── Hetzner Cloud ───────────────────────────────────────────────

// Hetzner provisions €3.79/mo servers as pocket dimensions.
// Best price/performance ratio in the European multiverse.
type Hetzner struct {
	token string
}

func NewHetzner() *Hetzner {
	token := os.Getenv("HETZNER_TOKEN")
	if token == "" {
		token = readTokenFromConfig("hetzner")
	}
	return &Hetzner{token: token}
}

func (h *Hetzner) Name() string { return "hetzner" }

func (h *Hetzner) CreateVM(name, region, size, pubKey string) (string, error) {
	if h.token == "" {
		return "", fmt.Errorf("HETZNER_TOKEN not set. Get a token at https://console.hetzner.cloud/")
	}

	// Map agentbox sizes to Hetzner server types
	serverType := h.mapServerType(size)

	// Upload SSH key first
	keyID, err := h.uploadSSHKey(name, pubKey)
	if err != nil {
		return "", fmt.Errorf("upload ssh key: %w", err)
	}

	// Create server via API
	cmd := exec.Command("curl", "-s", "-X", "POST",
		"https://api.hetzner.cloud/v1/servers",
		"-H", "Authorization: Bearer "+h.token,
		"-H", "Content-Type: application/json",
		"-d", fmt.Sprintf(`{
			"name": "%s",
			"server_type": "%s",
			"image": "ubuntu-22.04",
			"location": "%s",
			"ssh_keys": [%s],
			"labels": {"managed-by": "agentbox", "dimension": "pocket"},
			"start_after_create": true
		}`, name, serverType, region, keyID),
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("create server: %s", string(output))
	}

	// Extract IP from response
	ip := extractJSONField(string(output), "ip")
	if ip == "" {
		// Server might not have IP yet, wait for it
		serverID := extractJSONField(string(output), "id")
		ip, err = h.waitForIP(serverID)
		if err != nil {
			return "", err
		}
	}

	return ip, nil
}

func (h *Hetzner) DestroyVM(name string) error {
	if h.token == "" {
		return fmt.Errorf("HETZNER_TOKEN not set")
	}

	// List servers to find ID
	cmd := exec.Command("curl", "-s",
		"https://api.hetzner.cloud/v1/servers?label_selector=managed-by=agentbox",
		"-H", "Authorization: Bearer "+h.token,
	)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("list servers: %s", string(output))
	}

	serverID := extractServerID(string(output), name)
	if serverID == "" {
		return fmt.Errorf("server '%s' not found on Hetzner", name)
	}

	// Delete server
	cmd = exec.Command("curl", "-s", "-X", "DELETE",
		fmt.Sprintf("https://api.hetzner.cloud/v1/servers/%s", serverID),
		"-H", "Authorization: Bearer "+h.token,
	)
	output, err = cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("destroy server: %s", string(output))
	}

	// Clean SSH key
	h.deleteSSHKey(name)

	return nil
}

func (h *Hetzner) InstallAICLI(ip, keyPath, aiCLI string) error {
	var installCmd string
	switch aiCLI {
	case "claude":
		installCmd = "curl -fsSL https://claude.ai/install.sh | bash"
	case "aider":
		installCmd = "pip3 install aider-chat"
	case "codex":
		installCmd = "curl -fsSL https://deb.nodesource.com/setup_20.x | bash && apt-get install -y nodejs && npm install -g @openai/codex"
	default:
		return fmt.Errorf("unknown AI CLI: %s", aiCLI)
	}
	return sshExec(ip, keyPath, installCmd)
}

func (h *Hetzner) MonthlyCost(size string) float64 {
	costs := map[string]float64{
		"s-1vcpu-1gb":  3.79,  // CX11
		"s-1vcpu-2gb":  4.51,  // CX21
		"s-2vcpu-4gb":  8.90,  // CX31
		"s-4vcpu-8gb":  15.90, // CX41
	}
	if c, ok := costs[size]; ok {
		return c
	}
	return 3.79
}

func (h *Hetzner) Validate() error {
	if h.token == "" {
		return fmt.Errorf("HETZNER_TOKEN not set. Set it in environment or ~/.agentbox/config.yaml")
	}
	cmd := exec.Command("curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
		"https://api.hetzner.cloud/v1/servers",
		"-H", "Authorization: Bearer "+h.token,
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

// ─── Private ─────────────────────────────────────────────────────

func (h *Hetzner) mapServerType(size string) string {
	mapping := map[string]string{
		"s-1vcpu-1gb": "cx11",
		"s-1vcpu-2gb": "cx21",
		"s-2vcpu-2gb": "cx21",
		"s-2vcpu-4gb": "cx31",
		"s-4vcpu-8gb": "cx41",
	}
	if t, ok := mapping[size]; ok {
		return t
	}
	return "cx11"
}

func (h *Hetzner) uploadSSHKey(name, pubKey string) (string, error) {
	cmd := exec.Command("curl", "-s", "-X", "POST",
		"https://api.hetzner.cloud/v1/ssh_keys",
		"-H", "Authorization: Bearer "+h.token,
		"-H", "Content-Type: application/json",
		"-d", fmt.Sprintf(`{"name":"agentbox-%s","public_key":"%s"}`, name, pubKey),
	)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("upload key: %s", string(output))
	}
	return extractJSONField(string(output), "id"), nil
}

func (h *Hetzner) deleteSSHKey(name string) {
	// List keys to find the ID
	cmd := exec.Command("curl", "-s",
		"https://api.hetzner.cloud/v1/ssh_keys",
		"-H", "Authorization: Bearer "+h.token,
	)
	output, _ := cmd.CombinedOutput()
	keyID := extractJSONField(string(output), "id")
	if keyID != "" {
		exec.Command("curl", "-s", "-X", "DELETE",
			fmt.Sprintf("https://api.hetzner.cloud/v1/ssh_keys/%s", keyID),
			"-H", "Authorization: Bearer "+h.token,
		).Run()
	}
}

func (h *Hetzner) waitForIP(serverID string) (string, error) {
	if serverID == "" {
		return "", fmt.Errorf("no server ID")
	}
	for i := 0; i < 30; i++ {
		cmd := exec.Command("curl", "-s",
			fmt.Sprintf("https://api.hetzner.cloud/v1/servers/%s", serverID),
			"-H", "Authorization: Bearer "+h.token,
		)
		output, _ := cmd.CombinedOutput()
		ip := extractJSONField(string(output), "ip")
		if ip != "" {
			return ip, nil
		}
		exec.Command("sleep", "2").Run()
	}
	return "", fmt.Errorf("timed out waiting for server IP")
}

func extractServerID(json, name string) string {
	// Simplified: find server by name, extract ID
	marker := fmt.Sprintf(`"name":"%s"`, name)
	idx := indexOf(json, marker)
	if idx == -1 {
		return ""
	}
	chunk := json[max(0, idx-500):idx]
	idIdx := lastIndex(chunk, `"id":`)
	if idIdx == -1 {
		return ""
	}
	rest := chunk[idIdx+5:]
	end := indexOfAny(rest, `,} ]`)
	if end == -1 {
		return ""
	}
	return trimSpace(rest[:end])
}

// String helpers (avoid importing strings in every provider file)
func indexOf(s, substr string) int {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return i
		}
	}
	return -1
}

func lastIndex(s, substr string) int {
	for i := len(s) - len(substr); i >= 0; i-- {
		if s[i:i+len(substr)] == substr {
			return i
		}
	}
	return -1
}

func indexOfAny(s, chars string) int {
	for i, c := range s {
		for _, ch := range chars {
			if c == ch {
				return i
			}
		}
	}
	return -1
}

func trimSpace(s string) string {
	start, end := 0, len(s)
	for start < end && (s[start] == ' ' || s[start] == '\t' || s[start] == '\n') {
		start++
	}
	for end > start && (s[end-1] == ' ' || s[end-1] == '\t' || s[end-1] == '\n') {
		end--
	}
	return s[start:end]
}
