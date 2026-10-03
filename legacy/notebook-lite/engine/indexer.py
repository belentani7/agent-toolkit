"""
engine.indexer — Document indexing pipeline.

Extracts text from files, chunks it, generates embeddings, and stores
everything in SQLite + sqlite-vec.
"""

import os
import hashlib
from pathlib import Path
from datetime import datetime

from .embeddings import EmbeddingEngine
from .documents import DocumentStore


class Indexer:
    """Indexes documents: extract → chunk → embed → store."""

    def __init__(self, data_dir, config=None):
        self.data_dir = Path(data_dir)
        self.config = config or {}
        self.chunk_size = self.config.get("chunk_size", 512)
        self.chunk_overlap = self.config.get("chunk_overlap", 50)
        self.store = DocumentStore(str(self.data_dir))
        self.embedder = EmbeddingEngine(self.config)

    def index_file(self, filepath):
        """Index a single file. Returns dict with chunks/pages counts."""
        filepath = Path(filepath).resolve()
        if not filepath.exists():
            raise FileNotFoundError(f"File not found: {filepath}")

        # Extract text
        text, metadata = self._extract(filepath)
        if not text or not text.strip():
            return {"chunks": 0, "pages": 0, "skipped": True}

        # Chunk text
        chunks = self._chunk(text)
        if not chunks:
            return {"chunks": 0, "pages": 0, "skipped": True}

        # Generate embeddings
        embeddings = self.embedder.encode_batch([c["text"] for c in chunks])

        # Store document and chunks
        doc_id = self.store.add_document(
            path=str(filepath),
            title=filepath.name,
            file_type=filepath.suffix,
            size=filepath.stat().st_size,
            chunks_count=len(chunks),
            pages=metadata.get("pages", 0),
        )

        # Store chunks with embeddings
        self.store.store_chunks(doc_id, chunks, embeddings)

        return {
            "chunks": len(chunks),
            "pages": metadata.get("pages", 0),
            "doc_id": doc_id,
        }

    def _extract(self, filepath):
        """Extract text from file based on type."""
        ext = filepath.suffix.lower()

        if ext == ".pdf":
            from extractors.pdf import extract_pdf
            return extract_pdf(str(filepath))

        elif ext == ".md":
            from extractors.markdown import extract_markdown
            return extract_markdown(str(filepath))

        elif ext in (".py", ".js", ".ts", ".java", ".cpp", ".c", ".go", ".rs", ".rb",
                      ".jsx", ".tsx", ".php", ".swift", ".kt", ".scala"):
            from extractors.code import extract_code
            return extract_code(str(filepath))

        elif ext in (".txt", ".csv", ".json", ".yaml", ".yml", ".xml", ".html",
                      ".log", ".ini", ".cfg", ".conf", ".env", ".toml"):
            from extractors.text import extract_text
            return extract_text(str(filepath))

        else:
            # Try as plain text
            try:
                from extractors.text import extract_text
                return extract_text(str(filepath))
            except Exception:
                raise ValueError(f"Unsupported file type: {ext}")

    def _chunk(self, text):
        """Split text into overlapping chunks."""
        # Rough token estimate: 1 token ≈ 4 chars
        chunk_chars = self.chunk_size * 4
        overlap_chars = self.chunk_overlap * 4

        chunks = []
        start = 0
        idx = 0

        while start < len(text):
            end = start + chunk_chars

            # Try to break at sentence boundary
            if end < len(text):
                # Look for sentence end in last 20% of chunk
                search_start = max(start, end - chunk_chars // 5)
                last_period = text.rfind(". ", search_start, end)
                last_newline = text.rfind("\n\n", search_start, end)
                break_point = max(last_period, last_newline)

                if break_point > start:
                    end = break_point + 1

            chunk_text = text[start:end].strip()
            if chunk_text:
                # Rough token count
                token_count = max(1, len(chunk_text) // 4)
                chunks.append({
                    "content": chunk_text,
                    "chunk_index": idx,
                    "token_count": token_count,
                })
                idx += 1

            start = end - overlap_chars
            if start >= len(text):
                break

        return chunks

    def remove_document(self, doc_id):
        """Remove a document and its chunks/embeddings."""
        self.store.remove_document(doc_id)

    def close(self):
        """Clean up resources."""
        self.store.close()
        self.embedder.close()
