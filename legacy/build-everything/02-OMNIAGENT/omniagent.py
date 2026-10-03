#!/usr/bin/env python3
"""
OmniAgent CLI - Multi-Agent Orchestrator
Routes tasks to the best free AI models automatically.
Supports: Groq, Google Gemini, OpenRouter, NVIDIA NIM, Cerebras, DeepSeek

Features:
- Provider-specific request builders (Gemini uses its own API, not OpenAI-compatible)
- Retry with exponential backoff on 429 / 5xx
- Configurable timeout and max_tokens
- Rate limiting per provider, response caching (1h TTL), fallback across providers
- .env support (no hardcoded keys)

Usage:
    python omniagent.py chat "explain quantum computing"
    python omniagent.py providers
    python omniagent.py stats
    python omniagent.py "raw prompt" --json
"""
from __future__ import annotations

import os
import sys
import json
import time
import random
import hashlib
import subprocess
from pathlib import Path
from typing import Optional, List, Tuple

try:
    import httpx
except ImportError:  # pragma: no cover - environment bootstrap
    print("httpx no instalado. Intentando instalarlo...")
    try:
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "httpx", "-q"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        import httpx
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: no se pudo instalar httpx: {exc}")
        print("Instala manualmente: python -m pip install httpx")
        sys.exit(1)

# Load .env file if present (sin pisar variables ya definidas)
env_file = Path(__file__).parent / ".env"
if env_file.exists():
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())

# ─── CONFIG ───────────────────────────────────────────────────────────────────

CONFIG_DIR = Path.home() / ".omniagent"
CONFIG_FILE = CONFIG_DIR / "config.json"
CACHE_DIR = CONFIG_DIR / "cache"
DEFAULT_TIMEOUT = 60.0
DEFAULT_MAX_TOKENS = 2048
CACHE_TTL = 3600  # 1 hour
MAX_RETRIES = 3
RETRY_BACKOFF = [1.0, 2.0, 4.0]  # seconds, before jitter

PROVIDERS = {
    "groq": {
        "name": "Groq",
        "kind": "openai",
        "base_url": "https://api.groq.com/openai/v1/chat/completions",
        "models": ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
        "env_key": "GROQ_API_KEY",
        "rpm": 30,
    },
    "google": {
        "name": "Google Gemini",
        "kind": "gemini",
        "base_url": "https://generativelanguage.googleapis.com/v1beta/models",
        "models": ["gemini-2.0-flash", "gemini-1.5-flash-8b"],
        "env_key": "GOOGLE_API_KEY",
        "rpm": 60,
    },
    "openrouter": {
        "name": "OpenRouter",
        "kind": "openai",
        "base_url": "https://openrouter.ai/api/v1/chat/completions",
        "models": ["meta-llama/llama-3.3-70b-instruct:free", "google/gemini-2.0-flash-exp:free", "deepseek/deepseek-chat:free"],
        "env_key": "OPENROUTER_API_KEY",
        "rpm": 20,
    },
    "nvidia": {
        "name": "NVIDIA NIM",
        "kind": "openai",
        "base_url": "https://integrate.api.nvidia.com/v1/chat/completions",
        "models": ["meta/llama-3.1-70b-instruct", "nvidia/llama-3.1-nemotron-70b-instruct"],
        "env_key": "NVIDIA_API_KEY",
        "rpm": 20,
    },
    "cerebras": {
        "name": "Cerebras",
        "kind": "openai",
        "base_url": "https://api.cerebras.ai/v1/chat/completions",
        "models": ["llama3.1-70b", "llama3.1-8b"],
        "env_key": "CEREBRAS_API_KEY",
        "rpm": 30,
    },
    "deepseek": {
        "name": "DeepSeek",
        "kind": "openai",
        "base_url": "https://api.deepseek.com/v1/chat/completions",
        "models": ["deepseek-chat", "deepseek-coder"],
        "env_key": "DEEPSEEK_API_KEY",
        "rpm": 20,
    },
}

TASK_TYPES = {
    "code": {"keywords": ["code", "function", "script", "implement", "fix", "debug", "refactor", "test"], "prefer": ["groq", "nvidia"], "model_idx": 0},
    "research": {"keywords": ["research", "analyze", "find", "compare", "investigate", "search"], "prefer": ["google", "openrouter"], "model_idx": 0},
    "creative": {"keywords": ["create", "design", "write", "generate", "imagine", "story"], "prefer": ["groq", "cerebras"], "model_idx": 0},
    "chat": {"keywords": ["hello", "hi", "how", "what", "why", "explain", "tell"], "prefer": ["groq", "google"], "model_idx": 1},
    "heavy": {"keywords": ["complex", "architecture", "system", "enterprise", "optimization"], "prefer": ["nvidia", "groq"], "model_idx": 0},
}


def build_request(provider: str, cfg: dict, api_key: str, model: str,
                  messages: List[dict], max_tokens: int) -> Tuple[str, dict, dict]:
    """Construye (url, headers, payload) según el tipo de API del proveedor."""
    if cfg["kind"] == "gemini":
        # Gemini NO es compatible con la API de chat/completions de OpenAI.
        contents = [{"parts": [{"text": m["content"]}]} for m in messages if m["role"] in ("user", "assistant")]
        payload: dict = {"contents": contents, "generationConfig": {"maxOutputTokens": max_tokens}}
        sys_msgs = [m["content"] for m in messages if m["role"] == "system"]
        if sys_msgs:
            payload["system_instruction"] = {"parts": [{"text": sys_msgs[0]}]}
        url = f"{cfg['base_url']}/{model}:generateContent"
        headers = {"x-goog-api-key": api_key, "Content-Type": "application/json"}
        return url, headers, payload

    # OpenAI-compatible (Groq, OpenRouter, NVIDIA, Cerebras, DeepSeek)
    url = cfg["base_url"]
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"model": model, "messages": messages, "max_tokens": max_tokens, "temperature": 0.7}
    return url, headers, payload


def extract_content(data: dict, provider: str) -> str:
    """Extrae el texto de la respuesta según el proveedor."""
    if provider == "google":
        try:
            return data["candidates"][0]["content"]["parts"][0]["text"].strip()
        except (KeyError, IndexError, TypeError) as exc:
            raise ValueError(f"Respuesta Gemini inesperada: {str(data)[:200]}") from exc
    try:
        return data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        raise ValueError(f"Respuesta inesperada de {provider}: {str(data)[:200]}") from exc


# ─── RATE LIMITER ─────────────────────────────────────────────────────────────

class RateLimiter:
    """Ventana deslizante de 60s: evita superar RPM del proveedor."""

    def __init__(self, rpm: int):
        self.rpm = rpm
        self.timestamps: List[float] = []

    def wait_if_needed(self):
        now = time.time()
        self.timestamps = [t for t in self.timestamps if now - t < 60]
        if len(self.timestamps) >= self.rpm:
            sleep_time = 60 - (now - self.timestamps[0]) + 0.1
            if sleep_time > 0:
                time.sleep(sleep_time)
        self.timestamps.append(time.time())


# ─── CACHE ────────────────────────────────────────────────────────────────────

class Cache:
    def __init__(self):
        CACHE_DIR.mkdir(parents=True, exist_ok=True)

    def _path(self, key: str) -> Path:
        return CACHE_DIR / f"{hashlib.md5(key.encode()).hexdigest()}.json"

    def get(self, key: str) -> Optional[str]:
        path = self._path(key)
        try:
            if path.exists():
                data = json.loads(path.read_text(encoding="utf-8"))
                if time.time() - data.get("ts", 0) < CACHE_TTL:
                    return data.get("response")
        except (json.JSONDecodeError, OSError):
            pass
        return None

    def set(self, key: str, response: str):
        try:
            self._path(key).write_text(
                json.dumps({"response": response, "ts": time.time()}), encoding="utf-8"
            )
        except OSError:
            pass  # cache es best-effort


# ─── PROVIDER POOL ────────────────────────────────────────────────────────────

class ProviderPool:
    def __init__(self, timeout: float = DEFAULT_TIMEOUT):
        self.timeout = timeout
        self.limiters = {name: RateLimiter(cfg["rpm"]) for name, cfg in PROVIDERS.items()}
        self.stats = {name: {"success": 0, "fail": 0} for name in PROVIDERS}
        self.client = httpx.Client(timeout=timeout)
        self.cache = Cache()

    def get_available_providers(self) -> List[str]:
        return [name for name, cfg in PROVIDERS.items() if os.environ.get(cfg["env_key"])]

    @staticmethod
    def classify_task(prompt: str) -> str:
        prompt_lower = prompt.lower()
        scores = {t: sum(1 for kw in c["keywords"] if kw in prompt_lower) for t, c in TASK_TYPES.items()}
        return max(scores, key=scores.get) if max(scores.values()) > 0 else "chat"

    def select_provider(self, task_type: str) -> Tuple[str, str]:
        available = self.get_available_providers()
        if not available:
            raise RuntimeError("No hay API keys configuradas. Define GROQ_API_KEY, GOOGLE_API_KEY, etc. (o usa el .env).")

        config = TASK_TYPES[task_type]
        for provider in config["prefer"]:
            if provider in available:
                return provider, PROVIDERS[provider]["models"][config["model_idx"]]
        provider = available[0]
        return provider, PROVIDERS[provider]["models"][0]

    def call(self, prompt: str, provider: str, model: str, system: str = "",
             max_tokens: int = DEFAULT_MAX_TOKENS) -> str:
        """Ejecuta una llamada con retries (429/5xx) y backoff exponencial."""
        self.limiters[provider].wait_if_needed()
        cfg = PROVIDERS[provider]
        api_key = os.environ.get(cfg["env_key"])
        if not api_key:
            raise RuntimeError(f"Falta la key para {cfg['name']} ({cfg['env_key']})")

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        url, headers, payload = build_request(provider, cfg, api_key, model, messages, max_tokens)

        last_error = None
        for attempt in range(MAX_RETRIES):
            try:
                resp = self.client.post(url, headers=headers, json=payload)
                if resp.status_code == 429 or resp.status_code >= 500:
                    # Reintento con backoff, respetando Retry-After si viene.
                    retry_after = None
                    try:
                        retry_after = float(resp.headers.get("Retry-After", 0))
                    except (TypeError, ValueError):
                        retry_after = 0.0
                    delay = retry_after if retry_after > 0 else RETRY_BACKOFF[attempt] if attempt < len(RETRY_BACKOFF) else 4.0
                    last_error = f"HTTP {resp.status_code} (intento {attempt + 1})"
                    print(f"  [retry {attempt + 1}] {provider}/{model}: {last_error} - esperando {delay:.1f}s")
                    time.sleep(delay + random_jitter())
                    continue
                resp.raise_for_status()
                result = extract_content(resp.json(), provider)
                self.stats[provider]["success"] += 1
                return result
            except httpx.HTTPStatusError as exc:
                self.stats[provider]["fail"] += 1
                raise RuntimeError(f"{provider}/{model} fallo HTTP {exc.response.status_code}: {exc.response.text[:200]}") from exc
            except (httpx.TimeoutException, httpx.ConnectError) as exc:
                last_error = f"timeout/connect: {exc}"
                if attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_BACKOFF[attempt] + random_jitter())
                    continue
                break
            except httpx.RequestError as exc:
                self.stats[provider]["fail"] += 1
                raise RuntimeError(f"{provider}/{model} error de red: {exc}") from exc

        self.stats[provider]["fail"] += 1
        raise RuntimeError(f"{provider}/{model} fallo tras {MAX_RETRIES} intentos ({last_error})")

    def route(self, prompt: str, system: str = "", max_tokens: int = DEFAULT_MAX_TOKENS,
              use_cache: bool = True) -> dict:
        cache_key = f"{system}\n{prompt}"
        if use_cache:
            cached = self.cache.get(cache_key)
            if cached:
                return {"response": cached, "provider": "cache", "model": "cached", "cached": True}

        task_type = self.classify_task(prompt)
        provider, model = self.select_provider(task_type)

        available = self.get_available_providers()
        errors: List[str] = []

        for p in [provider] + [ap for ap in available if ap != provider]:
            try:
                m = PROVIDERS[p]["models"][TASK_TYPES[task_type]["model_idx"]]
                result = self.call(prompt, p, m, system, max_tokens)
                if use_cache:
                    self.cache.set(cache_key, result)
                return {"response": result, "provider": p, "model": m, "task_type": task_type, "cached": False}
            except Exception as exc:  # noqa: BLE001 - fallback entre proveedores
                errors.append(str(exc))
                continue

        raise RuntimeError(f"Todos los proveedores fallaron: {'; '.join(errors)}")


def random_jitter() -> float:
    return random.uniform(0.0, 0.5)


# ─── CLI ──────────────────────────────────────────────────────────────────────

def print_banner():
    print("""
╔══════════════════════════════════════════════════╗
║          OMNIAGENT CLI - v1.1                    ║
║   Multi-Agent Orchestrator (Free Models)         ║
║   Groq | Gemini | OpenRouter | NVIDIA | Cerebras ║
╚══════════════════════════════════════════════════╝
""")


def cmd_providers(pool):
    available = pool.get_available_providers()
    print("\nProvider Status:")
    print("-" * 50)
    for name, cfg in PROVIDERS.items():
        status = "OK ACTIVE" if name in available else "NO KEY"
        stats = pool.stats[name]
        print(f"  {cfg['name']:20s} {status:12s} (ok:{stats['success']} fail:{stats['fail']})")
        if name in available:
            for m in cfg["models"][:2]:
                print(f"    L- {m}")
    print()


def cmd_stats(pool):
    print("\nUsage Statistics:")
    print("-" * 50)
    total_ok = sum(s["success"] for s in pool.stats.values())
    total_fail = sum(s["fail"] for s in pool.stats.values())
    print(f"  Total calls: {total_ok + total_fail}")
    print(f"  Successful: {total_ok}")
    print(f"  Failed: {total_fail}")
    for name, stats in pool.stats.items():
        if stats["success"] > 0 or stats["fail"] > 0:
            print(f"  {name}: {stats['success']}ok / {stats['fail']}fail")
    print()


def cmd_chat(pool, prompt: str, system: str = "", as_json: bool = False,
             max_tokens: int = DEFAULT_MAX_TOKENS, use_cache: bool = True):
    result = pool.route(prompt, system=system, max_tokens=max_tokens, use_cache=use_cache)
    if as_json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return
    tag = f"[{result['provider']}/{result['model']}]" + (" [CACHED]" if result.get("cached") else "")
    print(f"\n{tag}")
    print("-" * 50)
    print(result["response"])
    print("-" * 50)


def main():
    import argparse

    parser = argparse.ArgumentParser(
        prog="omniagent",
        description="Orquestador multi-agente con modelos IA gratuitos.",
    )
    parser.add_argument("prompt", nargs="*", help="Texto o prompt directo (si no se usa subcomando)")
    parser.add_argument("--json", action="store_true", help="Salida JSON")
    parser.add_argument("--system", default="", help="Mensaje de sistema para el modelo")
    parser.add_argument("--timeout", type=float, default=DEFAULT_TIMEOUT, help=f"Timeout HTTP (default {DEFAULT_TIMEOUT}s)")
    parser.add_argument("--max-tokens", type=int, default=DEFAULT_MAX_TOKENS, help=f"Max tokens (default {DEFAULT_MAX_TOKENS})")
    parser.add_argument("--no-cache", action="store_true", help="Desactiva la cache de respuestas")
    parser.add_argument("--no-banner", action="store_true", help="Omite el banner")

    # Subcomandos legacy (chat/providers/stats) como compatibilidad
    if len(sys.argv) > 1 and sys.argv[1] in ("chat", "providers", "stats"):
        print_banner()
        pool = ProviderPool()
        if sys.argv[1] == "providers":
            cmd_providers(pool)
        elif sys.argv[1] == "stats":
            cmd_stats(pool)
        else:
            args = parser.parse_args(sys.argv[2:] + ["--no-banner"])
            prompt = " ".join(args.prompt)
            if not prompt:
                print("Usage: omniagent chat <prompt>")
                sys.exit(1)
            cmd_chat(pool, prompt, system=args.system, as_json=args.json,
                     max_tokens=args.max_tokens, use_cache=not args.no_cache)
        return

    args = parser.parse_args()
    if not args.no_banner:
        print_banner()
    pool = ProviderPool(timeout=args.timeout)

    prompt = " ".join(args.prompt)
    if prompt:
        cmd_chat(pool, prompt, system=args.system, as_json=args.json,
                 max_tokens=args.max_tokens, use_cache=not args.no_cache)
        return

    # Interactive mode
    cmd_providers(pool)
    print("Escribe tu prompt (o 'quit' para salir):\n")
    while True:
        try:
            prompt = input("You> ").strip()
            if prompt.lower() in ("quit", "exit", "q"):
                break
            if prompt.lower() == "providers":
                cmd_providers(pool)
                continue
            if prompt.lower() == "stats":
                cmd_stats(pool)
                continue
            if prompt:
                cmd_chat(pool, prompt, system=args.system, as_json=args.json,
                         max_tokens=args.max_tokens, use_cache=not args.no_cache)
        except (KeyboardInterrupt, EOFError):
            break
    print("\nGoodbye!")


if __name__ == "__main__":
    main()
