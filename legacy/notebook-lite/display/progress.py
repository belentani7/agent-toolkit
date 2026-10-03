"""
display.progress — Progress indicators for terminal.

Simple progress bar and tick-based progress for indexing,
searching, and LLM generation.
"""

import sys
import time
import shutil


class Progress:
    """Progress indicator with tick-based updates."""

    def __init__(self, total, label=""):
        self.total = total
        self.current = 0
        self.label = label
        self.start_time = time.time()
        self.bar_width = 30

    def tick(self, message=""):
        """Advance progress by one step."""
        self.current += 1
        pct = self.current / max(self.total, 1)
        filled = int(self.bar_width * pct)
        bar = "█" * filled + "░" * (self.bar_width - filled)

        elapsed = time.time() - self.start_time
        eta = (elapsed / max(self.current, 1)) * (self.total - self.current) if self.current < self.total else 0

        status = f"\r  [{bar}] {self.current}/{self.total}"
        if message:
            status += f" — {message}"
        if self.current < self.total:
            status += f"  ({eta:.0f}s left)"

        # Clear line and print
        try:
            width = shutil.get_terminal_size().columns
        except Exception:
            width = 80
        sys.stdout.write(status[:width] + "\r")
        sys.stdout.flush()

    def done(self):
        """Mark progress as complete."""
        elapsed = time.time() - self.start_time
        bar = "█" * self.bar_width
        sys.stdout.write(f"\r  [{bar}] {self.total}/{self.total} ✓ ({elapsed:.1f}s)\n")
        sys.stdout.flush()


class Spinner:
    """Simple spinner for indeterminate progress."""

    FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

    def __init__(self, message=""):
        self.message = message
        self.frame = 0
        self._active = False

    def start(self):
        """Start spinner (call update() in a loop)."""
        self._active = True

    def update(self):
        """Advance spinner frame."""
        if not self._active:
            return
        char = self.FRAMES[self.frame % len(self.FRAMES)]
        sys.stdout.write(f"\r  {char} {self.message}")
        sys.stdout.flush()
        self.frame += 1

    def stop(self, message=""):
        """Stop spinner."""
        self._active = False
        final = message or self.message
        sys.stdout.write(f"\r  ✓ {final}\n")
        sys.stdout.flush()
