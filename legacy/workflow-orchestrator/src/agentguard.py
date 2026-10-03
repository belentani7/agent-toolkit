"""
Agentguard Budget - Token spending enforcement
Monitors and enforces OpenRouter/Groq/HuggingFace spending limits.
Zero Alibaba dependency.
"""
import os
import json
import yaml
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import Optional


@dataclass
class BudgetStatus:
    plan_limit: float
    plan_cost: str
    used_this_month: float
    remaining: float
    usage_percent: float
    status: str
    auto_pause: bool
    overflow_routed: bool
    last_check: str


class Agentguard:
    def __init__(self, plan_limit: float = 100.0, currency: str = "USD", usage_log_path: str = None):
        self.plan_limit = plan_limit
        self.currency = currency
        self.threshold_pct = 0.80
        self.usage_log_path = usage_log_path or "config/budget_log.json"
        self.usage_log = self._load_usage_log()

    def _load_usage_log(self) -> dict:
        if os.path.exists(self.usage_log_path) and os.path.getsize(self.usage_log_path) > 0:
            with open(self.usage_log_path) as f:
                return json.load(f)
        return {
            "monthly_usage": {},
            "total_spent": 0.0,
            "last_month": "",
            "alerts": [],
        }

    def _save_usage_log(self):
        os.makedirs(os.path.dirname(self.usage_log_path), exist_ok=True)
        with open(self.usage_log_path, "w") as f:
            json.dump(self.usage_log, f, indent=2)

    def check_budget(self, task_cost: float = 0.0) -> BudgetStatus:
        today = datetime.now()
        month_key = f"{today.year}-{today.month:02d}"
        current_spent = self.usage_log["monthly_usage"].get(month_key, 0.0)
        current_spent += task_cost
        remaining = self.plan_limit - current_spent
        usage_pct = (current_spent / self.plan_limit) * 100

        auto_pause = usage_pct >= (self.threshold_pct * 100)
        overflow_routed = False

        if auto_pause:
            overflow_routed = True
            self.usage_log["alerts"].append({
                "type": "budget_exceeded",
                "month": month_key,
                "spent": current_spent,
                "limit": self.plan_limit,
                "timestamp": today.isoformat(),
            })

        status = BudgetStatus(
            plan_limit=self.plan_limit,
            plan_cost=self.currency,
            used_this_month=current_spent,
            remaining=remaining,
            usage_percent=usage_pct,
            status="warning" if auto_pause else ("ok" if usage_pct < 50 else "elevated"),
            auto_pause=auto_pause,
            overflow_routed=overflow_routed,
            last_check=today.isoformat(),
        )

        self.usage_log["monthly_usage"][month_key] = current_spent
        self.usage_log["total_spent"] = sum(
            v for v in self.usage_log["monthly_usage"].values()
        )
        self._save_usage_log()
        return status

    def approve_task(self, estimated_cost: float) -> bool:
        status = self.check_budget(estimated_cost)
        if status.auto_pause:
            return False
        if status.remaining < estimated_cost:
            return False
        return True

    def route_to_cheapest(self, task_type: str) -> str:
        cheapest_models = {
            "coding": "openai/gpt-4o-mini",
            "reasoning": "openai/gpt-4o-mini",
            "audio": "openai/gpt-4o-mini",
            "image": "stabilityai/stable-diffusion-xl",
            "general": "openai/gpt-4o-mini",
        }
        for key, model in cheapest_models.items():
            if key in task_type.lower():
                return model
        return "openai/gpt-4o-mini"

    def get_dashboard(self) -> dict:
        today = datetime.now()
        month_key = f"{today.year}-{today.month:02d}"
        current = self.usage_log["monthly_usage"].get(month_key, 0.0)
        return {
            "plan_limit": self.plan_limit,
            "used_this_month": current,
            "remaining": self.plan_limit - current,
            "usage_percent": round((current / self.plan_limit) * 100, 1),
            "total_spent_all_time": self.usage_log["total_spent"],
            "alerts_count": len(self.usage_log["alerts"]),
            "status": "OK" if current < self.plan_limit * 0.8 else "BUDGET EXCEEDED",
            "last_check": datetime.now().isoformat(),
        }


if __name__ == "__main__":
    guard = Agentguard()
    status = guard.check_budget()
    print(json.dumps(guard.get_dashboard(), indent=2))
