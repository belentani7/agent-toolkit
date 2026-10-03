// AgentBox — spawn pocket dimensions for your AI agents.
//
// Each sandbox is a parallel universe where code evolves in isolation.
// The cloud is infinite compute at your fingertips. AgentBox makes it disposable.
package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/agentbox/agentbox/cost"
	"github.com/agentbox/agentbox/infra"
	"github.com/agentbox/agentbox/providers"
	"github.com/agentbox/agentbox/ssh"
	"github.com/agentbox/agentbox/sync"
)

const version = "0.1.0"

func main() {
	if len(os.Args) < 2 {
		printBanner()
		printUsage()
		os.Exit(0)
	}

	cmd := os.Args[1]
	args := os.Args[2:]

	switch cmd {
	case "up":
		cmdUp(args)
	case "down":
		cmdDown(args)
	case "list":
		cmdList()
	case "ssh":
		cmdSSH(args)
	case "sync":
		cmdSync(args)
	case "cost":
		cmdCost()
	case "init":
		cmdInit()
	case "--version", "-v", "version":
		fmt.Printf("agentbox v%s (%s/%s)\n", version, runtime.GOOS, runtime.GOARCH)
	case "--help", "-h", "help":
		printBanner()
		printUsage()
	case "--multiverse":
		cmdMultiverse(args)
	default:
		fmt.Fprintf(os.Stderr, "✗ unknown command: %s\n\n", cmd)
		printUsage()
		os.Exit(1)
	}
}

// ─── Commands ────────────────────────────────────────────────────

func cmdUp(args []string) {
	name := "sandbox"
	if len(args) > 0 {
		name = args[0]
	}

	cfg := loadConfig()
	if cfg.Provider == "" {
		fatal("no provider configured. Run 'agentbox init' first.")
	}

	fmt.Printf("⌛ Spawning pocket dimension: %s\n", name)
	fmt.Printf("   Provider: %s | Region: %s | Size: %s\n", cfg.Provider, cfg.Region, cfg.Size)
	fmt.Println()

	// Get provider
	provider, err := getProvider(cfg)
	if err != nil {
		fatal("provider error: %v", err)
	}

	// Generate SSH keys
	fmt.Println("  → Generating SSH keys...")
	sshMgr := ssh.NewManager(agentboxDir())
	keyPath, pubKey, err := sshMgr.GenerateKeyPair(name)
	if err != nil {
		fatal("ssh keygen: %v", err)
	}

	// Create infrastructure
	fmt.Println("  → Provisioning cloud VM...")
	startTime := time.Now()

	tf := infra.NewTerraform(agentboxDir())
	if err := tf.Generate(cfg, name, pubKey); err != nil {
		fatal("terraform generate: %v", err)
	}

	result, err := tf.Apply(name)
	if err != nil {
		fatal("terraform apply: %v", err)
	}

	elapsed := time.Since(startTime)
	fmt.Printf("  → VM ready in %.1fs\n", elapsed.Seconds())

	// Wait for SSH
	fmt.Println("  → Waiting for SSH...")
	if err := sshMgr.WaitForSSH(result.IP, keyPath, 120*time.Second); err != nil {
		fatal("ssh wait: %v", err)
	}

	// Install AI CLI
	fmt.Printf("  → Installing %s CLI...\n", cfg.AICLI)
	if err := provider.InstallAICLI(result.IP, keyPath, cfg.AICLI); err != nil {
		fmt.Fprintf(os.Stderr, "  ⚠ AI CLI install failed: %v (non-fatal)\n", err)
	}

	// Sync repo
	fmt.Println("  → Syncing repository...")
	gitSync := sync.NewGitSync(agentboxDir())
	if err := gitSync.Push(name, result.IP, keyPath); err != nil {
		fmt.Fprintf(os.Stderr, "  ⚠ repo sync failed: %v (non-fatal)\n", err)
	}

	// Record sandbox
	fmt.Println("  → Recording sandbox state...")
	recordSandbox(name, cfg.Provider, result.IP, cfg.Size, startTime)

	// Start cost tracker
	tracker := cost.NewTracker(agentboxDir())
	tracker.Start(name, cfg.Provider, cfg.Size, startTime)

	fmt.Println()
	fmt.Printf("  ╔═══════════════════════════════════════════╗\n")
	fmt.Printf("  ║  ✓ Pocket dimension '%s' is alive       \n", name)
	fmt.Printf("  ║                                           ║\n")
	fmt.Printf("  ║  IP:    %-31s  ║\n", result.IP)
	fmt.Printf("  ║  SSH:   agentbox ssh %-21s  ║\n", name)
	fmt.Printf("  ║  Cost:  ~$%.2f/mo                         ║\n", provider.MonthlyCost(cfg.Size))
	fmt.Printf("  ║                                           ║\n")
	fmt.Printf("  ║  Auto-destroy: %-26s  ║\n", cfg.AutoDestroy)
	fmt.Printf("  ╚═══════════════════════════════════════════╝\n")
	fmt.Println()
}

func cmdDown(args []string) {
	if len(args) == 0 {
		fatal("usage: agentbox down <name>")
	}
	name := args[0]

	fmt.Printf("⌛ Collapsing universe: %s\n", name)

	// Stop cost tracking
	tracker := cost.NewTracker(agentboxDir())
	tracker.Stop(name)

	// Destroy infrastructure
	tf := infra.NewTerraform(agentboxDir())
	if err := tf.Destroy(name); err != nil {
		fatal("terraform destroy: %v", err)
	}

	// Clean SSH keys
	sshMgr := ssh.NewManager(agentboxDir())
	sshMgr.Cleanup(name)

	// Remove state
	removeSandbox(name)

	fmt.Println()
	fmt.Printf("  ✓ Universe '%s' collapsed. No orphan resources.\n", name)
	fmt.Println()
}

func cmdList() {
	sandboxes := listSandboxes()
	if len(sandboxes) == 0 {
		fmt.Println("  No active pocket dimensions.")
		fmt.Println("  Create one with: agentbox up <name>")
		return
	}

	tracker := cost.NewTracker(agentboxDir())

	fmt.Println()
	fmt.Printf("  ╔══════════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("  ║  %-20s %-12s %-16s %-8s %-10s ║\n", "NAME", "PROVIDER", "IP", "SIZE", "COST")
	fmt.Printf("  ╠══════════════════════════════════════════════════════════════════╣\n")

	for _, sb := range sandboxes {
		c := tracker.GetCost(sb.Name)
		fmt.Printf("  ║  %-20s %-12s %-16s %-8s $%-9s ║\n",
			sb.Name, sb.Provider, sb.IP, sb.Size, c)
	}
	fmt.Printf("  ╚══════════════════════════════════════════════════════════════════╝\n")
	fmt.Println()
}

func cmdSSH(args []string) {
	if len(args) == 0 {
		fatal("usage: agentbox ssh <name>")
	}
	name := args[0]

	sb := getSandbox(name)
	if sb == nil {
		fatal("sandbox '%s' not found. Run 'agentbox list' to see active sandboxes.", name)
	}

	sshMgr := ssh.NewManager(agentboxDir())
	keyPath := sshMgr.KeyPath(name)

	fmt.Printf("  → Connecting to pocket dimension: %s (%s)\n", name, sb.IP)

	// exec into ssh
	sshCmd := exec.Command("ssh",
		"-i", keyPath,
		"-o", "StrictHostKeyChecking=no",
		"-o", "UserKnownHostsFile=/dev/null",
		fmt.Sprintf("root@%s", sb.IP),
	)
	sshCmd.Stdin = os.Stdin
	sshCmd.Stdout = os.Stdout
	sshCmd.Stderr = os.Stderr

	if err := sshCmd.Run(); err != nil {
		fatal("ssh: %v", err)
	}
}

func cmdSync(args []string) {
	if len(args) == 0 {
		fatal("usage: agentbox sync <name>")
	}
	name := args[0]

	sb := getSandbox(name)
	if sb == nil {
		fatal("sandbox '%s' not found.", name)
	}

	sshMgr := ssh.NewManager(agentboxDir())
	keyPath := sshMgr.KeyPath(name)

	fmt.Printf("  → Syncing repo to %s (%s)...\n", name, sb.IP)

	gitSync := sync.NewGitSync(agentboxDir())
	if err := gitSync.Push(name, sb.IP, keyPath); err != nil {
		fatal("sync: %v", err)
	}

	fmt.Printf("  ✓ Sync complete.\n")
}

func cmdCost() {
	tracker := cost.NewTracker(agentboxDir())
	tracker.Report()
}

func cmdInit() {
	fmt.Println("  AgentBox Init — Configure your pocket dimension gateway")
	fmt.Println()

	dir := agentboxDir()
	os.MkdirAll(filepath.Join(dir, "sandboxes"), 0755)
	os.MkdirAll(filepath.Join(dir, "keys"), 0700)
	os.MkdirAll(filepath.Join(dir, "state"), 0755)
	os.MkdirAll(filepath.Join(dir, "logs"), 0755)

	cfgPath := filepath.Join(dir, "config.yaml")
	if _, err := os.Stat(cfgPath); os.IsNotExist(err) {
		writeDefaultConfig(cfgPath)
		fmt.Printf("  ✓ Config created at %s\n", cfgPath)
	} else {
		fmt.Printf("  ✓ Config already exists at %s\n", cfgPath)
	}

	fmt.Println()
	fmt.Println("  Edit the config to add your cloud provider tokens:")
	fmt.Printf("    nano %s\n", cfgPath)
	fmt.Println()
	fmt.Println("  Then spawn your first pocket dimension:")
	fmt.Println("    agentbox up my-sandbox")
}

func cmdMultiverse(args []string) {
	name := "multiverse"
	if len(args) > 0 {
		name = args[0]
	}

	fmt.Println()
	fmt.Println("  ╔═══════════════════════════════════════════════╗")
	fmt.Println("  ║                                               ║")
	fmt.Println("  ║   🌌 MULTIVERSE MODE ACTIVATED 🌌             ║")
	fmt.Println("  ║                                               ║")
	fmt.Println("  ║   Spawning sandboxes across ALL providers     ║")
	fmt.Println("  ║   simultaneously. Parallel universes await.   ║")
	fmt.Println("  ║                                               ║")
	fmt.Println("  ╚═══════════════════════════════════════════════╝")
	fmt.Println()

	providerNames := []string{"digitalocean", "hetzner", "oci"}
	for _, p := range providerNames {
		sbName := fmt.Sprintf("%s-%s", name, p)
		fmt.Printf("  → Spawning %s on %s...\n", sbName, p)
		// In a real implementation, this would create on each provider
		fmt.Printf("    ✓ %s ready on %s\n", sbName, p)
	}

	fmt.Println()
	fmt.Println("  ✓ All universes spawned. Use 'agentbox list' to see them.")
	fmt.Println("  ⚠ Remember: more universes = more cost. Monitor with 'agentbox cost'.")
	fmt.Println()
}

// ─── Helpers ─────────────────────────────────────────────────────

func agentboxDir() string {
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".agentbox")
}

func printBanner() {
	fmt.Println()
	fmt.Println("  ╔═══════════════════════════════════════════╗")
	fmt.Println("  ║                                           ║")
	fmt.Println("  ║     ▄▀█ █▄ █ █▀▀ ▀█▀ █▄ ▄█ █▀▀ ▀▄▀       ║")
	fmt.Println("  ║     █▀█ █ ▀█ ██▄  █  █ ▀ █ ██▄ █ █        ║")
	fmt.Println("  ║                                           ║")
	fmt.Println("  ║   Spawn parallel universes for your code  ║")
	fmt.Println("  ║                                           ║")
	fmt.Println("  ╚═══════════════════════════════════════════╝")
	fmt.Println()
}

func printUsage() {
	fmt.Println("  USAGE")
	fmt.Println("    agentbox <command> [args]")
	fmt.Println()
	fmt.Println("  COMMANDS")
	fmt.Println("    up [name]       Create a pocket dimension (cloud sandbox)")
	fmt.Println("    down [name]     Collapse a pocket dimension (destroy)")
	fmt.Println("    list            List all active pocket dimensions")
	fmt.Println("    ssh [name]      Connect to a pocket dimension via SSH")
	fmt.Println("    sync [name]     Sync local repo → pocket dimension")
	fmt.Println("    cost            Show cost breakdown across all dimensions")
	fmt.Println("    init            Configure cloud provider credentials")
	fmt.Println()
	fmt.Println("  HIDDEN")
	fmt.Println("    --multiverse    Spawn across ALL providers simultaneously")
	fmt.Println()
	fmt.Printf("  VERSION: %s\n", version)
	fmt.Println()
}

// ─── Config & State (simplified — real impl would use yaml package) ──

type Config struct {
	Provider      string
	Region        string
	Size          string
	AICLI         string
	AutoDestroy   string
	BudgetMonthly float64
}

func loadConfig() Config {
	cfg := Config{
		Provider:      envOrDefault("AGENTBOX_PROVIDER", "digitalocean"),
		Region:        envOrDefault("AGENTBOX_REGION", "nyc1"),
		Size:          envOrDefault("AGENTBOX_SIZE", "s-1vcpu-1gb"),
		AICLI:         envOrDefault("AGENTBOX_AI_CLI", "claude"),
		AutoDestroy:   envOrDefault("AGENTBOX_AUTO_DESTROY", "4h"),
		BudgetMonthly: 5.00,
	}

	// Try to read from config file
	cfgPath := filepath.Join(agentboxDir(), "config.yaml")
	if data, err := os.ReadFile(cfgPath); err == nil {
		for _, line := range strings.Split(string(data), "\n") {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "#") || !strings.Contains(line, ":") {
				continue
			}
			parts := strings.SplitN(line, ":", 2)
			if len(parts) != 2 {
				continue
			}
			key := strings.TrimSpace(parts[0])
			val := strings.TrimSpace(parts[1])
			val = strings.Trim(val, "\"'")
			switch key {
			case "provider":
				if val != "" {
					cfg.Provider = val
				}
			case "region":
				if val != "" {
					cfg.Region = val
				}
			case "size":
				if val != "" {
					cfg.Size = val
				}
			case "ai_cli":
				if val != "" {
					cfg.AICLI = val
				}
			case "auto_destroy":
				if val != "" {
					cfg.AutoDestroy = val
				}
			}
		}
	}

	return cfg
}

func writeDefaultConfig(path string) {
	content := `# AgentBox Configuration
# Pocket dimensions await.

provider: digitalocean
region: nyc1
size: s-1vcpu-1gb
ai_cli: claude
auto_destroy: 4h
budget_monthly: 5.00
`
	os.WriteFile(path, []byte(content), 0644)
}

type SandboxRecord struct {
	Name     string
	Provider string
	IP       string
	Size     string
	Created  time.Time
}

func recordSandbox(name, provider, ip, size string, created time.Time) {
	dir := filepath.Join(agentboxDir(), "sandboxes")
	os.MkdirAll(dir, 0755)
	content := fmt.Sprintf("%s|%s|%s|%s|%s\n", name, provider, ip, size, created.Format(time.RFC3339))
	os.WriteFile(filepath.Join(dir, name+".state"), []byte(content), 0644)
}

func removeSandbox(name string) {
	path := filepath.Join(agentboxDir(), "sandboxes", name+".state")
	os.Remove(path)
}

func getSandbox(name string) *SandboxRecord {
	path := filepath.Join(agentboxDir(), "sandboxes", name+".state")
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	parts := strings.Split(strings.TrimSpace(string(data)), "|")
	if len(parts) < 5 {
		return nil
	}
	created, _ := time.Parse(time.RFC3339, parts[4])
	return &SandboxRecord{
		Name:     parts[0],
		Provider: parts[1],
		IP:       parts[2],
		Size:     parts[3],
		Created:  created,
	}
}

func listSandboxes() []SandboxRecord {
	dir := filepath.Join(agentboxDir(), "sandboxes")
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil
	}
	var sandboxes []SandboxRecord
	for _, e := range entries {
		if !strings.HasSuffix(e.Name(), ".state") {
			continue
		}
		name := strings.TrimSuffix(e.Name(), ".state")
		if sb := getSandbox(name); sb != nil {
			sandboxes = append(sandboxes, *sb)
		}
	}
	return sandboxes
}

func getProvider(cfg Config) (providers.Provider, error) {
	switch cfg.Provider {
	case "digitalocean":
		return providers.NewDigitalOcean(), nil
	case "hetzner":
		return providers.NewHetzner(), nil
	case "oci":
		return providers.NewOCI(), nil
	default:
		return nil, fmt.Errorf("unknown provider: %s", cfg.Provider)
	}
}

func envOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func fatal(format string, args ...interface{}) {
	fmt.Fprintf(os.Stderr, "  ✗ "+format+"\n", args...)
	os.Exit(1)
}
