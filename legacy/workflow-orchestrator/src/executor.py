"""
Executor - Sandbox execution via Agentbox
Provisions Terraform sandboxes and dispatches tasks.
"""
import os
import json
import subprocess
import yaml
from datetime import datetime
from dataclasses import dataclass
from typing import Optional, Dict, List
from enum import Enum


class SandboxStatus(Enum):
    PROVISIONING = "provisioning"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    TERMINATED = "terminated"
    TIMEOUT = "timeout"


@dataclass
class Sandbox:
    id: str
    provider: str
    status: SandboxStatus
    image: str
    cpu: str
    memory: str
    created_at: str
    terminated_at: Optional[str] = None
    task_output: Optional[str] = None


@dataclass
class ExecutionResult:
    sandbox_id: str
    task_id: str
    status: SandboxStatus
    output: Optional[str]
    error: Optional[str]
    duration_seconds: int
    token_usage: int
    cost_cny: float
    timestamp: str


class Executor:
    DEFAULT_IMAGE = "ubuntu:22.04"
    DEFAULT_CPU = "2"
    DEFAULT_MEMORY = "4GB"

    def __init__(self, agentbox_config: str = "config/agentbox.yaml"):
        self.agentbox_config = agentbox_config
        self.sandboxes: Dict[str, Sandbox] = {}
        self.execution_history: List[ExecutionResult] = []

    def provision_sandbox(self, task_id: str, complexity: str = "tier_2") -> Sandbox:
        sandbox_id = f"sb-{task_id}-{datetime.now().timestamp():.0f}"

        config = self._get_resource_config(complexity)

        sandbox = Sandbox(
            id=sandbox_id,
            provider="agentbox",
            status=SandboxStatus.PROVISIONING,
            image=config["image"],
            cpu=config["cpu"],
            memory=config["memory"],
            created_at=datetime.now().isoformat(),
        )

        try:
            self._run_terraform(sandbox, config)
            sandbox.status = SandboxStatus.RUNNING
        except Exception as e:
            sandbox.status = SandboxStatus.FAILED
            sandbox.task_output = str(e)

        self.sandboxes[sandbox_id] = sandbox
        return sandbox

    def _get_resource_config(self, complexity: str) -> dict:
        configs = {
            "tier_1": {"image": "ubuntu:22.04", "cpu": "1", "memory": "2GB"},
            "tier_2": {"image": "ubuntu:22.04", "cpu": "2", "memory": "4GB"},
            "tier_3": {"image": "ubuntu:22.04", "cpu": "4", "memory": "8GB"},
            "tier_4": {"image": "ubuntu:22.04", "cpu": "8", "memory": "16GB"},
        }
        return configs.get(complexity, configs["tier_2"])

    def _run_terraform(self, sandbox: Sandbox, config: dict):
        terraform_config = {
            "resource_type": "vm",
            "image": config["image"],
            "cpu": config["cpu"],
            "memory": config["memory"],
            "sandbox_id": sandbox.id,
        }
        with open(f"config/sandbox_{sandbox.id}.tf.json", "w") as f:
            json.dump(terraform_config, f, indent=2)

    def execute_task(self, task_id: str, task_name: str, command: str,
                     complexity: str = "tier_2", timeout: int = 120) -> ExecutionResult:
        sandbox = self.provision_sandbox(task_id, complexity)

        if sandbox.status == SandboxStatus.FAILED:
            return ExecutionResult(
                sandbox_id=sandbox.id,
                task_id=task_id,
                status=SandboxStatus.FAILED,
                output=None,
                error="Sandbox provisioning failed",
                duration_seconds=0,
                token_usage=0,
                cost_cny=0.0,
                timestamp=datetime.now().isoformat(),
            )

        start = datetime.now()
        try:
            proc = subprocess.run(
                command,
                shell=True,
                cwd=f"/tmp/{sandbox.id}",
                capture_output=True,
                text=True,
                timeout=timeout,
            )
            duration = (datetime.now() - start).total_seconds()
            output = proc.stdout
            error = proc.stderr if proc.returncode != 0 else None
            status = SandboxStatus.COMPLETED if proc.returncode == 0 else SandboxStatus.FAILED

            result = ExecutionResult(
                sandbox_id=sandbox.id,
                task_id=task_id,
                status=status,
                output=output[:5000],
                error=error[:2000] if error else None,
                duration_seconds=int(duration),
                token_usage=self._estimate_tokens(task_name, complexity),
                cost_cny=self._estimate_cost(complexity),
                timestamp=datetime.now().isoformat(),
            )
        except subprocess.TimeoutExpired:
            duration = (datetime.now() - start).total_seconds()
            result = ExecutionResult(
                sandbox_id=sandbox.id,
                task_id=task_id,
                status=SandboxStatus.TIMEOUT,
                output=None,
                error=f"Task timed out after {timeout}s",
                duration_seconds=int(duration),
                token_usage=self._estimate_tokens(task_name, complexity),
                cost_cny=self._estimate_cost(complexity),
                timestamp=datetime.now().isoformat(),
            )

        sandbox.status = result.status
        sandbox.task_output = result.output
        sandbox.terminated_at = datetime.now().isoformat()
        self.execution_history.append(result)
        return result

    def _estimate_tokens(self, task_name: str, complexity: str) -> int:
        base = {"tier_1": 1000, "tier_2": 5000, "tier_3": 15000, "tier_4": 30000}
        return base.get(complexity, 5000)

    def _estimate_cost(self, complexity: str) -> float:
        costs = {"tier_1": 0.5, "tier_2": 1.0, "tier_3": 2.5, "tier_4": 5.0}
        return costs.get(complexity, 1.0)

    def terminate_sandbox(self, sandbox_id: str):
        if sandbox_id in self.sandboxes:
            self.sandboxes[sandbox_id].status = SandboxStatus.TERMINATED
            self.sandboxes[sandbox_id].terminated_at = datetime.now().isoformat()

    def cleanup_all(self):
        for sid in list(self.sandboxes.keys()):
            self.terminate_sandbox(sid)

    def save_results(self, output_path: str):
        with open(output_path, "w") as f:
            json.dump({
                "total_executions": len(self.execution_history),
                "active_sandboxes": len([s for s in self.sandboxes.values() if s.status == SandboxStatus.RUNNING]),
                "history": [
                    {
                        "task_id": r.task_id,
                        "status": r.status.value,
                        "duration": r.duration_seconds,
                        "cost_cny": r.cost_cny,
                        "timestamp": r.timestamp,
                    }
                    for r in self.execution_history
                ],
            }, f, indent=2)
