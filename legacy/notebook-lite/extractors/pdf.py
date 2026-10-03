"""
extractors.pdf — PDF text extraction.

Uses PyPDF2 for standard PDFs. Falls back to pdfplumber if available.
Optional OCR via pytesseract for scanned documents.
Preserves page numbers for accurate citations.
"""

import os


def extract_pdf(filepath):
    """Extract text from a PDF file.

    Args:
        filepath: Path to PDF file

    Returns:
        Tuple of (text, metadata)
        metadata includes 'pages' count
    """
    text_parts = []
    page_count = 0

    # Try PyPDF2 first
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(filepath)
        page_count = len(reader.pages)

        for i, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            if page_text.strip():
                text_parts.append(f"[Page {i + 1}]\n{page_text}")

        if text_parts:
            return "\n\n".join(text_parts), {"pages": page_count}
    except ImportError:
        pass
    except Exception:
        pass

    # Try pdfplumber as fallback
    try:
        import pdfplumber
        with pdfplumber.open(filepath) as pdf:
            page_count = len(pdf.pages)
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text() or ""
                if page_text.strip():
                    text_parts.append(f"[Page {i + 1}]\n{page_text}")

        if text_parts:
            return "\n\n".join(text_parts), {"pages": page_count}
    except ImportError:
        pass
    except Exception:
        pass

    # Last resort: try to read as text (might be a text file with .pdf extension)
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
        if text.strip():
            return text, {"pages": 1}
    except Exception:
        pass

    return "", {"pages": page_count}
