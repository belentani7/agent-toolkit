"""Context store: file-based shared memory surviving restarts/blocks."""
import json
import os
import time

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "swarm")
CTX = os.path.join(ROOT, "context")
QUEUE = os.path.join(ROOT, "queue")


def _ensure():
    os.makedirs(CTX, exist_ok=True)
    os.makedirs(QUEUE, exist_ok=True)


def save(task: str, state: dict) -> str:
    _ensure()
    sid = state.get("session", f"s-{int(time.time())}")
    path = os.path.join(CTX, f"{sid}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"task": task, **state, "updated": time.time()}, f, indent=2)
    with open(os.path.join(CTX, "latest.json"), "w", encoding="utf-8") as f:
        json.dump({"session": sid, "task": task}, f, indent=2)
    return path


def load(session: str = "latest") -> dict:
    _ensure()
    if session == "latest":
        p = os.path.join(CTX, "latest.json")
        if not os.path.exists(p):
            return {}
        with open(p, encoding="utf-8") as f:
            meta = json.load(f)
        session = meta.get("session", "latest")
    p = os.path.join(CTX, f"{session}.json")
    if not os.path.exists(p):
        return {}
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def enqueue(chamber: str, prompt: str) -> str:
    _ensure()
    name = f"q-{int(time.time()*1000)}-{chamber}.json"
    path = os.path.join(QUEUE, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"chamber": chamber, "prompt": prompt, "ts": time.time()}, f, indent=2)
    return path


def handoff(path: str, resultado: str, cambios: str, verificacion: str, pendientes: str, siguiente: str):
    with open(path, "w", encoding="utf-8") as f:
        f.write(
            "# CONTEXT_HANDOFF\n\n"
            f"RESULTADO:\n{resultado}\n\nCAMBIOS:\n{cambios}\n\n"
            f"VERIFICACIÓN:\n{verificacion}\n\nPENDIENTES:\n{pendientes}\n\n"
            f"SIGUIENTE ACCIÓN:\n{siguiente}\n"
        )
    return path
