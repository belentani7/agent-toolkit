"""
engine.documents — Document storage and metadata management.

Handles CRUD operations for documents, chunks, and conversations
using SQLite as the persistent store.
"""

import os
import sqlite3
import struct
import json
from pathlib import Path
from datetime import datetime


class DocumentStore:
    """Manages document storage in SQLite."""

    def __init__(self, data_dir):
        self.data_dir = Path(data_dir)
        self.db_dir = self.data_dir / "data"
        self.db_dir.mkdir(parents=True, exist_ok=True)
        self.db_path = self.db_dir / "notebook.db"
        self._conn = None
        self._init_db()

    @property
    def conn(self):
        if self._conn is None:
            self._conn = sqlite3.connect(str(self.db_path))
            self._conn.row_factory = sqlite3.Row
            self._conn.execute("PRAGMA journal_mode=WAL")
            self._conn.execute("PRAGMA foreign_keys=ON")
        return self._conn

    def _init_db(self):
        """Initialize database schema."""
        # Try sqlite-vec virtual table first
        try:
            self.conn.execute("SELECT vec_version()")
            has_vec = True
        except Exception:
            has_vec = False

        self.conn.executescript(f"""
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                path TEXT UNIQUE NOT NULL,
                title TEXT NOT NULL,
                file_type TEXT,
                size INTEGER DEFAULT 0,
                chunks_count INTEGER DEFAULT 0,
                pages INTEGER DEFAULT 0,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS chunks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                document_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                chunk_index INTEGER NOT NULL,
                token_count INTEGER DEFAULT 0,
                {"embedding BLOB," if has_vec else "embedding TEXT,"}
                FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                sources TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_chunks_document
                ON chunks(document_id);
        """)

        # Try to create sqlite-vec virtual table
        if has_vec:
            try:
                self.conn.execute("""
                    CREATE VIRTUAL TABLE IF NOT EXISTS embeddings
                    USING vec0(
                        chunk_id INTEGER PRIMARY KEY,
                        embedding float[384]
                    )
                """)
            except Exception:
                pass  # Already exists or failed

        self.conn.commit()

    def add_document(self, path, title, file_type, size, chunks_count, pages=0):
        """Add or update a document. Returns document ID."""
        # Check if document already exists
        cursor = self.conn.execute(
            "SELECT id FROM documents WHERE path = ?", (path,)
        )
        existing = cursor.fetchone()

        if existing:
            doc_id = existing["id"]
            # Remove old chunks
            self.conn.execute("DELETE FROM chunks WHERE document_id = ?", (doc_id,))
            # Try to remove from vec table
            try:
                self.conn.execute(
                    "DELETE FROM embeddings WHERE chunk_id IN (SELECT id FROM chunks WHERE document_id = ?)",
                    (doc_id,),
                )
            except Exception:
                pass
            # Update document
            self.conn.execute("""
                UPDATE documents SET
                    title = ?, file_type = ?, size = ?,
                    chunks_count = ?, pages = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (title, file_type, size, chunks_count, pages, doc_id))
        else:
            cursor = self.conn.execute("""
                INSERT INTO documents (path, title, file_type, size, chunks_count, pages)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (path, title, file_type, size, chunks_count, pages))
            doc_id = cursor.lastrowid

        self.conn.commit()
        return doc_id

    def store_chunks(self, doc_id, chunks, embeddings):
        """Store chunks and their embeddings."""
        has_vec = False
        try:
            self.conn.execute("SELECT 1 FROM embeddings LIMIT 0")
            has_vec = True
        except Exception:
            pass

        for chunk, embedding in zip(chunks, embeddings):
            cursor = self.conn.execute("""
                INSERT INTO chunks (document_id, content, chunk_index, token_count, embedding)
                VALUES (?, ?, ?, ?, ?)
            """, (
                doc_id,
                chunk["content"],
                chunk["chunk_index"],
                chunk["token_count"],
                struct.pack(f"{len(embedding)}f", *embedding) if has_vec else json.dumps(embedding),
            ))
            chunk_id = cursor.lastrowid

            # Insert into vec table if available
            if has_vec:
                try:
                    emb_bytes = struct.pack(f"{len(embedding)}f", *embedding)
                    self.conn.execute("""
                        INSERT INTO embeddings (chunk_id, embedding)
                        VALUES (?, ?)
                    """, (chunk_id, emb_bytes))
                except Exception:
                    pass

        self.conn.commit()

    def remove_document(self, doc_id):
        """Remove a document and all its chunks/embeddings."""
        # Try removing from vec table
        try:
            self.conn.execute("""
                DELETE FROM embeddings
                WHERE chunk_id IN (SELECT id FROM chunks WHERE document_id = ?)
            """, (doc_id,))
        except Exception:
            pass

        self.conn.execute("DELETE FROM chunks WHERE document_id = ?", (doc_id,))
        self.conn.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
        self.conn.commit()

    def list_documents(self):
        """List all indexed documents."""
        cursor = self.conn.execute("""
            SELECT id, path, title, file_type, size, chunks_count, pages, added_at, updated_at
            FROM documents
            ORDER BY added_at DESC
        """)
        return [dict(row) for row in cursor.fetchall()]

    def get_by_title(self, title):
        """Find a document by title (partial match)."""
        cursor = self.conn.execute(
            "SELECT * FROM documents WHERE title LIKE ? ORDER BY added_at DESC LIMIT 1",
            (f"%{title}%",),
        )
        row = cursor.fetchone()
        return dict(row) if row else None

    def get_by_id(self, doc_id):
        """Find a document by ID."""
        try:
            doc_id = int(doc_id)
        except (ValueError, TypeError):
            return None
        cursor = self.conn.execute(
            "SELECT * FROM documents WHERE id = ?", (doc_id,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None

    def get_stats(self):
        """Get notebook statistics."""
        docs = self.conn.execute("SELECT COUNT(*) as c FROM documents").fetchone()["c"]
        chunks = self.conn.execute("SELECT COUNT(*) as c FROM chunks").fetchone()["c"]
        pages = self.conn.execute("SELECT COALESCE(SUM(pages), 0) as c FROM documents").fetchone()["c"]
        return {"documents": docs, "chunks": chunks, "pages": pages}

    def save_conversation(self, question, answer, sources):
        """Save a conversation exchange."""
        sources_json = json.dumps(
            [{"title": s["title"], "path": s["path"]} for s in sources]
        )
        self.conn.execute("""
            INSERT INTO conversations (question, answer, sources)
            VALUES (?, ?, ?)
        """, (question, answer, sources_json))
        self.conn.commit()

    def get_conversations(self, limit=100):
        """Get conversation history."""
        cursor = self.conn.execute("""
            SELECT id, question, answer, sources, timestamp
            FROM conversations
            ORDER BY timestamp DESC
            LIMIT ?
        """, (limit,))
        return [dict(row) for row in cursor.fetchall()]

    def close(self):
        """Close database connection."""
        if self._conn:
            self._conn.close()
            self._conn = None
