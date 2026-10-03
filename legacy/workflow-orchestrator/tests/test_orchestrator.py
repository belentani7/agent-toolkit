import pytest
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from priority_engine import PriorityEngine, Priority, Task, RankedQueue
from router import Router, Archetype, Complexity, RouteDecision
from cli_launcher import CLILauncher, CLIType, CLIDispatch
from agentguard import Agentguard, BudgetStatus
from validator import Validator, ValidationReport, ValidationType


class TestPriorityEngine:
    def test_generate_queue(self):
        engine = PriorityEngine(
            projects_path=os.path.expanduser("~/meta_projects.json"),
            shared_context_path=os.path.expanduser("~/.belentani/shared-context/projects.json"),
        )
        queue = engine.generate_queue()
        assert isinstance(queue, RankedQueue)
        assert queue.total_tasks > 0
        assert len(queue.tasks) == queue.total_tasks

    def test_queue_ranked(self):
        engine = PriorityEngine(
            projects_path=os.path.expanduser("~/meta_projects.json"),
            shared_context_path=os.path.expanduser("~/.belentani/shared-context/projects.json"),
        )
        queue = engine.generate_queue()
        scores = [t.score for t in queue.tasks]
        assert scores == sorted(scores, reverse=True)

    def test_score_to_priority(self):
        engine = PriorityEngine("", "")
        assert engine._score_to_priority(0.9) == Priority.P0
        assert engine._score_to_priority(0.7) == Priority.P1
        assert engine._score_to_priority(0.5) == Priority.P2
        assert engine._score_to_priority(0.3) == Priority.P3


class TestRouter:
    def test_route_returns_decision(self):
        router = Router()
        decision = router.route("test-1", "Test Task", "web_app")
        assert isinstance(decision, RouteDecision)
        assert decision.task_id == "test-1"
        assert decision.archetype in Archetype

    def test_archetype_mapping(self):
        router = Router()
        arch, comp = router.classify_task("code", "Fix bug")
        assert arch == Archetype.CODE
        arch, comp = router.classify_task("voice", "Voice cloning")
        assert arch == Archetype.VOICE

    def test_route_batch(self):
        router = Router()
        tasks = [{"id": "1", "name": "Task 1", "type": "web_app"}, {"id": "2", "name": "Task 2", "type": "audio"}]
        routes = router.route_batch(tasks)
        assert len(routes) == 2
        assert routes[0].archetype == Archetype.FRONTEND
        assert routes[1].archetype == Archetype.MUSIC

    def test_get_cli_command(self):
        router = Router()
        cmd = router.get_cli_command("codex", RouteDecision("1", "Test", Archetype.CODE, Complexity.TIER_1, "model", "qwen", True, 1.0, 5))
        assert "codex" in cmd


class TestCLILauncher:
    def test_dispatch_returns_correct_type(self):
        launcher = CLILauncher()
        dispatch = launcher.dispatch("Test task", "code")
        assert dispatch.cli_type == CLIType.CLAUDE

    def test_dispatch_for_security(self):
        launcher = CLILauncher()
        dispatch = launcher.dispatch("Security audit", "security")
        assert dispatch.cli_type == CLIType.CLAUDE

    def test_execute_opencode_efficient(self):
        launcher = CLILauncher()
        result = launcher.execute_opencode_efficient("Test task", "qwen3.6-flash", 3)
        assert "command" in result
        assert result["token_efficient"] == True


import tempfile
import os

class TestAgentguard:
    def test_budget_check(self):
        tmp = tempfile.NamedTemporaryFile(suffix=".json", delete=False)
        tmp.close()
        guard = Agentguard(plan_limit=200.0, usage_log_path=tmp.name)
        status = guard.check_budget(0.0)
        assert isinstance(status, BudgetStatus)
        assert status.plan_limit == 200.0
        assert status.usage_percent == 0.0
        os.unlink(tmp.name)

    def test_approve_task(self):
        tmp = tempfile.NamedTemporaryFile(suffix=".json", delete=False)
        tmp.close()
        guard = Agentguard(plan_limit=200.0, usage_log_path=tmp.name)
        assert guard.approve_task(1.0) == True
        assert guard.approve_task(2000.0) == False
        os.unlink(tmp.name)

    def test_get_dashboard(self):
        tmp = tempfile.NamedTemporaryFile(suffix=".json", delete=False)
        tmp.close()
        guard = Agentguard(plan_limit=200.0, usage_log_path=tmp.name)
        dashboard = guard.get_dashboard()
        assert "plan_limit" in dashboard
        assert "usage_percent" in dashboard
        assert "status" in dashboard
        os.unlink(tmp.name)


class TestValidator:
    def test_validate_returns_report(self):
        validator = Validator()
        report = validator.validate("test-1", "test output", "code")
        assert isinstance(report, ValidationReport)
        assert report.task_id == "test-1"

    def test_overall_score(self):
        validator = Validator()
        report = validator.validate("test-1", "test output", "code")
        assert 0.0 <= report.overall_score <= 1.0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
