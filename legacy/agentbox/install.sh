#!/usr/bin/env bash
# AgentBox Installer
# Spawns pocket dimensions for your AI agents
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

banner() {
  echo -e "${CYAN}"
  echo '  ╔═══════════════════════════════════════════╗'
  echo '  ║                                           ║'
  echo '  ║     ▄▀█ █▄ █ █▀▀ ▀█▀ █▄ ▄█ █▀▀ ▀▄▀       ║'
  echo '  ║     █▀█ █ ▀█ ██▄  █  █ ▀ █ ██▄ █ █        ║'
  echo '  ║                                           ║'
  echo '  ║   Spawn parallel universes for your code  ║'
  echo '  ╚═══════════════════════════════════════════╝'
  echo -e "${NC}"
}

info()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
err()   { echo -e "${RED}[✗]${NC} $1"; exit 1; }

AGENTBOX_DIR="${HOME}/.agentbox"
CONFIG_FILE="${AGENTBOX_DIR}/config.yaml"

banner
echo "  Installing AgentBox — disposable cloud sandboxes for AI agents"
echo ""

# ─── Check Go ────────────────────────────────────────────────────
echo -n "  Checking Go... "
if command -v go &>/dev/null; then
    GO_VERSION=$(go version | grep -oP '\d+\.\d+')
    MAJOR=$(echo "$GO_VERSION" | cut -d. -f1)
    MINOR=$(echo "$GO_VERSION" | cut -d. -f2)
    if [ "$MAJOR" -ge 1 ] && [ "$MINOR" -ge 21 ]; then
        info "Go ${GO_VERSION} found"
    else
        err "Go ${GO_VERSION} found, but 1.21+ required. Upgrade: https://go.dev/dl/"
    fi
else
    warn "Go not found"
    echo ""
    echo "  Install Go 1.21+ first:"
    echo "    macOS:  brew install go"
    echo "    Linux:  snap install go --classic"
    echo "    Or:     https://go.dev/dl/"
    exit 1
fi

# ─── Check Terraform ────────────────────────────────────────────
echo -n "  Checking Terraform... "
if command -v terraform &>/dev/null; then
    TF_VERSION=$(terraform version -json 2>/dev/null | grep -oP '"terraform_version":"[^"]+"' | cut -d'"' -f4 || terraform version | head -1 | grep -oP '\d+\.\d+')
    info "Terraform ${TF_VERSION} found"
else
    warn "Terraform not found — installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install terraform 2>/dev/null || err "Install Terraform manually: https://developer.hashicorp.com/terraform/downloads"
    elif [[ "$OSTYPE" == "linux"* ]]; then
        wget -qO- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg 2>/dev/null
        echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list >/dev/null
        sudo apt update && sudo apt install -y terraform
    else
        err "Auto-install not supported on this OS. Install manually: https://developer.hashicorp.com/terraform/downloads"
    fi
    info "Terraform installed"
fi

# ─── Check SSH ──────────────────────────────────────────────────
echo -n "  Checking SSH... "
if command -v ssh &>/dev/null && command -v ssh-keygen &>/dev/null; then
    info "SSH tools found"
else
    err "SSH not found. Install OpenSSH."
fi

# ─── Create config directory ────────────────────────────────────
echo -n "  Setting up ${AGENTBOX_DIR}... "
mkdir -p "${AGENTBOX_DIR}"/{sandboxes,keys,state,logs}
info "created"

# ─── Default config ─────────────────────────────────────────────
if [ ! -f "$CONFIG_FILE" ]; then
    echo -n "  Writing default config... "
    cat > "$CONFIG_FILE" << 'EOF'
# AgentBox Configuration
# Pocket dimensions await.

provider: digitalocean
region: nyc1
size: s-1vcpu-1gb
ai_cli: claude          # claude | aider | codex
auto_destroy: 4h        # sandbox self-destruct timer
budget_monthly: 5.00    # USD — alert when approaching limit

# SSH settings
ssh:
  key_type: ed25519
  port: 22

# Provider credentials (set via environment or fill in below)
providers:
  digitalocean:
    token: ""           # or set DO_TOKEN env var
    regions:
      - nyc1
      - sfo3
      - ams3
  hetzner:
    token: ""           # or set HETZNER_TOKEN env var
    regions:
      - fsn1
      - nbg1
      - hel1
  oci:
    tenancy_ocid: ""
    compartment_ocid: ""
    user_ocid: ""
    fingerprint: ""
    key_file: ""
    region: us-ashburn-1
EOF
    info "written to ${CONFIG_FILE}"
else
    info "config already exists — skipping"
fi

# ─── Install agentbox binary ────────────────────────────────────
echo -n "  Installing agentbox... "
if [ -f "go.mod" ] && [ "$(pwd)" != "${HOME}" ]; then
    # Local install from source
    go install . 2>/dev/null && info "installed from source" || {
        go build -o "${AGENTBOX_DIR}/bin/agentbox" . 2>/dev/null
        export PATH="${AGENTBOX_DIR}/bin:${PATH}"
        info "built to ${AGENTBOX_DIR}/bin/agentbox"
    }
else
    go install github.com/agentbox/agentbox@latest 2>/dev/null && info "installed via go install" || {
        warn "go install failed — clone the repo and run: go install ."
    }
fi

# ─── Configure cloud credentials ───────────────────────────────
echo ""
echo -e "  ${CYAN}── Cloud Provider Setup ──${NC}"
echo ""

configure_provider() {
    local provider="$1"
    local var_name="$2"
    local prompt="$3"

    if [ -n "${!var_name:-}" ]; then
        info "${provider}: token found in \$${var_name}"
    else
        echo -n "  ${prompt} (press Enter to skip): "
        read -r token
        if [ -n "$token" ]; then
            sed -i.bak "s|${var_name}: \"\"|${var_name}: \"${token}\"|" "$CONFIG_FILE" 2>/dev/null || true
            info "${provider}: token saved to config"
        else
            warn "${provider}: skipped — set ${var_name} later in config or env"
        fi
    fi
}

echo "  Which provider do you want to configure?"
echo "    1) DigitalOcean  (\$4/mo droplets)"
echo "    2) Hetzner       (€3.79/mo servers)"
echo "    3) Oracle Cloud  (always-free ARM instances)"
echo "    4) Skip for now"
echo ""
echo -n "  Choice [1-4]: "
read -r choice

case "${choice:-4}" in
    1) configure_provider "DigitalOcean" "DO_TOKEN" "Enter your DigitalOcean API token" ;;
    2) configure_provider "Hetzner" "HETZNER_TOKEN" "Enter your Hetzner Cloud API token" ;;
    3)
        echo "  OCI requires several OCIDs. Run 'agentbox init' after install to configure."
        warn "OCI: skipped — run 'agentbox init' to set up"
        ;;
    *) warn "Skipping provider setup" ;;
esac

# ─── Done ───────────────────────────────────────────────────────
echo ""
echo -e "  ${GREEN}╔═══════════════════════════════════════════════╗${NC}"
echo -e "  ${GREEN}║                                               ║${NC}"
echo -e "  ${GREEN}║   ✓ AgentBox installed                        ║${NC}"
echo -e "  ${GREEN}║                                               ║${NC}"
echo -e "  ${GREEN}║   Next steps:                                 ║${NC}"
echo -e "  ${GREEN}║     1. Set your cloud provider token          ║${NC}"
echo -e "  ${GREEN}║     2. agentbox up my-first-sandbox           ║${NC}"
echo -e "  ${GREEN}║     3. agentbox ssh my-first-sandbox          ║${NC}"
echo -e "  ${GREEN}║     4. agentbox down my-first-sandbox         ║${NC}"
echo -e "  ${GREEN}║                                               ║${NC}"
echo -e "  ${GREEN}║   The multiverse awaits.                      ║${NC}"
echo -e "  ${GREEN}╚═══════════════════════════════════════════════╝${NC}"
echo ""
