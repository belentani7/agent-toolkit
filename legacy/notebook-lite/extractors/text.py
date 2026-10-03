"""
extractors.text — Plain text extraction.

Handles TXT, CSV, JSON, YAML, XML, HTML, logs, configs.
Auto-detects encoding. Preserves structure.
"""

import os


# Common encodings to try
ENCODINGS = ["utf-8", "latin-1", "cp1252", "ascii", "utf-16"]


def extract_text(filepath):
    """Extract text from a plain text file.

    Args:
        filepath: Path to text file

    Returns:
        Tuple of (text, metadata)
    """
    ext = os.path.splitext(filepath)[1].lower()
    filename = os.path.basename(filepath)

    # Read with encoding detection
    content = _read_file(filepath)
    if not content or not content.strip():
        return "", {"pages": 0}

    # Add structure hints for specific formats
    if ext == ".csv":
        content = _enhance_csv(content, filename)
    elif ext == ".json":
        content = _enhance_json(content, filename)
    elif ext in (".yaml", ".yml"):
        content = _enhance_yaml(content, filename)
    elif ext == ".xml":
        content = _enhance_xml(content, filename)
    else:
        content = f"[File: {filename}]\n{content}"

    lines = content.count("\n") + 1
    pages = max(1, len(content) // 3000)

    return content, {"pages": pages, "lines": lines}


def _read_file(filepath):
    """Read file with encoding auto-detection."""
    for enc in ENCODINGS:
        try:
            with open(filepath, "r", encoding=enc) as f:
                return f.read()
        except (UnicodeDecodeError, UnicodeError):
            continue
    # Last resort: binary-safe read
    with open(filepath, "rb") as f:
        return f.read().decode("utf-8", errors="replace")


def _enhance_csv(content, filename):
    """Add CSV structure info."""
    lines = content.strip().split("\n")
    header = lines[0] if lines else ""
    num_cols = header.count(",") + 1
    num_rows = len(lines)
    return f"[File: {filename} — CSV: {num_rows} rows, {num_cols} columns]\n{content}"


def _enhance_json(content, filename):
    """Add JSON structure info."""
    import json as json_mod
    try:
        data = json_mod.loads(content)
        if isinstance(data, dict):
            keys = list(data.keys())[:20]
            info = f"JSON object with keys: {', '.join(keys)}"
        elif isinstance(data, list):
            info = f"JSON array with {len(data)} items"
        else:
            info = "JSON data"
    except Exception:
        info = "JSON file"
    return f"[File: {filename} — {info}]\n{content}"


def _enhance_yaml(content, filename):
    """Add YAML structure info."""
    # Extract top-level keys
    import re
    keys = re.findall(r"^(\w[\w\s-]*):", content, re.MULTILINE)
    info = f"YAML config with sections: {', '.join(keys[:15])}" if keys else "YAML file"
    return f"[File: {filename} — {info}]\n{content}"


def _enhance_xml(content, filename):
    """Add XML structure info."""
    import re
    tags = re.findall(r"<(\w+)", content)
    unique_tags = list(dict.fromkeys(tags))[:15]
    info = f"XML with elements: {', '.join(unique_tags)}" if unique_tags else "XML file"
    return f"[File: {filename} — {info}]\n{content}"
