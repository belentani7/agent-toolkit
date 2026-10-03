"""Chambers and provider chains. No secrets stored here."""

CHAMBERS = {
    "orchestrator": "Task routing, planning, coordination.",
    "architect": "Architecture decisions, reviews, ADRs.",
    "frontend": "React, Vite, Tailwind, motion.",
    "backend": "Express, APIs, auth, DB.",
    "design": "Visual audit, tokens, accessibility.",
    "research": "Tech eval, model selection, benchmarks.",
    "security": "PII audit, gitleaks, deps, headers.",
    "test": "Vitest, Playwright, coverage.",
    "debug": "Root cause, reproduction, fix verify.",
    "documentation": "PROJECT_MAP, ARCHITECTURE, CHANGELOG.",
    "mobile": "Phone node, offline Ollama, Termux tasks.",
}

PROVIDER_CHAINS = {
    "orchestrator": ["google", "groq", "ollama"],
    "architect": ["google", "groq", "ollama"],
    "frontend": ["groq", "google", "ollama"],
    "backend": ["google", "groq", "ollama"],
    "design": ["google", "groq", "ollama"],
    "research": ["groq", "google", "ollama"],
    "security": ["google", "groq", "ollama"],
    "test": ["groq", "google", "ollama"],
    "debug": ["google", "groq", "ollama"],
    "documentation": ["groq", "google", "ollama"],
    "mobile": ["ollama", "groq", "google"],
}

PROVIDER_ENV = {
    "google": "GOOGLE_AI_API_KEY",
    "groq": "GROQ_API_KEY",
    "together": "TOGETHER_API_KEY",
    "openrouter": "OPENROUTER_API_KEY",
    "deepseek": "DEEPSEEK_API_KEY",
    "anthropic": "ANTHROPIC_API_KEY",
    "openai": "OPENAI_API_KEY",
    "ollama": None,
}
