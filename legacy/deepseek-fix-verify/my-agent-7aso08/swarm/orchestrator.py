"""Orchestrator: route to chamber, failover, queue on block."""
from .config import CHAMBERS, PROVIDER_CHAINS
from .providers import call_with_failover
from . import context_store as ctx


class Orchestrator:
    def status(self) -> dict:
        return {
            "chambers": list(CHAMBERS.keys()),
            "chains": PROVIDER_CHAINS,
            "session": ctx.load(),
        }

    def run(self, chamber: str, prompt: str, session: str = "omega") -> dict:
        if chamber not in CHAMBERS:
            return {"ok": False, "error": f"unknown chamber {chamber}"}
        chain = PROVIDER_CHAINS[chamber]
        full = f"[{chamber}] {CHAMBERS[chamber]}\nTask: {prompt}"
        provider, text = call_with_failover(chain, full)
        if provider == "queued":
            q = ctx.enqueue(chamber, prompt)
            ctx.save(prompt, {"session": session, "chamber": chamber, "status": "blocked", "queue": q})
            return {"ok": False, "blocked": True, "queue": q, "detail": text}
        ctx.save(prompt, {"session": session, "chamber": chamber, "provider": provider, "status": "done"})
        return {"ok": True, "provider": provider, "chamber": chamber, "text": text}
