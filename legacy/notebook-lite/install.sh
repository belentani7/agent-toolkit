#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  notebook-lite installer
#  Sets up dependencies, downloads embedding model, initializes DB
# ═══════════════════════════════════════════════════════════════
set -e

NOTEBOOK_DIR="$HOME/.notebook-lite"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_banner() {
    echo -e "${CYAN}"
    cat "$SCRIPT_DIR/ascii/notebook.txt" 2>/dev/null || echo "
  ╔══════════════════════════════════════╗
  ║          n o t e b o o k             ║
  ║            — l i t e —               ║
  ║                                      ║
  ║   Your docs. Your questions.         ║
  ║   No cloud. No tracking.             ║
  ╚══════════════════════════════════════╝"
    echo -e "${NC}"
}

check_python() {
    echo -e "${BLUE}▸ Checking Python...${NC}"
    if command -v python3 &>/dev/null; then
        PY="python3"
    elif command -v python &>/dev/null; then
        PY="python"
    else
        echo -e "${RED}✗ Python not found. Install Python 3.7+ first.${NC}"
        exit 1
    fi

    VERSION=$($PY --version 2>&1 | grep -oP '\d+\.\d+')
    MAJOR=$(echo "$VERSION" | cut -d. -f1)
    MINOR=$(echo "$VERSION" | cut -d. -f2)

    if [[ "$MAJOR" -lt 3 ]] || [[ "$MAJOR" -eq 3 && "$MINOR" -lt 7 ]]; then
        echo -e "${RED}✗ Python $VERSION found, need 3.7+${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Python $VERSION${NC}"
}

create_dirs() {
    echo -e "${BLUE}▸ Creating notebook directory...${NC}"
    mkdir -p "$NOTEBOOK_DIR"
    mkdir -p "$NOTEBOOK_DIR/data"
    mkdir -p "$NOTEBOOK_DIR/models"
    mkdir -p "$NOTEBOOK_DIR/exports"
    echo -e "${GREEN}✓ $NOTEBOOK_DIR${NC}"
}

install_deps() {
    echo -e "${BLUE}▸ Installing Python dependencies...${NC}"
    $PY -m pip install --upgrade pip --quiet
    $PY -m pip install -r "$SCRIPT_DIR/requirements.txt" --quiet
    echo -e "${GREEN}✓ Dependencies installed${NC}"
}

download_model() {
    echo -e "${BLUE}▸ Downloading embedding model (all-MiniLM-L6-v2, ~80MB)...${NC}"
    $PY -c "
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
print('Model downloaded and cached.')
" 2>/dev/null || echo -e "${YELLOW}⚠ Model download will happen on first use.${NC}"
    echo -e "${GREEN}✓ Embedding model ready${NC}"
}

init_database() {
    echo -e "${BLUE}▸ Initializing database...${NC}"
    $PY -c "
import sys
sys.path.insert(0, '$SCRIPT_DIR')
from engine.indexer import Indexer
indexer = Indexer('$NOTEBOOK_DIR')
indexer.close()
print('Database initialized.')
" 2>/dev/null || echo -e "${YELLOW}⚠ Database will initialize on first use.${NC}"
    echo -e "${GREEN}✓ Database ready${NC}"
}

install_config() {
    echo -e "${BLUE}▸ Installing default config...${NC}"
    if [[ ! -f "$NOTEBOOK_DIR/config.yaml" ]]; then
        cp "$SCRIPT_DIR/config/default.yaml" "$NOTEBOOK_DIR/config.yaml"
        echo -e "${GREEN}✓ Config installed at $NOTEBOOK_DIR/config.yaml${NC}"
    else
        echo -e "${YELLOW}  Config already exists, keeping it.${NC}"
    fi
}

install_cli() {
    echo -e "${BLUE}▸ Setting up CLI...${NC}"
    if [[ -f "$SCRIPT_DIR/notebook-lite" ]]; then
        chmod +x "$SCRIPT_DIR/notebook-lite"
    fi
    echo -e "${GREEN}✓ CLI ready${NC}"
    echo ""
    echo -e "${YELLOW}Add this to your PATH or create a symlink:${NC}"
    echo -e "  ${CYAN}sudo ln -s $SCRIPT_DIR/notebook-lite /usr/local/bin/notebook-lite${NC}"
    echo ""
    echo -e "${YELLOW}Or add an alias to your shell config:${NC}"
    echo -e "  ${CYAN}alias notebook-lite='python3 $SCRIPT_DIR/notebook-lite'${NC}"
}

print_done() {
    echo ""
    echo -e "${GREEN}${BOLD}═══════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}  ✓ notebook-lite installed successfully!${NC}"
    echo -e "${GREEN}${BOLD}═══════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${BOLD}Quick start:${NC}"
    echo -e "  ${CYAN}notebook-lite add document.pdf${NC}    — add a document"
    echo -e "  ${CYAN}notebook-lite ask \"your question\"${NC}  — ask something"
    echo -e "  ${CYAN}notebook-lite chat${NC}                — interactive mode"
    echo ""
    echo -e "  ${BOLD}Optional: Install Ollama for offline LLM:${NC}"
    echo -e "  ${CYAN}curl -fsSL https://ollama.ai/install.sh | sh${NC}"
    echo -e "  ${CYAN}ollama pull llama3.2${NC}"
    echo ""
    echo -e "  ${DIM}Your memory palace awaits.${NC}"
    echo ""
}

# ─── Main ──────────────────────────────────────────────────────
main() {
    print_banner
    check_python
    create_dirs
    install_deps
    init_database
    download_model
    install_config
    install_cli
    print_done
}

main "$@"
