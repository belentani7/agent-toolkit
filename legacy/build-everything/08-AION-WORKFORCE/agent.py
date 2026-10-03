#!/usr/bin/env python3
"""
AION Workforce - Compliance Engine
Valida turnos contra la legislacion laboral (Espana, Portugal, Finlandia, UE).

Uso:
    python agent.py                                # Demo con turnos de ejemplo (ES)
    python agent.py --jurisdiction PT              # Demo en otra jurisdiccion
    python agent.py --start "2026-01-05 07:00" --end "2026-01-05 15:00"
    python agent.py --json                         # Salida JSON
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from typing import List, Optional


@dataclass
class Shift:
    employee_id: str
    start: datetime
    end: datetime
    is_night: bool = False


@dataclass
class ComplianceViolation:
    rule: str
    severity: str  # hard_stop | warning | info
    message: str
    shift_id: Optional[str] = None

    def to_dict(self) -> dict:
        return asdict(self)


class ComplianceEngine:
    """Valida turnos contra la legislacion laboral EU/ES/PT/FI."""

    # Espana (Estatuto de los Trabajadores)
    ES_DAILY_REST_HOURS = 12
    ES_WEEKLY_REST_HOURS = 36
    ES_MAX_WEEKLY_HOURS = 40
    ES_NIGHT_WORK_MAX = 8  # horas en periodo de 24h
    ES_NIGHT_HOURS = (22, 6)  # 22:00 - 06:00

    # Portugal (Codigo do Trabalho)
    PT_DAILY_REST_HOURS = 11
    PT_WEEKLY_REST_HOURS = 24
    PT_MAX_WEEKLY_HOURS = 40

    # Finlandia (Working Hours Act)
    FI_DAILY_REST_HOURS = 11
    FI_WEEKLY_REST_HOURS = 35  # incluye 24h continuas
    FI_MAX_WEEKLY_HOURS = 40

    # Directiva UE 2003/88/CE
    EU_DAILY_REST_HOURS = 11
    EU_WEEKLY_REST_HOURS = 24

    MAX_SHIFT_DURATION_HOURS = 12

    def __init__(self, jurisdiction: str = "ES"):
        self.jurisdiction = jurisdiction.upper()

    def validate_shift(self, shift: Shift, previous_shift_end: Optional[datetime] = None) -> List[ComplianceViolation]:
        violations: List[ComplianceViolation] = []

        shift_hours = (shift.end - shift.start).total_seconds() / 3600
        if shift_hours < 0:
            violations.append(ComplianceViolation(
                rule="Shift Order",
                severity="hard_stop",
                message=f"El turno termina antes de empezar ({shift_hours:.1f}h). Revisa start/end.",
                shift_id=shift.employee_id,
            ))
            return violations

        # 1. Descanso diario entre turnos
        if previous_shift_end:
            rest_hours = (shift.start - previous_shift_end).total_seconds() / 3600
            min_rest = self._get_daily_rest()
            if rest_hours < min_rest:
                violations.append(ComplianceViolation(
                    rule="Daily Rest",
                    severity="hard_stop",
                    message=f"Descanso entre turnos: {rest_hours:.1f}h (minimo {min_rest}h)",
                    shift_id=shift.employee_id,
                ))

        # 2. Duracion maxima del turno
        if shift_hours > self.MAX_SHIFT_DURATION_HOURS:
            violations.append(ComplianceViolation(
                rule="Max Shift Duration",
                severity="warning",
                message=f"Duracion {shift_hours:.1f}h, maximo recomendado {self.MAX_SHIFT_DURATION_HOURS}h",
                shift_id=shift.employee_id,
            ))

        # 3. Trabajo nocturno
        if shift.is_night:
            night_hours = self._calculate_night_hours(shift)
            max_night = self._get_night_max()
            if night_hours > max_night:
                violations.append(ComplianceViolation(
                    rule="Night Work Limit",
                    severity="hard_stop",
                    message=f"Trabajo nocturno {night_hours:.1f}h, maximo permitido {max_night}h",
                    shift_id=shift.employee_id,
                ))

        # 4. Horas semanales: requiere el contexto de la semana completa
        #    (se valida en validate_weekly_schedule)

        return violations

    def validate_weekly_schedule(self, shifts: List[Shift]) -> List[ComplianceViolation]:
        violations: List[ComplianceViolation] = []
        if not shifts:
            return violations

        ordered = sorted(shifts, key=lambda s: s.start)

        # Descanso diario entre turnos consecutivos
        for i in range(1, len(ordered)):
            prev_end = ordered[i - 1].end
            curr_start = ordered[i].start
            rest_hours = (curr_start - prev_end).total_seconds() / 3600
            min_rest = self._get_daily_rest()
            if rest_hours < min_rest:
                violations.append(ComplianceViolation(
                    rule="Daily Rest",
                    severity="hard_stop",
                    message=f"Descanso insuficiente entre turnos: {rest_hours:.1f}h < {min_rest}h",
                    shift_id=ordered[i].employee_id,
                ))

        # Horas semanales
        total_weekly = sum((s.end - s.start).total_seconds() / 3600 for s in ordered)
        max_weekly = self._get_max_weekly()
        if total_weekly > max_weekly:
            violations.append(ComplianceViolation(
                rule="Weekly Hours",
                severity="warning",
                message=f"Total semanal {total_weekly:.1f}h, maximo recomendado {max_weekly}h",
            ))

        # Descanso semanal
        if len(ordered) >= 2:
            first_start = ordered[0].start
            last_end = ordered[-1].end
            span_days = (last_end - first_start).days
            work_days = len(set(s.start.date() for s in ordered))
            rest_days = span_days - work_days + 1
            min_rest_days = self._get_weekly_rest_days()
            if rest_days < min_rest_days:
                violations.append(ComplianceViolation(
                    rule="Weekly Rest",
                    severity="hard_stop",
                    message=f"Solo {rest_days} dias de descanso, minimo requerido {min_rest_days}",
                ))

        return violations

    # ─── Helpers por jurisdiccion ─────────────────────────────────────────────

    def _get_daily_rest(self) -> float:
        if self.jurisdiction == "PT":
            return self.PT_DAILY_REST_HOURS
        if self.jurisdiction == "FI":
            return self.FI_DAILY_REST_HOURS
        return self.ES_DAILY_REST_HOURS

    def _get_weekly_rest_days(self) -> float:
        if self.jurisdiction == "PT":
            return 1  # 24h continuas
        if self.jurisdiction == "FI":
            return 2  # 35h = 24h continuas + 11h diarias
        return 1.5  # 36h en Espana

    def _get_max_weekly(self) -> float:
        if self.jurisdiction == "PT":
            return self.PT_MAX_WEEKLY_HOURS
        if self.jurisdiction == "FI":
            return self.FI_MAX_WEEKLY_HOURS
        return self.ES_MAX_WEEKLY_HOURS

    def _get_night_max(self) -> float:
        return self.ES_NIGHT_WORK_MAX  # 8h es el estandar comun EU/ES/PT

    def _calculate_night_hours(self, shift: Shift) -> float:
        night_start = shift.start.replace(hour=self.ES_NIGHT_HOURS[0], minute=0, second=0, microsecond=0)
        night_end = (shift.start + timedelta(days=1)).replace(hour=self.ES_NIGHT_HOURS[1], minute=0, second=0, microsecond=0)

        if shift.end <= night_start or shift.start >= night_end:
            return 0.0

        actual_start = max(shift.start, night_start)
        actual_end = min(shift.end, night_end)
        return max((actual_end - actual_start).total_seconds() / 3600, 0.0)


def demo_schedule(jurisdiction: str) -> List[Shift]:
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    return [
        Shift("emp1", today.replace(hour=7), today.replace(hour=15)),                                        # 07-15
        Shift("emp1", today.replace(hour=15), today.replace(hour=23)),                                       # 15-23
        Shift("emp1", (today + timedelta(days=1)).replace(hour=22), (today + timedelta(days=2)).replace(hour=6), is_night=True),  # 22-06 nocturno
    ]


def main():
    parser = argparse.ArgumentParser(description="AION Workforce - Compliance Engine")
    parser.add_argument("--jurisdiction", default="ES", help="ES | PT | FI (default: ES)")
    parser.add_argument("--start", default=None, help="Fecha inicio turno, formato: YYYY-MM-DD HH:MM")
    parser.add_argument("--end", default=None, help="Fecha fin turno, formato: YYYY-MM-DD HH:MM")
    parser.add_argument("--night", action="store_true", help="Marcar el turno como nocturno")
    parser.add_argument("--json", action="store_true", help="Salida JSON")
    args = parser.parse_args()

    engine = ComplianceEngine(args.jurisdiction)

    if args.start and args.end:
        start = datetime.strptime(args.start, "%Y-%m-%d %H:%M")
        end = datetime.strptime(args.end, "%Y-%m-%d %H:%M")
        shifts = [Shift("emp1", start, end, is_night=args.night)]
    else:
        shifts = demo_schedule(args.jurisdiction)

    violations = engine.validate_weekly_schedule(shifts)

    if args.json:
        report = {
            "jurisdiction": args.jurisdiction,
            "shifts": [asdict(s) for s in shifts],
            "violations": [v.to_dict() for v in violations],
        }
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return

    print("AION Workforce - Compliance Check")
    print("=" * 55)
    print(f"Jurisdiction: {args.jurisdiction}")
    print(f"Shifts: {len(shifts)}")
    print()
    if not violations:
        print("NO VIOLATIONS - Schedule is compliant")
        return

    print("VIOLATIONS FOUND:")
    for v in violations:
        icon = "STOP" if v.severity == "hard_stop" else "WARN" if v.severity == "warning" else "INFO"
        print(f"  [{icon}] {v.rule}: {v.message}")


if __name__ == "__main__":
    main()
