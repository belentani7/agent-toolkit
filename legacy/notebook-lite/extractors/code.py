"""
extractors.code — Source code extraction.

Handles Python, JavaScript, TypeScript, Java, C++, Go, Rust, etc.
Extracts functions, classes, docstrings/comments with structure preservation.
"""

import re
import os


# Language-specific patterns for structure extraction
PATTERNS = {
    ".py": {
        "function": re.compile(r"^(?:async\s+)?def\s+(\w+)\s*\(", re.MULTILINE),
        "class": re.compile(r"^class\s+(\w+)", re.MULTILINE),
        "comment": re.compile(r'(?:"""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\'|#.*$)', re.MULTILINE),
    },
    ".js": {
        "function": re.compile(r"(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\(.*?\)\s*=>))", re.MULTILINE),
        "class": re.compile(r"class\s+(\w+)", re.MULTILINE),
        "comment": re.compile(r"(?://.*$|/\*[\s\S]*?\*/)", re.MULTILINE),
    },
    ".ts": {
        "function": re.compile(r"(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\(.*?\)\s*=>))", re.MULTILINE),
        "class": re.compile(r"(?:class|interface|type)\s+(\w+)", re.MULTILINE),
        "comment": re.compile(r"(?://.*$|/\*[\s\S]*?\*/)", re.MULTILINE),
    },
    ".java": {
        "function": re.compile(r"(?:public|private|protected|static|\s)+[\w<>\[\]]+\s+(\w+)\s*\(", re.MULTILINE),
        "class": re.compile(r"(?:class|interface|enum)\s+(\w+)", re.MULTILINE),
        "comment": re.compile(r"(?://.*$|/\*[\s\S]*?\*/)", re.MULTILINE),
    },
    ".cpp": {
        "function": re.compile(r"(?:[\w:*&<>]+\s+(\w+)\s*\([^)]*\)\s*(?:const)?\s*\{)", re.MULTILINE),
        "class": re.compile(r"(?:class|struct)\s+(\w+)", re.MULTILINE),
        "comment": re.compile(r"(?://.*$|/\*[\s\S]*?\*/)", re.MULTILINE),
    },
    ".go": {
        "function": re.compile(r"func\s+(?:\(\w+\s+\*?\w+\)\s+)?(\w+)\s*\(", re.MULTILINE),
        "class": re.compile(r"type\s+(\w+)\s+(?:struct|interface)", re.MULTILINE),
        "comment": re.compile(r"(?://.*$|/\*[\s\S]*?\*/)", re.MULTILINE),
    },
    ".rs": {
        "function": re.compile(r"(?:pub\s+)?fn\s+(\w+)", re.MULTILINE),
        "class": re.compile(r"(?:pub\s+)?(?:struct|enum|trait|impl)\s+(\w+)", re.MULTILINE),
        "comment": re.compile(r"(?://.*$|/\*[\s\S]*?\*/)", re.MULTILINE),
    },
}

# Map aliases
PATTERNS[".c"] = PATTERNS[".cpp"]
PATTERNS[".jsx"] = PATTERNS[".js"]
PATTERNS[".tsx"] = PATTERNS[".ts"]
PATTERNS[".rb"] = {
    "function": re.compile(r"def\s+(\w+)", re.MULTILINE),
    "class": re.compile(r"class\s+(\w+)", re.MULTILINE),
    "comment": re.compile(r"#.*$", re.MULTILINE),
}


def extract_code(filepath):
    """Extract text from a source code file.

    Args:
        filepath: Path to source file

    Returns:
        Tuple of (text, metadata)
    """
    ext = os.path.splitext(filepath)[1].lower()
    filename = os.path.basename(filepath)

    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    if not content.strip():
        return "", {"pages": 0}

    # Build enhanced text with structure annotations
    enhanced = _enhance_code(content, ext, filename)

    lines = content.count("\n") + 1
    return enhanced, {"pages": max(1, lines // 50), "lines": lines}


def _enhance_code(content, ext, filename):
    """Add structural annotations to code."""
    patterns = PATTERNS.get(ext, {})
    if not patterns:
        return f"[File: {filename}]\n{content}"

    parts = [f"[File: {filename}]\n"]

    # Extract structure overview
    structure = []
    for kind, pattern in patterns.items():
        for match in pattern.finditer(content):
            name = next((g for g in match.groups() if g), "unknown")
            line_num = content[:match.start()].count("\n") + 1
            structure.append(f"  {kind}: {name} (line {line_num})")

    if structure:
        parts.append("[Structure]\n" + "\n".join(structure) + "\n")

    # Full content
    parts.append(content)

    return "\n".join(parts)
