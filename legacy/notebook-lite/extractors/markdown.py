"""
extractors.markdown — Markdown text extraction.

Parses markdown structure: headers, lists, code blocks, links.
Preserves formatting and hierarchical context for better retrieval.
"""

import re
import os


def extract_markdown(filepath):
    """Extract text from a Markdown file.

    Args:
        filepath: Path to .md file

    Returns:
        Tuple of (text, metadata)
    """
    with open(filepath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    if not content.strip():
        return "", {"pages": 0}

    # Count headers as rough "page" proxy
    headers = len(re.findall(r"^#{1,6}\s", content, re.MULTILINE))

    # Enhance context: prepend header path to each section
    enhanced = _enhance_with_headers(content)

    # Rough page count: ~3000 chars per page
    pages = max(1, len(content) // 3000)

    return enhanced, {"pages": pages, "headers": headers}


def _enhance_with_headers(content):
    """Add header context to sections for better retrieval.

    Each section gets a breadcrumb prefix:
    ## Methods > ### Training > [section content]
    """
    lines = content.split("\n")
    header_stack = []
    enhanced_lines = []

    for line in lines:
        # Check if line is a header
        match = re.match(r"^(#{1,6})\s+(.+)", line)
        if match:
            level = len(match.group(1))
            title = match.group(2).strip()

            # Trim stack to current level
            header_stack = [(l, t) for l, t in header_stack if l < level]
            header_stack.append((level, title))

            # Build breadcrumb
            breadcrumb = " > ".join(t for _, t in header_stack)
            enhanced_lines.append(f"\n[{breadcrumb}]\n{line}")
        else:
            enhanced_lines.append(line)

    return "\n".join(enhanced_lines)
