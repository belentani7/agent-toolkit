"""
notebook-lite — pip-installable entry point.

This module is referenced by setup.py console_scripts:
    notebook-lite=notebook_lite:main

It re-exports the main() function from the CLI script.
"""

import sys
import os

# Ensure the package root is in path
_pkg_dir = os.path.dirname(os.path.abspath(__file__))
if _pkg_dir not in sys.path:
    sys.path.insert(0, _pkg_dir)


def main():
    """Entry point for pip-installed notebook-lite."""
    # Import and run the CLI
    from importlib import import_module
    import runpy

    # Run the notebook-lite script
    script = os.path.join(_pkg_dir, "notebook-lite")
    if os.path.exists(script):
        runpy.run_path(script, run_name="__main__")
    else:
        print("notebook-lite: entry point script not found.")
        print(f"Expected: {script}")
        sys.exit(1)


if __name__ == "__main__":
    main()
