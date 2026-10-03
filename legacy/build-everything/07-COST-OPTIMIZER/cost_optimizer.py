#!/usr/bin/env python3
"""
LLM Cost Optimizer - Real cost per useful task
Calcula el coste real incluyendo cache, tokens ocultos de razonamiento y
retries (pass@1). Permite leer parametros opcionales desde .env.

Uso:
    python cost_optimizer.py                          # Tabla completa
    python cost_optimizer.py --task code              # Recomendaciones por tarea
    python cost_optimizer.py --json                   # Salida JSON
    python cost_optimizer.py --input-tokens 5000 --output-tokens 1000
"""
from __future__ import annotations

import argparse
import json
import os
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Optional


# ─── .env opcional ────────────────────────────────────────────────────────────
def load_env(env_path: Optional[Path] = None) -> None:
    """Carga variables de configuracion desde un .env si existe (sin pisar)."""
    path = env_path or Path(__file__).parent / ".env"
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())


@dataclass
class Model:
    name: str
    provider: str
    input_price: float  # $ por 1M tokens
    output_price: float  # $ por 1M tokens
    cache_discount: float  # 0.0-1.0: fraccion a pagar con cache
    reasoning_multiplier: float = 1.0  # multiplicador de tokens ocultos
    pass_at_1: float = 0.7  # probabilidad de exito al primer intento

    def effective_input_price(self, cache_hit_rate: float = 0.8) -> float:
        """Precio efectivo de entrada teniendo en cuenta la cache."""
        return self.input_price * (cache_hit_rate * self.cache_discount + (1 - cache_hit_rate))

    def cost_per_attempt(self, input_tokens: int, output_tokens: int, cache_hit_rate: float = 0.8) -> float:
        """Coste de una llamada (input efectivo + output con tokens de razonamiento)."""
        eff_input = self.effective_input_price(cache_hit_rate)
        billed_output = output_tokens * self.reasoning_multiplier
        return (input_tokens / 1_000_000) * eff_input + (billed_output / 1_000_000) * self.output_price

    def cost_per_task(self, input_tokens: int = 10000, output_tokens: int = 2000,
                      cache_hit_rate: float = 0.8) -> float:
        """Coste esperado por tarea COMPLETADA (incluye retries por pass@1)."""
        attempt_cost = self.cost_per_attempt(input_tokens, output_tokens, cache_hit_rate)
        # Proteccion contra pass_at_1 = 0 (division por cero)
        success_rate = max(self.pass_at_1, 0.01)
        return attempt_cost / success_rate

    def to_dict(self) -> dict:
        return asdict(self)


# Pricing table (reference, actualiza segun tarifas vigentes)
MODELS: List[Model] = [
    # Frontier
    Model("GPT-5.6", "OpenAI", 5.00, 20.00, 0.50, 1.5, 0.88),
    Model("Claude Opus 4.6", "Anthropic", 15.00, 75.00, 0.10, 2.0, 0.90),
    Model("Gemini 3.1 Pro", "Google", 3.50, 10.50, 0.75, 1.3, 0.84),
    Model("Grok 4.5", "xAI", 5.00, 15.00, 0.50, 1.5, 0.80),
    Model("GLM-5.2", "Zhipu", 1.20, 4.00, 0.50, 1.2, 0.78),
    # Mid-range
    Model("Claude Sonnet 4.5", "Anthropic", 3.00, 15.00, 0.10, 1.2, 0.82),
    Model("Claude Haiku 4", "Anthropic", 0.80, 4.00, 0.10, 1.0, 0.66),
    Model("GPT-5-nano", "OpenAI", 0.25, 1.00, 0.50, 1.0, 0.68),
    Model("Gemini 3.1 Flash", "Google", 0.20, 0.80, 0.75, 1.0, 0.70),
    Model("DeepSeek V3.2", "DeepSeek", 0.30, 1.20, 0.20, 1.0, 0.76),
    Model("Mistral Large 3", "Mistral", 1.00, 3.00, 0.50, 1.0, 0.72),
    # Budget
    Model("Groq Llama 3.3 70B", "Groq", 0.05, 0.10, 0.50, 1.0, 0.72),
    Model("Cerebras Llama 3.1 70B", "Cerebras", 0.10, 0.20, 0.50, 1.0, 0.70),
    Model("OpenRouter Free Models", "OpenRouter", 0.00, 0.00, 1.00, 1.0, 0.65),
]

RECOMMENDATIONS = {
    "classification": ["Groq Llama 3.3 70B", "Gemini 3.1 Flash", "DeepSeek V3.2"],
    "rag": ["DeepSeek V3.2", "Gemini 3.1 Flash", "Groq Llama 3.3 70B"],
    "code": ["Claude Sonnet 4.5", "DeepSeek V3.2", "Groq Llama 3.3 70B"],
    "reasoning": ["Gemini 3.1 Pro", "GLM-5.2", "Claude Sonnet 4.5"],
    "creative": ["Claude Sonnet 4.5", "GPT-5.6", "Gemini 3.1 Pro"],
}


def find_model(name: str) -> Optional[Model]:
    return next((m for m in MODELS if m.name == name), None)


def recommend_models(task_type: str) -> List[Model]:
    names = RECOMMENDATIONS.get(task_type, ["Groq Llama 3.3 70B"])
    return [m for m in MODELS if m.name in names]


def print_table(input_tokens: int, output_tokens: int, cache_hit_rate: float) -> None:
    print("=" * 82)
    print("LLM COST OPTIMIZER - Real Cost Per Useful Task")
    print("=" * 82)
    print(f"Scenario: {input_tokens:,} input / {output_tokens:,} output tokens, cache {cache_hit_rate:.0%}")
    print()
    header = f"{'Model':<26}{'$/1M I/O':<16}{'Eff.$':<10}{'$/Task':<10}{'q':<6}"
    print(header)
    print("-" * 82)

    sorted_models = sorted(MODELS, key=lambda m: m.cost_per_task(input_tokens, output_tokens, cache_hit_rate))
    for m in sorted_models:
        eff = m.effective_input_price(cache_hit_rate)
        tc = m.cost_per_task(input_tokens, output_tokens, cache_hit_rate)
        print(f"{m.name:<26}${m.input_price:<7.2f}/{m.output_price:<7.2f}${eff:<9.4f}${tc:<9.4f}{m.pass_at_1:<6.2f}")

    print("-" * 82)
    best = sorted_models[0]
    print(f"CHEAPEST per task: {best.name} @ ${best.cost_per_task(input_tokens, output_tokens, cache_hit_rate):.4f}/task")
    print("=" * 82)


def print_recommendations(input_tokens: int, output_tokens: int, cache_hit_rate: float) -> None:
    print("\n" + "=" * 82)
    print("RECOMMENDATIONS BY TASK TYPE")
    print("=" * 82)
    for task in RECOMMENDATIONS:
        print(f"\n{task.upper()}:")
        for m in recommend_models(task):
            tc = m.cost_per_task(input_tokens, output_tokens, cache_hit_rate)
            print(f"  {m.name:<26} ${tc:.4f}/task")

    print("\n" + "=" * 82)
    print("KEY INSIGHT: un modelo de $0.14/1M puede costar MAS que uno de $3/1M")
    print("si necesita 3x retries (pass@1=0.33 vs 0.90). Cuenta siempre la calidad.")
    print("=" * 82)


def build_report(input_tokens: int, output_tokens: int, cache_hit_rate: float) -> dict:
    ranked = sorted(
        MODELS,
        key=lambda m: m.cost_per_task(input_tokens, output_tokens, cache_hit_rate),
    )
    return {
        "scenario": {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cache_hit_rate": cache_hit_rate,
        },
        "ranking": [
            {**m.to_dict(), "cost_per_task": round(m.cost_per_task(input_tokens, output_tokens, cache_hit_rate), 6)}
            for m in ranked
        ],
        "cheapest": ranked[0].name,
    }


def parse_int_env(name: str, default: int) -> int:
    try:
        return int(os.environ.get(name, str(default)))
    except (TypeError, ValueError):
        return default


def parse_float_env(name: str, default: float) -> float:
    try:
        return float(os.environ.get(name, str(default)))
    except (TypeError, ValueError):
        return default


def main():
    load_env()

    parser = argparse.ArgumentParser(description="Analisis de coste real por tarea de modelos LLM.")
    parser.add_argument("--task", default=None, help="Tarea: classification, rag, code, reasoning, creative")
    parser.add_argument("--input-tokens", type=int, default=parse_int_env("COST_INPUT_TOKENS", 10000))
    parser.add_argument("--output-tokens", type=int, default=parse_int_env("COST_OUTPUT_TOKENS", 2000))
    parser.add_argument("--cache-rate", type=float, default=parse_float_env("COST_CACHE_RATE", 0.8))
    parser.add_argument("--json", action="store_true", help="Emite un reporte JSON")
    args = parser.parse_args()

    if args.cache_rate < 0 or args.cache_rate > 1:
        parser.error("--cache-rate debe estar entre 0 y 1")

    if args.json:
        print(json.dumps(build_report(args.input_tokens, args.output_tokens, args.cache_rate), indent=2))
        return

    if args.task:
        print_table(args.input_tokens, args.output_tokens, args.cache_rate)
        task = args.task.lower()
        print(f"\nBEST FOR '{task}':")
        for m in recommend_models(task):
            print(f"  {m.name:<26} ${m.cost_per_task(args.input_tokens, args.output_tokens, args.cache_rate):.4f}/task")
        return

    print_table(args.input_tokens, args.output_tokens, args.cache_rate)
    print_recommendations(args.input_tokens, args.output_tokens, args.cache_rate)


if __name__ == "__main__":
    main()
