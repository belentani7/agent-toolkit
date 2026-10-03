"""
Router - MetaSkill + OmniRoute integration
Classifies tasks and routes to optimal model + CLI.
All models: OpenRouter, Groq, HuggingFace (zero Alibaba dependency).
"""
import json
import os
from dataclasses import dataclass, field
from typing import List, Optional, Dict
from enum import Enum


class Archetype(Enum):
    VOICE = "voice"
    IMAGE = "image"
    VIDEO = "video"
    MUSIC = "music"
    AGENT = "agent"
    CODE = "code"
    DESIGN = "design"
    EDUCATION = "education"
    SECURITY = "security"
    FRONTEND = "frontend"
    BACKEND = "backend"
    DEPLOY = "deploy"
    MONITOR = "monitor"
    AUTOMATION = "automation"
    DOCUMENTATION = "documentation"
    UNKNOWN = "unknown"


class Complexity(Enum):
    TIER_1 = "tier_1_simple"
    TIER_2 = "tier_2_moderate"
    TIER_3 = "tier_3_complex"
    TIER_4 = "tier_4_critical"


@dataclass
class RouteDecision:
    task_id: str
    task_name: str
    archetype: Archetype
    complexity: Complexity
    model: str
    cli: str
    sandbox: bool
    estimated_cost: float
    estimated_time: int


class Router:
    ARCHETYPE_MODEL_MAP = {
        Archetype.VOICE: {"model": "openai/whisper-large-v3", "cli": "claude", "sandbox": True},
        Archetype.IMAGE: {"model": "stabilityai/stable-diffusion-xl", "cli": "opencode", "sandbox": True},
        Archetype.VIDEO: {"model": "openai/sora", "cli": "claude", "sandbox": True},
        Archetype.MUSIC: {"model": "facebook/opt-350m", "cli": "opencode", "sandbox": True},
        Archetype.AGENT: {"model": "anthropic/claude-3.5-sonnet", "cli": "claude", "sandbox": True},
        Archetype.CODE: {"model": "openai/gpt-4o", "cli": "codex", "sandbox": True},
        Archetype.DESIGN: {"model": "black-forest-labs/flux-schnell", "cli": "opencode", "sandbox": False},
        Archetype.EDUCATION: {"model": "anthropic/claude-3.5-sonnet", "cli": "claude", "sandbox": True},
        Archetype.SECURITY: {"model": "meta-llama/Llama-3.1-70B", "cli": "claude", "sandbox": True},
        Archetype.FRONTEND: {"model": "openai/gpt-4o-mini", "cli": "codex", "sandbox": True},
        Archetype.BACKEND: {"model": "openai/gpt-4o", "cli": "codex", "sandbox": True},
        Archetype.DEPLOY: {"model": "openai/gpt-4o-mini", "cli": "claude", "sandbox": False},
        Archetype.MONITOR: {"model": "openai/gpt-4o-mini", "cli": "opencode", "sandbox": False},
        Archetype.AUTOMATION: {"model": "anthropic/claude-3.5-sonnet", "cli": "claude", "sandbox": True},
        Archetype.DOCUMENTATION: {"model": "openai/gpt-4o-mini", "cli": "opencode", "sandbox": False},
        Archetype.UNKNOWN: {"model": "openai/gpt-4o-mini", "cli": "codex", "sandbox": False},
    }

    CLI_NAMES = {
        "claude": "Claude Code",
        "codex": "Codex",
        "opencode": "OpenCode",
    }

    COMPLEXITY_COST = {
        Complexity.TIER_1: 0.5,
        Complexity.TIER_2: 1.0,
        Complexity.TIER_3: 2.5,
        Complexity.TIER_4: 5.0,
    }

    COMPLEXITY_TIME = {
        Complexity.TIER_1: 5,
        Complexity.TIER_2: 15,
        Complexity.TIER_3: 45,
        Complexity.TIER_4: 120,
    }

    def __init__(self, omniroute_endpoint: str = "http://localhost:20128/v1"):
        self.omniroute_endpoint = omniroute_endpoint
        self.routing_history: List[RouteDecision] = []

    def classify_task(self, task_type: str, task_name: str = "") -> tuple[Archetype, Complexity]:
        type_lower = task_type.lower()
        archetype = self._map_type_to_archetype(type_lower)
        complexity = self._estimate_complexity(archetype, task_name)
        return archetype, complexity

    def _map_type_to_archetype(self, type_lower: str) -> Archetype:
        mapping = {
            "web_experience": Archetype.FRONTEND,
            "web_app": Archetype.FRONTEND,
            "code": Archetype.CODE,
            "backend": Archetype.BACKEND,
            "audio_pipeline": Archetype.VOICE,
            "audio": Archetype.MUSIC,
            "voice": Archetype.VOICE,
            "image": Archetype.IMAGE,
            "video": Archetype.VIDEO,
            "music": Archetype.MUSIC,
            "agents": Archetype.AGENT,
            "security": Archetype.SECURITY,
            "education": Archetype.EDUCATION,
            "deploy": Archetype.DEPLOY,
            "monitor": Archetype.MONITOR,
            "automation": Archetype.AUTOMATION,
            "documentation": Archetype.DOCUMENTATION,
            "frontend": Archetype.FRONTEND,
            "unknown": Archetype.UNKNOWN,
        }
        for key, arch in mapping.items():
            if key in type_lower:
                return arch
        return Archetype.UNKNOWN

    def _estimate_complexity(self, archetype: Archetype, task_name: str) -> Complexity:
        name_lower = task_name.lower()
        if any(w in name_lower for w in ["audit", "security", "fix", "critical", "deploy"]):
            return Complexity.TIER_4
        if any(w in name_lower for w in ["migrate", "integrate", "optimize", "pipeline"]):
            return Complexity.TIER_3
        if any(w in name_lower for w in ["setup", "config", "test", "build"]):
            return Complexity.TIER_2
        return Complexity.TIER_1

    def route(self, task_id: str, task_name: str, task_type: str) -> RouteDecision:
        archetype, complexity = self.classify_task(task_type, task_name)
        model_info = self.ARCHETYPE_MODEL_MAP.get(archetype, self.ARCHETYPE_MODEL_MAP[Archetype.UNKNOWN])
        cost = self.COMPLEXITY_COST[complexity]
        time = self.COMPLEXITY_TIME[complexity]

        decision = RouteDecision(
            task_id=task_id,
            task_name=task_name,
            archetype=archetype,
            complexity=complexity,
            model=model_info["model"],
            cli=model_info["cli"],
            sandbox=model_info["sandbox"],
            estimated_cost=cost,
            estimated_time=time,
        )
        self.routing_history.append(decision)
        return decision

    def route_batch(self, tasks: list) -> List[RouteDecision]:
        return [self.route(t.get("id", ""), t.get("name", ""), t.get("type", "unknown")) for t in tasks]

    def get_cli_command(self, cli_name: str, task: RouteDecision) -> str:
        commands = {
            "claude": f"claude -p '{task.task_name}' --model {task.model} --max-turns 10",
            "codex": f"codex exec '{task.task_name}' --model {task.model}",
            "opencode": f"opencode run '{task.task_name}' --model {task.model} --max-turns 5",
        }
        return commands.get(cli_name, commands["codex"])

    def save_routes(self, output_path: str, routes: List[RouteDecision]):
        data = {
            "generated_at": __import__("datetime").datetime.now().isoformat(),
            "total_routes": len(routes),
            "routes": [
                {
                    "task_id": r.task_id,
                    "task_name": r.task_name,
                    "archetype": r.archetype.value,
                    "complexity": r.complexity.value,
                    "model": r.model,
                    "cli": r.cli,
                    "sandbox": r.sandbox,
                    "estimated_cost": r.estimated_cost,
                    "estimated_time": r.estimated_time,
                }
                for r in routes
            ],
        }
        with open(output_path, "w") as f:
            json.dump(data, f, indent=2)
