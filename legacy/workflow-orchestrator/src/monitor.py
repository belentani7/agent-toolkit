"""
Monitor - Health check for all projects, repos, APIs, domains
"""
import os
import json
import yaml
import urllib.request
import urllib.error
from datetime import datetime
from dataclasses import dataclass, field
from typing import List, Dict, Optional


@dataclass
class HealthCheck:
    target: str
    type: str
    status: str
    response_time_ms: int
    error: Optional[str]
    timestamp: str


@dataclass
class HealthReport:
    checks: List[HealthCheck]
    overall_status: str
    generated_at: str
    uptime_percent: float


class Monitor:
    def __init__(self, config_path: str = "config/monitor_targets.yaml"):
        self.config_path = config_path
        self.targets = self._load_targets()
        self.history: List[HealthReport] = []

    def _load_targets(self) -> dict:
        default_targets = {
            "repos": [
                {"name": "NOIACORE", "url": "https://github.com/belentani7/NOIACORE"},
                {"name": "secure-t", "url": "https://github.com/belentani7/secure-t"},
                {"name": "skills-registry", "url": "https://github.com/belentani7/skills-registry"},
                {"name": "belentani-core", "url": "https://github.com/belentani7/belentani-core"},
                {"name": "manus-ai-skill-pack", "url": "https://github.com/belentani7/manus-ai-skill-pack"},
            ],
            "pages": [
                {"name": "Belentani OS", "url": "https://belentani7.github.io/belentani_Omega/"},
                {"name": "Judas Experience", "url": "https://belentani7.github.io/judas-experience/"},
                {"name": "ManosAbiertas", "url": "https://belentani7.github.io/ManosAbiertas/"},
            ],
            "apis": [
                {"name": "OpenRouter", "url": "https://openrouter.ai/api/v1"},
                {"name": "HuggingFace", "url": "https://api-inference.huggingface.co/models"},
                {"name": "OmniRoute", "url": "http://localhost:20128/v1"},
            ],
            "domains": [
                {"name": "belentani.vercel.app", "url": "https://belentani.vercel.app"},
                {"name": "belentani.eu", "url": "https://belentani.eu"},
            ],
        }
        if os.path.exists(self.config_path):
            with open(self.config_path) as f:
                return yaml.safe_load(f)
        return default_targets

    def check_repo(self, repo: dict) -> HealthCheck:
        url = repo["url"] + "/api"
        start = datetime.now()
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Monitor"})
            urllib.request.urlopen(req, timeout=10)
            elapsed = (datetime.now() - start).total_seconds() * 1000
            return HealthCheck(repo["name"], "repo", "ok", int(elapsed), None, datetime.now().isoformat())
        except Exception as e:
            elapsed = (datetime.now() - start).total_seconds() * 1000
            return HealthCheck(repo["name"], "repo", "error", int(elapsed), str(e), datetime.now().isoformat())

    def check_page(self, page: dict) -> HealthCheck:
        start = datetime.now()
        try:
            req = urllib.request.Request(page["url"], headers={"User-Agent": "Monitor"})
            resp = urllib.request.urlopen(req, timeout=10)
            elapsed = (datetime.now() - start).total_seconds() * 1000
            status = "ok" if 200 <= resp.status < 400 else "degraded"
            return HealthCheck(page["name"], "page", status, int(elapsed), None, datetime.now().isoformat())
        except Exception as e:
            elapsed = (datetime.now() - start).total_seconds() * 1000
            return HealthCheck(page["name"], "page", "error", int(elapsed), str(e), datetime.now().isoformat())

    def check_api(self, api: dict) -> HealthCheck:
        start = datetime.now()
        try:
            req = urllib.request.Request(api["url"], headers={"User-Agent": "Monitor"})
            urllib.request.urlopen(req, timeout=5)
            elapsed = (datetime.now() - start).total_seconds() * 1000
            return HealthCheck(api["name"], "api", "ok", int(elapsed), None, datetime.now().isoformat())
        except Exception as e:
            elapsed = (datetime.now() - start).total_seconds() * 1000
            return HealthCheck(api["name"], "api", "error", int(elapsed), str(e), datetime.now().isoformat())

    def check_domain(self, domain: dict) -> HealthCheck:
        start = datetime.now()
        try:
            req = urllib.request.Request(domain["url"], headers={"User-Agent": "Monitor"})
            resp = urllib.request.urlopen(req, timeout=10)
            elapsed = (datetime.now() - start).total_seconds() * 1000
            status = "ok" if 200 <= resp.status < 400 else "degraded"
            return HealthCheck(domain["name"], "domain", status, int(elapsed), None, datetime.now().isoformat())
        except Exception as e:
            elapsed = (datetime.now() - start).total_seconds() * 1000
            return HealthCheck(domain["name"], "domain", "error", int(elapsed), str(e), datetime.now().isoformat())

    def run_checks(self) -> HealthReport:
        checks = []
        for category in ["repos", "pages", "apis", "domains"]:
            targets = self.targets.get(category, [])
            for target in targets:
                if category == "repos":
                    checks.append(self.check_repo(target))
                elif category == "pages":
                    checks.append(self.check_page(target))
                elif category == "apis":
                    checks.append(self.check_api(target))
                elif category == "domains":
                    checks.append(self.check_domain(target))

        ok_count = sum(1 for c in checks if c.status == "ok")
        total = len(checks)
        uptime = (ok_count / total * 100) if total > 0 else 0
        overall = "healthy" if uptime >= 90 else ("degraded" if uptime >= 50 else "critical")

        report = HealthReport(
            checks=checks,
            overall_status=overall,
            generated_at=datetime.now().isoformat(),
            uptime_percent=uptime,
        )
        self.history.append(report)
        return report

    def save_report(self, report: HealthReport, output_path: str):
        data = {
            "overall_status": report.overall_status,
            "uptime_percent": report.uptime_percent,
            "generated_at": report.generated_at,
            "total_checks": len(report.checks),
            "checks": [
                {
                    "target": c.target,
                    "type": c.type,
                    "status": c.status,
                    "response_time_ms": c.response_time_ms,
                    "error": c.error,
                    "timestamp": c.timestamp,
                }
                for c in report.checks
            ],
        }
        with open(output_path, "w") as f:
            json.dump(data, f, indent=2)

    def run_daily_check(self):
        report = self.run_checks()
        self.save_report(report, "config/health_report.json")
        return report


if __name__ == "__main__":
    monitor = Monitor()
    report = monitor.run_checks()
    print(f"Overall: {report.overall_status} | Uptime: {report.uptime_percent:.1f}%")
    for c in report.checks:
        icon = "[+]" if c.status == "ok" else "[-]"
        print(f"  {icon} {c.target} ({c.type}): {c.status} [{c.response_time_ms}ms]")
