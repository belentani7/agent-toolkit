# scripts/kanban_update.sh — Update kanban board status
# Usage: ./scripts/kanban_update.sh [add|move|done] [task_id] [column]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."

ACTION="${1:-help}"
KANBAN_FILE=".kanban/kanban.yaml"

case "$ACTION" in
  add)
    echo "Add task to kanban — implement with task_id and column"
    ;;
  move)
    echo "Move task between columns"
    ;;
  done)
    echo "Mark task as done"
    ;;
  help|*)
    echo "Kanban Board Commands:"
    echo "  ./scripts/kanban_update.sh add <task_id> <column>"
    echo "  ./scripts/kanban_update.sh move <task_id> <column>"
    echo "  ./scripts/kanban_update.sh done <task_id>"
    echo "  ./scripts/kanban_update.sh status"
    ;;
esac
