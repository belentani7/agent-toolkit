<p align="center">
  <pre>
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║     ▄▀█ █▄ █ █▀▀ ▀█▀ █▄ ▄█ █▀▀ ▀▄▀       ║
    ║     █▀█ █ ▀█ ██▄  █  █ ▀ █ ██▄ █ █        ║
    ║                                           ║
    ║   Spawn parallel universes for your code  ║
    ╚═══════════════════════════════════════════╝
  </pre>
</p>

<p align="center">
  <strong>Disposable cloud sandboxes for AI agents. One command. $4/month. Zero risk.</strong>
</p>

---

## What is AgentBox?

AgentBox spins up **pocket dimensions** — isolated cloud VMs where your AI agents can work without touching your machine. Think Docker, but full virtual machines. Think parallel universes, where each branch of your code evolves independently.

```
you ──→ agentbox up ──→ 🌌 pocket dimension created
                         ├── $4/mo droplet
                         ├── your repo cloned
                         ├── AI CLI installed
                         └── SSH tunnel ready
```

**Why?** Because AI agents shouldn't have `rm -rf /` access to your laptop. Give them a sandbox. A cheap, disposable, fully isolated sandbox.

---

## Install

```bash
# One-line install
curl -fsSL https://raw.githubusercontent.com/agentbox/agentbox/main/install.sh | bash

# Or via Go
go install github.com/agentbox/agentbox@latest

# Verify
agentbox --version
```

### Prerequisites
- Go 1.21+
- Terraform 1.5+ (auto-installed by `install.sh`)
- A cloud provider API key (DigitalOcean, Hetzner, or OCI)

---

## Quick Start

```bash
# 1. Configure your provider
agentbox init

# 2. Spawn a sandbox (a new universe for your code)
agentbox up my-experiment

# 3. Connect to it
agentbox ssh my-experiment

# 4. When done — collapse the universe
agentbox down my-experiment
```

That's it. From zero to isolated cloud VM in under 60 seconds.

---

## Commands

| Command | Description |
|---------|-------------|
| `agentbox up [name]` | Create a new sandbox (pocket dimension) |
| `agentbox down [name]` | Destroy a sandbox (collapse the universe) |
| `agentbox list` | List all active sandboxes |
| `agentbox ssh [name]` | SSH into a sandbox |
| `agentbox sync [name]` | Sync local repo → sandbox |
| `agentbox cost` | Show cost breakdown across all sandboxes |
| `agentbox init` | Configure cloud provider credentials |

### Hidden Commands
| Command | Description |
|---------|-------------|
| `agentbox --multiverse` | Spawn sandboxes across ALL providers simultaneously |

---

## Supported Providers

| Provider | Min Cost | Free Tier | Best For |
|----------|----------|-----------|----------|
| **DigitalOcean** | $4/mo | — | Quick experiments |
| **Hetzner** | €3.79/mo | — | Best price/performance |
| **Oracle Cloud (OCI)** | $0/mo | Always Free ARM | Cost-zero sandboxes |

---

## Cost Tracking

AgentBox tracks every second of sandbox uptime. Run `agentbox cost` to see:

```
╔══════════════════════════════════════════════╗
║  SANDBOX           UPTIME      COST          ║
╠══════════════════════════════════════════════╣
║  my-experiment     2h 34m      $0.014        ║
║  feature-auth      45m         $0.004        ║
║  bugfix-#421       1h 12m      $0.007        ║
╠══════════════════════════════════════════════╣
║  TOTAL             4h 31m      $0.025        ║
╚══════════════════════════════════════════════╝

  Budget: $5.00/mo  │  Used: $0.025  │  Remaining: $4.975
```

Set a budget in `~/.agentbox/config.yaml` and get alerts before you overspend.

---

## Configuration

Default config lives at `~/.agentbox/config.yaml`:

```yaml
provider: digitalocean
region: nyc1
size: s-1vcpu-1gb
ai_cli: claude
auto_destroy: 4h
budget_monthly: 5.00
```

### Multi-Provider Setup

Run sandboxes across providers for redundancy or cost optimization:

```yaml
providers:
  digitalocean:
    token: $DO_TOKEN
    region: nyc1
    default: true
  hetzner:
    token: $HETZNER_TOKEN
    region: fsn1
  oci:
    tenancy_ocid: ocid1.tenancy...
    compartment_ocid: ocid1.compartment...
    region: us-ashburn-1
```

---

## How It Works

```
agentbox up my-sandbox
  │
  ├── 1. Generate SSH keypair (ed25519)
  ├── 2. Generate Terraform config
  ├── 3. terraform apply (create VM)
  ├── 4. Wait for SSH ready
  ├── 5. Install AI CLI (claude/aider/codex)
  ├── 6. Clone your repo
  ├── 7. Establish SSH tunnel
  └── ✅ Pocket dimension ready
```

```
agentbox down my-sandbox
  │
  ├── 1. terraform destroy
  ├── 2. Clean SSH keys
  ├── 3. Remove state files
  └── ✅ Universe collapsed. No orphan resources.
```

---

## Architecture

```
agentbox/
├── main.go              # CLI entry point
├── providers/
│   ├── digitalocean.go  # DigitalOcean droplet provider
│   ├── hetzner.go       # Hetzner cloud provider
│   └── oci.go           # Oracle Cloud free tier provider
├── infra/
│   └── terraform.go     # Terraform config generation & execution
├── ssh/
│   └── manager.go       # SSH key management & connections
├── sync/
│   └── git.go           # Git-based repo sync
├── cost/
│   └── tracker.go       # Uptime & cost tracking
├── config/
│   └── default.yaml     # Default configuration
├── ascii/
│   └── box.txt          # ASCII art
└── examples/
    └── multi-provider.yaml
```

---

## Security

- **SSH key-only** — no passwords, ever
- **Ed25519 keys** — generated per-sandbox, destroyed on teardown
- **No shared credentials** — each sandbox gets its own API scope
- **`.env` never synced** — secrets stay on your machine
- **Auto-destroy** — sandboxes self-destruct after configured TTL

---

## The Lore

> *"Every `agentbox up` tears a small hole in the fabric of compute-space.
> Through that hole, a new universe blooms — a parallel dimension where
> your code can evolve, mutate, and be tested without consequence to
> the prime timeline. When the experiment is done, you collapse the
> dimension. No trace. No orphan resources. Just pure, ephemeral compute."*

---

## Contributing

1. Fork the repo
2. `agentbox up my-feature` (practice what you preach)
3. Make your changes
4. `agentbox down my-feature` (collapse your dev universe)
5. Open a PR

---

## License

MIT — See [LICENSE](LICENSE) for details.

---

<p align="center">
  <em>The cloud is infinite compute at your fingertips.<br>
  AgentBox makes it disposable.</em>
</p>
