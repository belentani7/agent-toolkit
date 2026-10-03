// Package cost tracks sandbox uptime and calculates cost
// across all pocket dimensions.
package cost

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// Rates maps provider+size to hourly cost in USD.
var Rates = map[string]float64{
	// DigitalOcean
	"digitalocean/s-1vcpu-1gb":  4.00 / 720,  // ~$0.0056/hr
	"digitalocean/s-1vcpu-2gb":  6.00 / 720,  // ~$0.0083/hr
	"digitalocean/s-2vcpu-2gb":  12.00 / 720,
	"digitalocean/s-2vcpu-4gb":  24.00 / 720,
	"digitalocean/s-4vcpu-8gb":  48.00 / 720,

	// Hetzner (EUR→USD approximate)
	"hetzner/s-1vcpu-1gb":  3.79 / 720,  // ~$0.0053/hr
	"hetzner/s-1vcpu-2gb":  4.51 / 720,
	"hetzner/s-2vcpu-4gb":  8.90 / 720,
	"hetzner/s-4vcpu-8gb":  15.90 / 720,

	// OCI Always Free
	"oci/s-1vcpu-1gb": 0.00,
	"oci/arm-flex":    0.00,
	"oci/micro":       0.00,
	"oci/s-2vcpu-4gb": 7.50 / 720,
}

// Entry is a single cost-tracking record.
type Entry struct {
	Name     string    `json:"name"`
	Provider string    `json:"provider"`
	Size     string    `json:"size"`
	Started  time.Time `json:"started"`
	Stopped  time.Time `json:"stopped,omitempty"`
	HourRate float64   `json:"hour_rate"`
}

// Tracker manages cost records for all sandboxes.
type Tracker struct {
	baseDir  string
	entries  []Entry
	filePath string
}

// NewTracker creates a cost tracker.
func NewTracker(baseDir string) *Tracker {
	t := &Tracker{
		baseDir:  baseDir,
		filePath: filepath.Join(baseDir, "costs.json"),
	}
	t.load()
	return t
}

// Start begins tracking cost for a sandbox.
func (t *Tracker) Start(name, provider, size string, started time.Time) {
	key := fmt.Sprintf("%s/%s", provider, size)
	rate, ok := Rates[key]
	if !ok {
		rate = 4.00 / 720 // default DO rate
	}

	// Remove existing entry for this name (restart)
	t.removeByName(name)

	t.entries = append(t.entries, Entry{
		Name:     name,
		Provider: provider,
		Size:     size,
		Started:  started,
		HourRate: rate,
	})
	t.save()
}

// Stop ends tracking for a sandbox and records final cost.
func (t *Tracker) Stop(name string) {
	now := time.Now()
	for i := range t.entries {
		if t.entries[i].Name == name && t.entries[i].Stopped.IsZero() {
			t.entries[i].Stopped = now
		}
	}
	t.save()
}

// GetCost returns the current cost string for a sandbox.
func (t *Tracker) GetCost(name string) string {
	for _, e := range t.entries {
		if e.Name == name && e.Stopped.IsZero() {
			hours := time.Since(e.Started).Hours()
			cost := e.HourRate * hours
			return fmt.Sprintf("%.4f", cost)
		}
	}
	return "0.0000"
}

// Report prints a cost breakdown table for all tracked sandboxes.
func (t *Tracker) Report() {
	if len(t.entries) == 0 {
		fmt.Println("  No cost data. Spawn a pocket dimension first.")
		return
	}

	now := time.Now()

	var totalCost float64
	var activeCount, stoppedCount int

	fmt.Println()
	fmt.Printf("  ╔══════════════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("  ║  %-20s %-10s %-8s %-10s %10s ║\n",
		"NAME", "PROVIDER", "SIZE", "UPTIME", "COST")
	fmt.Printf("  ╠══════════════════════════════════════════════════════════════════════╣\n")

	for _, e := range t.entries {
		var uptime time.Duration
		if e.Stopped.IsZero() {
			uptime = now.Sub(e.Started)
			activeCount++
		} else {
			uptime = e.Stopped.Sub(e.Started)
			stoppedCount++
		}

		hours := uptime.Hours()
		cost := e.HourRate * hours
		totalCost += cost

		uptimeStr := formatDuration(uptime)
		nameDisplay := e.Name
		if e.Stopped.IsZero() {
			nameDisplay = "● " + e.Name // active indicator
		} else {
			nameDisplay = "○ " + e.Name // stopped
		}

		fmt.Printf("  ║  %-20s %-10s %-8s %-10s $%9.4f ║\n",
			nameDisplay, e.Provider, e.Size, uptimeStr, cost)
	}

	fmt.Printf("  ╠══════════════════════════════════════════════════════════════════════╣\n")
	fmt.Printf("  ║  TOTAL: %d active, %d stopped — $%.4f                          ║\n",
		activeCount, stoppedCount, totalCost)
	fmt.Printf("  ╚══════════════════════════════════════════════════════════════════════╝\n")

	// Budget check
	budget := t.loadBudget()
	if budget > 0 {
		used := totalCost
		remaining := budget - used
		pct := (used / budget) * 100

		fmt.Println()
		fmt.Printf("  Budget: $%.2f/mo  │  Used: $%.4f  │  Remaining: $%.4f", budget, used, remaining)
		if pct > 80 {
			fmt.Printf("  ⚠ WARNING: %.0f%% of budget used!", pct)
		}
		fmt.Println()
	}

	fmt.Println()
}

// MonthlyProjection estimates the end-of-month cost at current rate.
func (t *Tracker) MonthlyProjection() float64 {
	var hourlyTotal float64
	for _, e := range t.entries {
		if e.Stopped.IsZero() {
			hourlyTotal += e.HourRate
		}
	}

	// Days remaining in current month
	now := time.Now()
	endOfMonth := time.Date(now.Year(), now.Month()+1, 1, 0, 0, 0, 0, now.Location())
	remainingHours := endOfMonth.Sub(now).Hours()

	return hourlyTotal * remainingHours
}

// ─── Private ─────────────────────────────────────────────────────

func (t *Tracker) load() {
	data, err := os.ReadFile(t.filePath)
	if err != nil {
		return
	}
	json.Unmarshal(data, &t.entries)
}

func (t *Tracker) save() {
	data, _ := json.MarshalIndent(t.entries, "", "  ")
	os.MkdirAll(filepath.Dir(t.filePath), 0755)
	os.WriteFile(t.filePath, data, 0644)
}

func (t *Tracker) removeByName(name string) {
	filtered := make([]Entry, 0, len(t.entries))
	for _, e := range t.entries {
		if e.Name != name {
			filtered = append(filtered, e)
		}
	}
	t.entries = filtered
}

func (t *Tracker) loadBudget() float64 {
	// Read from config
	cfgPath := filepath.Join(t.baseDir, "config.yaml")
	data, err := os.ReadFile(cfgPath)
	if err != nil {
		return 5.00 // default
	}
	// Simple parse
	content := string(data)
	idx := indexOf(content, "budget_monthly:")
	if idx == -1 {
		return 5.00
	}
	rest := content[idx+15:]
	var budget float64
	fmt.Sscanf(rest, "%f", &budget)
	if budget <= 0 {
		return 5.00
	}
	return budget
}

func formatDuration(d time.Duration) string {
	hours := int(d.Hours())
	minutes := int(d.Minutes()) % 60

	if hours > 24 {
		days := hours / 24
		hours = hours % 24
		return fmt.Sprintf("%dd %dh", days, hours)
	}
	if hours > 0 {
		return fmt.Sprintf("%dh %dm", hours, minutes)
	}
	return fmt.Sprintf("%dm", minutes)
}

func indexOf(s, substr string) int {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return i
		}
	}
	return -1
}
