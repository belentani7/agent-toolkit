"""
display.response — Formatted terminal output for answers and search results.

Handles citation formatting, source display, syntax highlighting hints,
and clean terminal presentation.
"""

import sys
import os


# ANSI color codes
class Colors:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    CYAN = "\033[36m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    RED = "\033[31m"
    WHITE = "\033[37m"


def supports_color():
    """Check if terminal supports ANSI colors."""
    if os.environ.get("NO_COLOR"):
        return False
    if not hasattr(sys.stdout, "isatty"):
        return False
    return sys.stdout.isatty()


class ResponseFormatter:
    """Formats and displays search results and LLM answers."""

    def __init__(self):
        self.colors = supports_color()

    def _c(self, color, text):
        """Apply color if supported."""
        if self.colors:
            return f"{color}{text}{Colors.RESET}"
        return text

    def print_answer(self, question, response):
        """Display a complete LLM answer with sources."""
        answer = response.get("answer", "")
        sources = response.get("sources", [])
        confidence = response.get("confidence", "unknown")

        # Question
        print()
        print(self._c(Colors.BOLD + Colors.CYAN, f"  ❓ {question}"))
        print()

        # Answer box
        terminal_width = self._terminal_width()
        border = "─" * (terminal_width - 4)

        print(f"  {self._c(Colors.DIM, '┌' + border + '┐')}")
        for line in answer.split("\n"):
            # Word wrap within box
            wrapped = self._wrap(line, terminal_width - 8)
            for wline in wrapped:
                print(f"  {self._c(Colors.DIM, '│')} {wline}")
        print(f"  {self._c(Colors.DIM, '└' + border + '┘')}")
        print()

        # Confidence indicator
        conf_colors = {
            "high": Colors.GREEN,
            "medium": Colors.YELLOW,
            "low": Colors.RED,
        }
        conf_color = conf_colors.get(confidence, Colors.DIM)
        print(f"  {self._c(conf_color + Colors.BOLD, f'  Confidence: {confidence}')}")
        print()

        # Sources
        if sources:
            print(f"  {self._c(Colors.BOLD, 'Sources:')}")
            for i, src in enumerate(sources, 1):
                title = src.get("title", "Unknown")
                score = src.get("score", 0)
                chunk_idx = src.get("chunk_index", 0)
                score_str = f"({score:.0%} match)" if score else ""
                print(f"    {self._c(Colors.BLUE, f'[{i}]')} {title} — chunk {chunk_idx + 1} {self._c(Colors.DIM, score_str)}")
            print()

    def print_search_results(self, results):
        """Display raw search results."""
        print()
        print(self._c(Colors.BOLD, f"  🔍 Search Results ({len(results)} found)\n"))

        for i, result in enumerate(results, 1):
            title = result.get("title", "Unknown")
            content = result.get("content", "")
            score = result.get("score", 0)
            source_type = result.get("source_type", "")

            # Truncate long content
            display_content = content[:300]
            if len(content) > 300:
                display_content += "..."

            print(f"  {self._c(Colors.BLUE, f'[{i}]')} {self._c(Colors.BOLD, title)} {self._c(Colors.DIM, f'({score:.0%})')}")
            print(f"      {self._c(Colors.DIM, display_content)}")
            print()

    def _terminal_width(self):
        """Get terminal width."""
        try:
            return os.get_terminal_size().columns
        except (AttributeError, OSError):
            return 80

    def _wrap(self, text, width):
        """Simple word wrap."""
        if not text:
            return [""]
        words = text.split()
        lines = []
        current = []
        current_len = 0

        for word in words:
            if current_len + len(word) + 1 > width and current:
                lines.append(" ".join(current))
                current = [word]
                current_len = len(word)
            else:
                current.append(word)
                current_len += len(word) + 1

        if current:
            lines.append(" ".join(current))

        return lines or [""]
