"""
Priority Engine - Workflow Orchestrator
Reads meta_projects.json and shared-context to produce ranked task queue.
"""
import json
import os
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from typing import List, Optional
from enum import Enum


class Priority(Enum):
    P0 = "P0-Critical"
    P1 = "P1-High"
    P2 = "P2-Medium"
    P3 = "P3-Low"


@dataclass
class Task:
    id: str
    name: str
    type: str
    priority: Priority
    score: float
    urgency: float
    impact: float
    cost: float
    dependencies: List[str]
    status: str = "backlog"
    created_at: str = ""
    updated_at: str = ""


@dataclass
class RankedQueue:
    tasks: List[Task]
    generated_at: str = ""
    total_tasks: int = 0


class PriorityEngine:
    def __init__(self, projects_path: str, shared_context_path: str):
        self.projects_path = projects_path
        self.shared_context_path = shared_context_path
        self.projects = []
        self.decisions = []
        self.pending_actions = []

    def load_data(self):
        if os.path.exists(self.projects_path):
            with open(self.projects_path) as f:
                data = json.load(f)
                self.projects = data.get("projects", [])
        context_dir = os.path.dirname(self.shared_context_path)
        decisions_path = os.path.join(context_dir, "decisions.md")
        projects_json_path = os.path.join(context_dir, "projects.json")
        if os.path.exists(projects_json_path):
            with open(projects_json_path) as f:
                ctx = json.load(f)
                self.pending_actions = ctx.get("pendingActions", [])
        if os.path.exists(decisions_path):
            with open(decisions_path) as f:
                self.decisions = f.read()

    def calculate_score(self, project: dict) -> float:
        urgency = self._get_urgency(project)
        impact = self._get_impact(project)
        cost = self._get_cost(project)
        dependency_penalty = self._get_dependency_penalty(project)
        return (urgency * 0.4) + (impact * 0.35) + (cost * 0.15) + (dependency_penalty * 0.1)

    def _get_urgency(self, project: dict) -> float:
        status = project.get("status", "unknown")
        status_scores = {
            "needs_audit": 0.9,
            "complete_functional": 0.3,
            "pending": 0.7,
            "active": 0.4,
        }
        return status_scores.get(status, 0.5)

    def _get_impact(self, project: dict) -> float:
        priority = project.get("priority", "P0")
        impact_map = {"P0": 1.0, "P1": 0.8, "P2": 0.5, "P3": 0.2}
        return impact_map.get(priority, 0.5)

    def _get_cost(self, project: dict) -> float:
        size = project.get("size_mb", 0)
        if size > 500:
            return 0.9
        elif size > 100:
            return 0.6
        elif size > 10:
            return 0.3
        return 0.1

    def _get_dependency_penalty(self, project: dict) -> float:
        has_backend = project.get("has_backend", False)
        has_package = project.get("has_package_json", False)
        deps = 0
        if has_backend:
            deps += 0.3
        if has_package:
            deps += 0.1
        return min(deps, 1.0)

    def generate_queue(self) -> RankedQueue:
        self.load_data()
        tasks = []
        for proj in self.projects:
            score = self.calculate_score(proj)
            priority = self._score_to_priority(score)
            task = Task(
                id=proj.get("id", ""),
                name=proj.get("name", ""),
                type=proj.get("type", "unknown"),
                priority=priority,
                score=score,
                urgency=self._get_urgency(proj),
                impact=self._get_impact(proj),
                cost=self._get_cost(proj),
                dependencies=[],
                status=proj.get("status", "unknown"),
                created_at=proj.get("created_at", datetime.now().isoformat()),
                updated_at=datetime.now().isoformat(),
            )
            tasks.append(task)

        tasks.sort(key=lambda t: t.score, reverse=True)

        pending = []
        for action in self.pending_actions:
            task = Task(
                id=f"action_{action.get('priority', 'medium')}",
                name=action.get("action", "Unknown"),
                type="pending_action",
                priority=self._priority_to_enum(action.get("priority", "medium")),
                score=1.0 if action.get("priority") == "critical" else 0.6,
                urgency=1.0,
                impact=0.8,
                cost=0.3,
                dependencies=[],
                status="pending",
            )
            pending.append(task)

        tasks.extend(pending)
        tasks.sort(key=lambda t: t.score, reverse=True)

        return RankedQueue(
            tasks=tasks,
            generated_at=datetime.now().isoformat(),
            total_tasks=len(tasks),
        )

    def _score_to_priority(self, score: float) -> Priority:
        if score >= 0.8:
            return Priority.P0
        elif score >= 0.6:
            return Priority.P1
        elif score >= 0.4:
            return Priority.P2
        return Priority.P3

    def _priority_to_enum(self, priority_str: str) -> Priority:
        p = priority_str.lower()
        if p == "critical":
            return Priority.P0
        elif p == "high":
            return Priority.P1
        elif p == "medium":
            return Priority.P2
        return Priority.P3

    def save_queue(self, queue: RankedQueue, output_path: str):
        data = {
            "generated_at": queue.generated_at,
            "total_tasks": queue.total_tasks,
            "tasks": [
                {
                    "id": t.id,
                    "name": t.name,
                    "type": t.type,
                    "priority": t.priority.value,
                    "score": t.score,
                    "urgency": t.urgency,
                    "impact": t.impact,
                    "cost": t.cost,
                    "status": t.status,
                }
                for t in queue.tasks
            ],
        }
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w") as f:
            json.dump(data, f, indent=2)


if __name__ == "__main__":
    engine = PriorityEngine(
        projects_path=os.path.expanduser("~/meta_projects.json"),
        shared_context_path=os.path.expanduser("~/.belentani/shared-context/projects.json"),
    )
    queue = engine.generate_queue()
    engine.save_queue(queue, "config/priority_queue.json")
    print(f"Generated queue: {queue.total_tasks} tasks")
    for t in queue.tasks[:10]:
        print(f"  {t.priority.value}: {t.name} (score: {t.score:.2f})")
