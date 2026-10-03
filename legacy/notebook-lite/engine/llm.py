"""
engine.llm — LLM integration layer.

Supports multiple backends:
- Ollama (local, offline)
- OpenAI API
- Claude (Anthropic) API
- Qwen / DashScope API
- Raw search-only mode (no LLM)

Configurable via config.yaml. Streams responses when possible.
"""

import json
import sys
import urllib.request
import urllib.error


class LLMClient:
    """Unified interface to LLM backends."""

    def __init__(self, config=None):
        self.config = config or {}
        llm_config = self.config.get("llm", {})
        self.provider = llm_config.get("provider", "ollama")
        self.model = llm_config.get("model", "llama3.2")
        self.url = llm_config.get("url", "http://localhost:11434")
        self.api_key = llm_config.get("api_key", "")
        self.temperature = llm_config.get("temperature", 0.3)
        self.max_tokens = llm_config.get("max_tokens", 1024)
        self._available = None

    def is_available(self):
        """Check if the configured LLM is reachable."""
        if self._available is not None:
            return self._available

        if self.provider == "none":
            self._available = False
            return False

        try:
            if self.provider == "ollama":
                return self._check_ollama()
            elif self.provider in ("openai", "qwen"):
                self._available = bool(self.api_key)
                return self._available
            elif self.provider == "claude":
                self._available = bool(self.api_key)
                return self._available
        except Exception:
            pass

        self._available = False
        return False

    def generate(self, prompt):
        """Generate a complete response."""
        if self.provider == "none" or not self.is_available():
            return self._no_llm_response()

        try:
            if self.provider == "ollama":
                return self._generate_ollama(prompt)
            elif self.provider == "openai":
                return self._generate_openai(prompt)
            elif self.provider == "qwen":
                return self._generate_qwen(prompt)
            elif self.provider == "claude":
                return self._generate_claude(prompt)
        except Exception as e:
            return f"⚠ LLM error: {e}\n\nShowing search results only (use --no-llm for search-only mode)."

    def generate_stream(self, prompt):
        """Generate with streaming output."""
        if self.provider == "none" or not self.is_available():
            return self._no_llm_response()

        try:
            if self.provider == "ollama":
                return self._stream_ollama(prompt)
            else:
                # Fallback to non-streaming
                return self.generate(prompt)
        except Exception as e:
            return f"⚠ LLM error: {e}"

    # ─── Ollama ──────────────────────────────────────────────────

    def _check_ollama(self):
        """Check if Ollama is running."""
        try:
            req = urllib.request.Request(f"{self.url}/api/tags")
            with urllib.request.urlopen(req, timeout=3) as resp:
                self._available = True
                return True
        except Exception:
            self._available = False
            return False

    def _generate_ollama(self, prompt):
        """Generate via Ollama API."""
        data = json.dumps({
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "num_predict": self.max_tokens,
            }
        }).encode("utf-8")

        req = urllib.request.Request(
            f"{self.url}/api/generate",
            data=data,
            headers={"Content-Type": "application/json"},
        )

        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result.get("response", "")

    def _stream_ollama(self, prompt):
        """Stream response from Ollama."""
        data = json.dumps({
            "model": self.model,
            "prompt": prompt,
            "stream": True,
            "options": {
                "temperature": self.temperature,
                "num_predict": self.max_tokens,
            }
        }).encode("utf-8")

        req = urllib.request.Request(
            f"{self.url}/api/generate",
            data=data,
            headers={"Content-Type": "application/json"},
        )

        full_response = []
        with urllib.request.urlopen(req, timeout=120) as resp:
            for line in resp:
                line = line.decode("utf-8").strip()
                if line:
                    chunk = json.loads(line)
                    token = chunk.get("response", "")
                    if token:
                        sys.stdout.write(token)
                        sys.stdout.flush()
                        full_response.append(token)

        print()  # Final newline
        return "".join(full_response)

    # ─── OpenAI ──────────────────────────────────────────────────

    def _generate_openai(self, prompt):
        """Generate via OpenAI-compatible API."""
        data = json.dumps({
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a helpful research assistant."},
                {"role": "user", "content": prompt},
            ],
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }).encode("utf-8")

        base_url = self.url or "https://api.openai.com/v1"
        req = urllib.request.Request(
            f"{base_url}/chat/completions",
            data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
        )

        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result["choices"][0]["message"]["content"]

    # ─── Qwen / DashScope ────────────────────────────────────────

    def _generate_qwen(self, prompt):
        """Generate via DashScope (Qwen) API."""
        data = json.dumps({
            "model": self.model,
            "input": {
                "messages": [
                    {"role": "system", "content": "You are a helpful research assistant."},
                    {"role": "user", "content": prompt},
                ]
            },
            "parameters": {
                "temperature": self.temperature,
                "max_tokens": self.max_tokens,
            }
        }).encode("utf-8")

        base_url = self.url or "https://dashscope.aliyuncs.com/api/v1"
        req = urllib.request.Request(
            f"{base_url}/services/aigc/text-generation/generation",
            data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
        )

        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result.get("output", {}).get("text", "")

    # ─── Claude ──────────────────────────────────────────────────

    def _generate_claude(self, prompt):
        """Generate via Anthropic Claude API."""
        data = json.dumps({
            "model": self.model or "claude-sonnet-4-20250514",
            "max_tokens": self.max_tokens,
            "messages": [
                {"role": "user", "content": prompt},
            ],
        }).encode("utf-8")

        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=data,
            headers={
                "Content-Type": "application/json",
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
            },
        )

        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result["content"][0]["text"]

    # ─── Fallback ────────────────────────────────────────────────

    def _no_llm_response(self):
        """Response when no LLM is configured."""
        return (
            "No LLM configured. Showing raw search results.\n"
            "Configure an LLM in ~/.notebook-lite/config.yaml for synthesized answers.\n\n"
            "Install Ollama for offline LLM:\n"
            "  curl -fsSL https://ollama.ai/install.sh | sh\n"
            "  ollama pull llama3.2"
        )

    def close(self):
        """Clean up."""
        self._available = None
