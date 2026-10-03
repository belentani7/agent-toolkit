"""Provider adapters, stdlib only. Failover: primary -> fallback -> local -> queue."""
import json
import os
import urllib.request
import urllib.error
from .config import PROVIDER_ENV


def has_key(provider: str) -> bool:
    env = PROVIDER_ENV.get(provider)
    if env is None:  # ollama local
        return True
    return bool(os.getenv(env))


def _post(url: str, payload: dict, headers: dict, timeout: int = 30) -> dict:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={**{"Content-Type": "application/json"}, **headers},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def call_google(prompt: str) -> str:
    key = os.getenv("GOOGLE_AI_API_KEY", "")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={key}"
    data = _post(url, {"contents": [{"parts": [{"text": prompt}]}]}, {})
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        return json.dumps(data)[:2000]


def call_groq(prompt: str) -> str:
    key = os.getenv("GROQ_API_KEY", "")
    data = _post(
        "https://api.groq.com/openai/v1/chat/completions",
        {"model": "llama-3.3-70b-versatile", "messages": [{"role": "user", "content": prompt}]},
        {"Authorization": f"Bearer {key}"},
    )
    return data["choices"][0]["message"]["content"]


def call_ollama(prompt: str, model: str = "llama3.2:3b") -> str:
    data = _post(
        "http://localhost:11434/api/generate",
        {"model": model, "prompt": prompt, "stream": False},
        {},
        timeout=120,
    )
    return data.get("response", json.dumps(data)[:2000])


CALLERS = {"google": call_google, "groq": call_groq, "ollama": call_ollama}


def call_with_failover(chain, prompt: str) -> tuple[str, str]:
    """Try each provider in chain. Return (provider, text). Queue if all blocked."""
    errors = []
    for provider in chain:
        if not has_key(provider):
            errors.append(f"{provider}:missing-key")
            continue
        try:
            text = CALLERS[provider](prompt)
            return provider, text
        except urllib.error.HTTPError as e:
            errors.append(f"{provider}:http-{e.code}")
            continue
        except Exception as e:
            errors.append(f"{provider}:{type(e).__name__}")
            continue
    return "queued", "BLOCKED:" + "|".join(errors) + "::" + prompt[:500]
