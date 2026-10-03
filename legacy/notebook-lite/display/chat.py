"""
display.chat — Interactive chat mode for terminal.

Multi-turn conversation with streaming responses, command history,
context source display, and clean terminal UX.
"""

import sys
import os
from datetime import datetime

from engine.search import SearchEngine
from engine.chat import ChatEngine
from display.response import ResponseFormatter, Colors, supports_color


BANNER = r"""
  ╔══════════════════════════════════════════════╗
  ║          notebook-lite · chat mode            ║
  ╠══════════════════════════════════════════════╣
  ║  Ask questions about your documents.         ║
  ║  Type /help for commands, Ctrl+D to exit.    ║
  ╚══════════════════════════════════════════════╝
"""

HELP_TEXT = """
  Commands:
    /help        Show this help
    /clear       Clear conversation history
    /sources     Toggle source display
    /compact     Show compact output
    /history     Show conversation history
    /exit        Exit chat mode

  Tips:
    • Ask follow-up questions — context is maintained
    • Press Enter on empty line to submit multi-line input
    • Ctrl+D to exit
"""


class InteractiveChat:
    """Interactive chat session in the terminal."""

    def __init__(self, config, data_dir):
        self.config = config
        self.data_dir = data_dir
        self.searcher = SearchEngine(data_dir, config)
        self.chat = ChatEngine(data_dir, config)
        self.formatter = ResponseFormatter()
        self.show_sources = True
        self.compact = False
        self.colors = supports_color()

    def _c(self, color, text):
        if self.colors:
            return f"{color}{text}{Colors.RESET}"
        return text

    def run(self):
        """Start the interactive chat loop."""
        print(BANNER)

        # Check LLM availability
        if self.chat.llm.is_available():
            provider = self.config.get("llm", {}).get("provider", "unknown")
            model = self.config.get("llm", {}).get("model", "unknown")
            print(f"  {self._c(Colors.GREEN, '✓')} LLM: {provider}/{model}")
        else:
            print(f"  {self._c(Colors.YELLOW, '⚠')} No LLM available — search-only mode")
            print(f"    Install Ollama for offline chat: curl -fsSL https://ollama.ai/install.sh | sh")
        print()

        while True:
            try:
                question = self._read_input()
            except (EOFError, KeyboardInterrupt):
                print(f"\n\n  {self._c(Colors.DIM, 'Goodbye! 👋')}\n")
                break

            if not question:
                continue

            # Handle commands
            if question.startswith("/"):
                if self._handle_command(question):
                    continue
                else:
                    break  # /exit

            # Process question
            self._process_question(question)

        self.searcher.close()
        self.chat.close()

    def _read_input(self):
        """Read user input, supporting multi-line."""
        prompt = self._c(Colors.CYAN + Colors.BOLD, "  you ❯ ")
        lines = []

        try:
            first = input(prompt).strip()
        except EOFError:
            raise

        if not first:
            return ""

        lines.append(first)

        # If line ends with \, read more
        while first.endswith("\\"):
            lines[-1] = lines[-1][:-1]  # Remove trailing backslash
            try:
                continuation = input("       ... ").strip()
                lines.append(continuation)
                first = continuation
            except EOFError:
                break

        return "\n".join(lines)

    def _handle_command(self, cmd):
        """Handle chat commands. Returns False to exit."""
        cmd = cmd.strip().lower()

        if cmd == "/exit" or cmd == "/quit":
            return False
        elif cmd == "/help":
            print(HELP_TEXT)
        elif cmd == "/clear":
            self.chat.clear_history()
            print(f"  {self._c(Colors.GREEN, '✓')} Conversation cleared.")
        elif cmd == "/sources":
            self.show_sources = not self.show_sources
            state = "on" if self.show_sources else "off"
            print(f"  {self._c(Colors.GREEN, '✓')} Sources: {state}")
        elif cmd == "/compact":
            self.compact = not self.compact
            state = "on" if self.compact else "off"
            print(f"  {self._c(Colors.GREEN, '✓')} Compact mode: {state}")
        elif cmd == "/history":
            self._show_history()
        else:
            print(f"  Unknown command: {cmd}. Type /help for commands.")

        return True

    def _process_question(self, question):
        """Search and answer a question."""
        top_k = self.config.get("top_k", 5)

        # Search
        print(f"\n  {self._c(Colors.DIM, '🔍 Searching...')}")
        results = self.searcher.search(question, top_k=top_k)

        if not results:
            print(f"  {self._c(Colors.YELLOW, '⚠')} No relevant content found. Try adding more documents.")
            print()
            return

        # Answer
        if self.chat.llm.is_available() and not self.compact:
            print(f"  {self._c(Colors.DIM, '💭 Thinking...')}\n")
            response = self.chat.answer(question, results, stream=True)
            # Stream already printed, but we still want sources
            if self.show_sources and response.get("sources"):
                print()
                print(f"  {self._c(Colors.BOLD, 'Sources:')}")
                for i, src in enumerate(response["sources"], 1):
                    title = src.get("title", "?")
                    score = src.get("score", 0)
                    print(f"    {self._c(Colors.BLUE, f'[{i}]')} {title} ({score:.0%})")
        else:
            # Search-only mode
            response = self.chat.answer(question, results)
            self.formatter.print_answer(question, response)

        print()

    def _show_history(self):
        """Display conversation history."""
        history = self.chat.history
        if not history:
            print("  No conversation history.")
            return

        print(f"\n  {self._c(Colors.BOLD, 'Conversation History:')}\n")
        for i, h in enumerate(history[-10:], 1):
            q = h["question"][:60]
            if len(h["question"]) > 60:
                q += "..."
            print(f"  {self._c(Colors.CYAN, f'{i}.')} {q}")
        print()
