#!/usr/bin/env python3
"""
Workflow Orchestrator - Main Entry Point
Central nervous system for the Belentani ecosystem.
Integrates: MetaSkill, OmniRoute, Multi-CLI, Secure-t, Agentguard, Validator, Monitor
"""
import os
import sys
import json
import yaml
import argparse
import subprocess
from datetime import datetime
from typing import Optional

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.priority_engine import PriorityEngine, RankedQueue
from src.router import Router, RouteDecision
from src.cli_launcher import CLILauncher
from src.executor import Executor, ExecutionResult
from src.agentguard import Agentguard, BudgetStatus
from src.secure_t_pipeline import SecureTPipeline
from src.validator import Validator, ValidationReport
from src.monitor import Monitor, HealthReport


class WorkflowOrchestrator:
    def __init__(self, config_path: str = "config/orchestrator.yaml"):
        self.config_path = config_path
        self.config = self._load_config()
        self.priority_engine = PriorityEngine(
            projects_path=os.path.expanduser("~/meta_projects.json"),
            shared_context_path=os.path.expanduser("~/.belentani/shared-context/projects.json"),
        )
        self.router = Router(
            omniroute_endpoint=self.config.get("router", {}).get("omniroute_endpoint", "http://localhost:20128/v1")
        )
        self.cli_launcher = CLILauncher()
        self.executor = Executor()
        self.agentguard = Agentguard(plan_limit=100.0)
        self.validator = Validator()
        self.monitor = Monitor()
        self.secure_t = SecureTPipeline()
        self.running = False

    def _load_config(self) -> dict:
        if os.path.exists(self.config_path):
            with open(self.config_path) as f:
                return yaml.safe_load(f) or {}
        return {}

    def start(self):
        self.running = True
        print(f"[{datetime.now().isoformat()}] Workflow Orchestrator starting...")

        # Phase 1: Generate priority queue
        print("\n[1/7] Generating priority queue...")
        queue = self.priority_engine.generate_queue()
        self.priority_engine.save_queue(queue, "config/priority_queue.json")
        print(f"  -> {queue.total_tasks} tasks ranked (top 3: {[t.name for t in queue.tasks[:3]]})")

        # Phase 2: Route all tasks
        print("\n[2/7] Routing tasks to models and CLIs...")
        tasks_data = [{"id": t.id, "name": t.name, "type": t.type} for t in queue.tasks[:10]]
        routes = self.router.route_batch(tasks_data)
        self.router.save_routes("config/routing_plan.json", routes)
        print(f"  -> {len(routes)} routes generated")

        # Phase 3: Check budget
        print("\n[3/7] Checking budget status...")
        budget = self.agentguard.get_dashboard()
        print(f"  -> Budget: {budget['usage_percent']:.1f}% used | Status: {budget['status']}")
        if budget["status"] == "BUDGET EXCEEDED":
            print("  -> BUDGET EXCEEDED - auto-pause active")

        # Phase 4: Execute highest priority tasks
        print("\n[4/7] Executing highest priority tasks...")
        for task in queue.tasks[:3]:
            if not self.agentguard.approve_task(task.score):
                print(f"  -> Skipped {task.name} - budget exceeded")
                continue
            route = self.router.route(task.id, task.name, task.type)
            cli_cmd = self.cli_launcher.get_cli_command(route.cli, route)
            print(f"  -> {task.name}: {route.cli} / {route.model} (est: {route.estimated_time}s)")

        # Phase 5: Run secure-t pipeline on code tasks
        print("\n[5/7] Running secure-t pipeline on code tasks...")
        code_tasks = [t for t in queue.tasks if t.type in ["backend", "frontend", "web_app"]]
        for task in code_tasks[:2]:
            result = self.secure_t.run(task.id, f"https://github.com/belentani7/{task.id}")
            print(f"  -> {task.name}: Secure-t status = {result.overall_status}")

        # Phase 6: Validate outputs
        print("\n[6/7] Validating outputs...")
        for task in queue.tasks[:3]:
            report = self.validator.validate(task.id, "", task.type)
            icon = "[+]" if report.overall_passed else "[-]"
            print(f"  {icon} {task.name}: score={report.overall_score:.2f}")

        # Phase 7: Monitor health
        print("\n[7/7] Running health checks...")
        health = self.monitor.run_checks()
        self.monitor.save_report(health, "config/health_report.json")
        icon = "[+]" if health.overall_status == "healthy" else "[-]"
        print(f"  {icon} Health: {health.overall_status} | Uptime: {health.uptime_percent:.1f}%")

        # Save execution log
        self._save_status()
        print(f"\n[{datetime.now().isoformat()}] Orchestration complete.")

    def run_single_task(self, task_name: str, task_type: str):
        """Execute a single task through the full pipeline."""
        print(f"[{datetime.now().isoformat()}] Running: {task_name}")

        # Check budget
        if not self.agentguard.approve_task(1.0):
            print("[WARN]  Budget exceeded - task rejected")
            return None

        # Route
        route = self.router.route("single", task_name, task_type)
        print(f"  Route: {route.cli} / {route.model}")

        # Execute
        dispatch = self.cli_launcher.dispatch(task_name, task_type)
        result = self.cli_launcher.execute(dispatch)
        print(f"  Status: {result['status']}")

        # Secure-t if code
        if route.archetype.value in ["code", "backend", "frontend", "security"]:
            st_result = self.secure_t.run("single", route.cli)
            print(f"  Secure-t: {st_result.overall_status}")

        # Validate
        report = self.validator.validate("single", result.get("stdout", ""), task_type)
        print(f"  Validation: {'PASSED' if report.overall_passed else 'FAILED'}")

        # Monitor
        health = self.monitor.run_checks()
        print(f"  Health: {health.overall_status}")

        return result

    def kanban_status(self):
        """Show current kanban board status."""
        kanban_path = ".kanban/kanban.yaml"
        if os.path.exists(kanban_path):
            with open(kanban_path) as f:
                print(f.read())
        else:
            print("No kanban board found")

    def dashboard(self):
        """Show full dashboard."""
        budget = self.agentguard.get_dashboard()
        health_path = "config/health_report.json"
        priority_path = "config/priority_queue.json"

        health = {}
        if os.path.exists(health_path):
            with open(health_path) as f:
                health = json.load(f)

        priority = {}
        if os.path.exists(priority_path):
            with open(priority_path) as f:
                priority = json.load(f)

        dashboard = {
            "timestamp": datetime.now().isoformat(),
            "budget": budget,
            "health": health,
            "priority_queue": priority,
            "executions": len(self.executor.execution_history),
        }
        return dashboard

    def _save_status(self):
        status = {
            "orchestrator": "running",
            "last_run": datetime.now().isoformat(),
            "config_path": self.config_path,
            "components": {
                "priority_engine": "active",
                "router": "active",
                "cli_launcher": "active",
                "executor": "active",
                "agentguard": "active",
                "secure_t": "active",
                "validator": "active",
                "monitor": "active",
            },
        }
        with open("config/orchestrator_status.json", "w") as f:
            json.dump(status, f, indent=2)


def main():
    parser = argparse.ArgumentParser(description="Workflow Orchestrator - Belentani Ecosystem")
    parser.add_argument("command", nargs="?", default="start", choices=["start", "single", "kanban", "dashboard", "health"])
    parser.add_argument("--task", "-t", help="Task name for single mode")
    parser.add_argument("--type", "-T", help="Task type for single mode")
    parser.add_argument("--config", "-c", default="config/orchestrator.yaml", help="Config path")
    args = parser.parse_args()

    orchestrator = WorkflowOrchestrator(config_path=args.config)

    if args.command == "start":
        orchestrator.start()
    elif args.command == "single":
        if not args.task:
            print("Error: --task required for single mode")
            sys.exit(1)
        orchestrator.run_single_task(args.task, args.type or "code")
    elif args.command == "kanban":
        orchestrator.kanban_status()
    elif args.command == "dashboard":
        import json as j
        print(j.dumps(orchestrator.dashboard(), indent=2))
    elif args.command == "health":
        health = orchestrator.monitor.run_checks()
        print(f"Overall: {health.overall_status} | Uptime: {health.uptime_percent:.1f}%")
        for c in health.checks:
            icon = "[+]" if c.status == "ok" else "[-]"
            print(f"  {icon} {c.target}: {c.status} [{c.response_time_ms}ms]")


if __name__ == "__main__":
    main()
