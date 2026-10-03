"""
CLI Launcher - Unified dispatch for Claude Code, Codex, OpenCode
Zero Alibaba dependency. All models use OpenRouter/Groq/HuggingFace.
"""
import subprocess
import os
import json
import yaml
from dataclasses import dataclass
from typing import Optional, Dict, List
from enum import Enum


class CLIType(Enum):
    CLAUDE = "claude"
    CODEX = "codex"
    OPENCODE = "opencode"


@dataclass
class CLIDispatch:
    cli_type: CLIType
    command: str
    workdir: str
    model: str
    timeout: int
    token_efficient: bool = True


class CLILauncher:
    PROVIDER_CONFIG = {
        "claude": {
            "command": "claude",
            "default_model": "anthropic/claude-3.5-sonnet",
            "config_path": os.path.expanduser("~/.claude/settings.json"),
            "context": 32768,
            "thinking": False,
        },
        "codex": {
            "command": "codex",
            "default_model": "openai/gpt-4o",
            "config_path": os.path.expanduser("~/.codex/config.toml"),
            "context": 32768,
        },
        "opencode": {
            "command": "opencode",
            "default_model": "openai/gpt-4o-mini",
            "config_path": os.path.expanduser("~/.config/opencode/opencode.json"),
            "context": 32768,
        },
    }

    TASK_TYPE_MAP = {
        "reasoning": CLIType.CLAUDE,
        "quick": CLIType.CODEX,
        "open_source": CLIType.OPENCODE,
        "web": CLIType.CODEX,
        "security": CLIType.CLAUDE,
        "audio": CLIType.CLAUDE,
        "image": CLIType.OPENCODE,
        "video": CLIType.CLAUDE,
        "deploy": CLIType.CLAUDE,
        "monitor": CLIType.OPENCODE,
        "documentation": CLIType.OPENCODE,
        "default": CLIType.CLAUDE,
    }

    def __init__(self, config_path: str = "config/cli_providers.yaml"):
        self.config_path = config_path
        self.execution_log: List[Dict] = []

    def dispatch(self, task_name: str, task_type: str, workdir: str = ".", model: str = None) -> CLIDispatch:
        cli_type = self._select_cli(task_type)
        provider = self.PROVIDER_CONFIG[cli_type.value]
        selected_model = model or provider["default_model"]
        timeout = self._get_timeout(task_type)

        command = self._build_command(cli_type, task_name, selected_model, provider)

        dispatch = CLIDispatch(
            cli_type=cli_type,
            command=command,
            workdir=workdir,
            model=selected_model,
            timeout=timeout,
            token_efficient=True,
        )
        return dispatch

    def _select_cli(self, task_type: str) -> CLIType:
        for key, cli in self.TASK_TYPE_MAP.items():
            if key in task_type.lower():
                return cli
        return self.TASK_TYPE_MAP["default"]

    def _build_command(self, cli_type: CLIType, task_name: str, model: str, provider: dict) -> str:
        cmd = provider["command"]
        if cli_type == CLIType.CLAUDE:
            return f"{cmd} -p '{task_name}' --model {model} --max-turns 10"
        elif cli_type == CLIType.CODEX:
            return f"{cmd} exec '{task_name}' --model {model}"
        elif cli_type == CLIType.OPENCODE:
            return f"{cmd} run '{task_name}' --model {model} --max-turns 5"
        return f"{cmd} '{task_name}'"

    def _get_timeout(self, task_type: str) -> int:
        if "security" in task_type.lower() or "audit" in task_type.lower():
            return 300
        if "audio" in task_type.lower() or "video" in task_type.lower():
            return 600
        if "deploy" in task_type.lower():
            return 180
        return 120

    def execute(self, dispatch: CLIDispatch, background: bool = False) -> Dict:
        result = {
            "command": dispatch.command,
            "cli": dispatch.cli_type.value,
            "model": dispatch.model,
            "status": "started",
            "timestamp": __import__("datetime").datetime.now().isoformat(),
        }

        try:
            if background:
                result["status"] = "background"
                result["session_id"] = f"{dispatch.cli_type.value}_{__import__('datetime').datetime.now().timestamp()}"
            else:
                proc = subprocess.run(
                    dispatch.command,
                    shell=True,
                    cwd=dispatch.workdir,
                    capture_output=True,
                    text=True,
                    timeout=dispatch.timeout,
                )
                result["status"] = "completed" if proc.returncode == 0 else "failed"
                result["stdout"] = proc.stdout[:5000]
                result["stderr"] = proc.stderr[:2000]
                result["returncode"] = proc.returncode
        except subprocess.TimeoutExpired:
            result["status"] = "timeout"
        except Exception as e:
            result["status"] = "error"
            result["error"] = str(e)

        self.execution_log.append(result)
        return result

    def execute_opencode_efficient(self, task: str, model: str = None, max_turns: int = 5) -> Dict:
        provider = self.PROVIDER_CONFIG["opencode"]
        cmd = f"opencode run '{task}' --model {model or provider['default_model']} --max-turns {max_turns}"
        proc = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120)
        return {
            "command": cmd,
            "status": "completed" if proc.returncode == 0 else "failed",
            "stdout": proc.stdout[:5000],
            "token_efficient": True,
        }

    def save_log(self, output_path: str):
        with open(output_path, "w") as f:
            json.dump(self.execution_log, f, indent=2)
