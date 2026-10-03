#!/usr/bin/env bash
# scripts/launch.sh — Unified launcher for the Workflow Orchestrator
# Usage: ./scripts/launch.sh [start|single|kanban|dashboard|health] [--task NAME] [--type TYPE]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."

python src/main.py "$@"
