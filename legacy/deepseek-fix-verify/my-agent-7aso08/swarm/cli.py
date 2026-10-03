#!/usr/bin/env python3
"""belentani-swarm CLI: status, chamber, sync, context."""
import argparse
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from swarm.orchestrator import Orchestrator
from swarm import context_store as ctx
from swarm.config import PROVIDER_ENV


def cmd_status(_a):
    print(json.dumps(Orchestrator().status(), indent=2))


def cmd_chamber(a):
    out = Orchestrator().run(a.chamber, a.prompt, session=a.session)
    print(json.dumps(out, indent=2, ensure_ascii=False))
    if not out.get("ok"):
        root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        ctx.handoff(
            os.path.join(root, "CONTEXT_HANDOFF.md"),
            resultado=f"blocked chamber={a.chamber}",
            cambios="queued prompt for resume",
            verificacion="not verified",
            pendientes=out.get("queue", ""),
            siguiente=f"resume: python -m swarm.cli chamber {a.chamber} --prompt ...",
        )


def cmd_sync(a):
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if a.action == "push":
        subprocess.run(["git", "add", "-A"], cwd=root)
        subprocess.run(["git", "commit", "-m", a.message or "swarm: sync"], cwd=root)
        subprocess.run(["git", "push"], cwd=root)
    elif a.action == "pull":
        subprocess.run(["git", "pull"], cwd=root)
    else:
        r = subprocess.run(["git", "status", "--short"], cwd=root, capture_output=True, text=True)
        print(r.stdout or "clean")


def cmd_context(a):
    if a.action == "save":
        print(ctx.save(a.task, {"session": a.session, "note": a.task}))
    else:
        print(json.dumps(ctx.load(a.session), indent=2))


def cmd_keys(_a):
    missing = [p for p, e in PROVIDER_ENV.items() if e and not os.getenv(e)]
    print("missing provider keys: " + (", ".join(missing) if missing else "none"))


def main():
    p = argparse.ArgumentParser(prog="belentani-swarm")
    s = p.add_subparsers(dest="cmd", required=True)
    s.add_parser("status").set_defaults(f=cmd_status)
    c = s.add_parser("chamber")
    c.add_argument("chamber")
    c.add_argument("prompt", nargs="?", default="")
    c.add_argument("--prompt", dest="prompt_opt", default="")
    c.add_argument("--session", default="omega")
    c.set_defaults(f=cmd_chamber)
    y = s.add_parser("sync")
    y.add_argument("action", choices=["push", "pull", "status"])
    y.add_argument("--message", default="")
    y.set_defaults(f=cmd_sync)
    x = s.add_parser("context")
    x.add_argument("action", choices=["save", "resume"])
    x.add_argument("task", nargs="?", default="")
    x.add_argument("--session", default="latest")
    x.set_defaults(f=cmd_context)
    s.add_parser("keys").set_defaults(f=cmd_keys)
    a = p.parse_args()
    if getattr(a, "prompt_opt", ""):
        a.prompt = a.prompt_opt
    a.f(a)


if __name__ == "__main__":
    main()
