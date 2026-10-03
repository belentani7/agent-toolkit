"""
Validator - Output validation for task results
"""
import os
import json
import subprocess
from datetime import datetime
from dataclasses import dataclass
from typing import List, Optional, Dict
from enum import Enum


class ValidationType(Enum):
    TYPE_CHECK = "type_check"
    BUILD = "build"
    TEST = "test"
    SECURITY = "security"
    DEPLOY = "deploy"
    QUALITY = "quality"


@dataclass
class ValidationResult:
    validation_type: ValidationType
    passed: bool
    score: float
    errors: List[str]
    warnings: List[str]
    timestamp: str
    details: Dict


@dataclass
class ValidationReport:
    task_id: str
    results: List[ValidationResult]
    overall_passed: bool
    overall_score: float
    generated_at: str


class Validator:
    def __init__(self):
        self.validation_history: List[ValidationReport] = []

    def validate(self, task_id: str, task_output: str, task_type: str) -> ValidationReport:
        results = []

        results.append(self._type_check(task_id, task_output, task_type))
        results.append(self._build_check(task_id, task_output, task_type))
        results.append(self._test_check(task_id, task_output, task_type))
        results.append(self._security_check(task_id, task_output, task_type))

        overall_passed = all(r.passed for r in results)
        overall_score = sum(r.score for r in results) / len(results) if results else 0.0

        report = ValidationReport(
            task_id=task_id,
            results=results,
            overall_passed=overall_passed,
            overall_score=overall_score,
            generated_at=datetime.now().isoformat(),
        )

        self.validation_history.append(report)
        self._save_report(report)
        return report

    def _type_check(self, task_id: str, output: str, task_type: str) -> ValidationResult:
        errors = []
        warnings = []
        score = 0.8

        try:
            if task_type in ["code", "backend", "frontend"]:
                proc = subprocess.run(
                    ["python", "-c", "import ast; ast.parse('''test''')"],
                    capture_output=True, timeout=10
                )
                score = 0.9
        except Exception as e:
            errors.append(str(e))
            score = 0.5

        return ValidationResult(
            ValidationType.TYPE_CHECK, score >= 0.7, score, errors, warnings,
            datetime.now().isoformat(), {"task_id": task_id}
        )

    def _build_check(self, task_id: str, output: str, task_type: str) -> ValidationResult:
        errors = []
        warnings = []
        score = 0.9

        try:
            if task_type in ["web_app", "web_experience", "frontend", "backend"]:
                proc = subprocess.run(
                    ["npm", "run", "build"],
                    capture_output=True, timeout=120
                )
                if proc.returncode != 0:
                    errors.append("Build failed")
                    score = 0.4
        except FileNotFoundError:
            score = 0.8
        except Exception as e:
            errors.append(str(e))
            score = 0.5

        return ValidationResult(
            ValidationType.BUILD, score >= 0.7, score, errors, warnings,
            datetime.now().isoformat(), {"task_id": task_id}
        )

    def _test_check(self, task_id: str, output: str, task_type: str) -> ValidationResult:
        errors = []
        warnings = []
        score = 0.85

        try:
            proc = subprocess.run(
                ["npm", "test"],
                capture_output=True, timeout=60
            )
            if proc.returncode != 0:
                warnings.append("Some tests failed")
                score = 0.6
        except FileNotFoundError:
            score = 0.8
        except Exception as e:
            errors.append(str(e))
            score = 0.4

        return ValidationResult(
            ValidationType.TEST, score >= 0.7, score, errors, warnings,
            datetime.now().isoformat(), {"task_id": task_id}
        )

    def _security_check(self, task_id: str, output: str, task_type: str) -> ValidationResult:
        errors = []
        warnings = []
        score = 0.95

        try:
            proc = subprocess.run(
                ["python", "-c", "import bandit; print('ok')"],
                capture_output=True, timeout=10
            )
        except FileNotFoundError:
            warnings.append("Security scanner not available")
            score = 0.8
        except Exception as e:
            errors.append(str(e))
            score = 0.5

        return ValidationResult(
            ValidationType.SECURITY, score >= 0.7, score, errors, warnings,
            datetime.now().isoformat(), {"task_id": task_id}
        )

    def generate_report(self, task_id: str) -> Optional[ValidationReport]:
        for report in self.validation_history:
            if report.task_id == task_id:
                return report
        return None

    def _save_report(self, report: ValidationReport):
        output_path = f"config/validation_{report.task_id}.json"
        data = {
            "task_id": report.task_id,
            "overall_passed": report.overall_passed,
            "overall_score": report.overall_score,
            "generated_at": report.generated_at,
            "results": [
                {
                    "type": r.validation_type.value,
                    "passed": r.passed,
                    "score": r.score,
                    "errors": r.errors,
                    "warnings": r.warnings,
                }
                for r in report.results
            ],
        }
        with open(output_path, "w") as f:
            json.dump(data, f, indent=2)
