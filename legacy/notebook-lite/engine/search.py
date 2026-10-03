"""
engine.search — Semantic and hybrid search.

Performs vector similarity search using sqlite-vec.
Supports hybrid mode: combines vector + keyword scoring.
"""

import sqlite3
import struct
from pathlib import Path

from .embeddings import EmbeddingEngine


class SearchEngine:
    """Searches indexed documents using vector similarity."""

    def __init__(self, data_dir, config=None):
        self.data_dir = Path(data_dir)
        self.config = config or {}
        self.db_path = self.data_dir / "data" / "notebook.db"
        self.embedder = EmbeddingEngine(self.config)
        self.hybrid = self.config.get("search", {}).get("hybrid", True)
        self.keyword_weight = self.config.get("search", {}).get("keyword_weight", 0.3)
        self._conn = None

    @property
    def conn(self):
        if self._conn is None:
            self._conn = sqlite3.connect(str(self.db_path))
            self._conn.row_factory = sqlite3.Row
        return self._conn

    def search(self, query, top_k=5, doc_filter=None):
        """Search for relevant chunks.

        Args:
            query: Search query string
            top_k: Number of results to return
            doc_filter: Optional document ID to filter by

        Returns:
            List of dicts with content, score, document info
        """
        # Vector search
        vector_results = self._vector_search(query, top_k * 2 if self.hybrid else top_k, doc_filter)

        if self.hybrid and vector_results:
            # Keyword search
            keyword_results = self._keyword_search(query, top_k * 2, doc_filter)
            # Merge and re-rank
            results = self._hybrid_merge(vector_results, keyword_results, top_k)
        else:
            results = vector_results[:top_k]

        return results

    def _vector_search(self, query, top_k, doc_filter=None):
        """Vector similarity search using sqlite-vec."""
        query_embedding = self.embedder.encode(query)

        # Serialize embedding to bytes for sqlite-vec
        embedding_bytes = struct.pack(f"{len(query_embedding)}f", *query_embedding)

        try:
            sql = """
                SELECT
                    c.id as chunk_id,
                    c.content,
                    c.chunk_index,
                    c.document_id,
                    d.title,
                    d.path,
                    d.file_type,
                    vec_distance_cosine(e.embedding, ?) as distance
                FROM embeddings e
                JOIN chunks c ON c.id = e.chunk_id
                JOIN documents d ON d.id = c.document_id
            """
            params = [embedding_bytes]

            if doc_filter:
                sql += " WHERE c.document_id = ?"
                params.append(doc_filter)

            sql += " ORDER BY distance LIMIT ?"
            params.append(top_k)

            cursor = self.conn.execute(sql, params)
            rows = cursor.fetchall()

            results = []
            for row in rows:
                # distance → similarity (cosine distance = 1 - similarity)
                similarity = 1.0 - row["distance"] if row["distance"] is not None else 0.0
                results.append({
                    "chunk_id": row["chunk_id"],
                    "content": row["content"],
                    "chunk_index": row["chunk_index"],
                    "document_id": row["document_id"],
                    "title": row["title"],
                    "path": row["path"],
                    "file_type": row["file_type"],
                    "score": similarity,
                    "source_type": "vector",
                })

            return results

        except sqlite3.OperationalError:
            # Fallback: sqlite-vec might not be installed
            # Do in-memory comparison
            return self._fallback_vector_search(query_embedding, top_k, doc_filter)

    def _fallback_vector_search(self, query_embedding, top_k, doc_filter):
        """Fallback vector search without sqlite-vec virtual table."""
        import numpy as np

        sql = """
            SELECT c.id as chunk_id, c.content, c.chunk_index,
                   c.document_id, c.embedding,
                   d.title, d.path, d.file_type
            FROM chunks c
            JOIN documents d ON d.id = c.document_id
        """
        params = []
        if doc_filter:
            sql += " WHERE c.document_id = ?"
            params.append(doc_filter)

        cursor = self.conn.execute(sql, params)
        rows = cursor.fetchall()

        scored = []
        query_vec = np.array(query_embedding)
        for row in rows:
            if row["embedding"]:
                emb = np.array(eval(row["embedding"]))  # stored as JSON string
                sim = float(np.dot(query_vec, emb))
                scored.append({
                    "chunk_id": row["chunk_id"],
                    "content": row["content"],
                    "chunk_index": row["chunk_index"],
                    "document_id": row["document_id"],
                    "title": row["title"],
                    "path": row["path"],
                    "file_type": row["file_type"],
                    "score": sim,
                    "source_type": "vector",
                })

        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]

    def _keyword_search(self, query, top_k, doc_filter=None):
        """Simple keyword search using SQLite LIKE."""
        terms = query.lower().split()
        conditions = " AND ".join(
            ["c.content LIKE ?"] * len(terms)
        )
        params = [f"%{t}%" for t in terms]

        sql = f"""
            SELECT c.id as chunk_id, c.content, c.chunk_index,
                   c.document_id, d.title, d.path, d.file_type
            FROM chunks c
            JOIN documents d ON d.id = c.document_id
            WHERE {conditions}
        """
        if doc_filter:
            sql += " AND c.document_id = ?"
            params.append(doc_filter)

        sql += f" LIMIT {top_k}"

        cursor = self.conn.execute(sql, params)
        rows = cursor.fetchall()

        results = []
        for row in rows:
            # Simple scoring: count keyword matches
            content_lower = row["content"].lower()
            score = sum(1 for t in terms if t in content_lower) / max(len(terms), 1)
            results.append({
                "chunk_id": row["chunk_id"],
                "content": row["content"],
                "chunk_index": row["chunk_index"],
                "document_id": row["document_id"],
                "title": row["title"],
                "path": row["path"],
                "file_type": row["file_type"],
                "score": score,
                "source_type": "keyword",
            })

        return results

    def _hybrid_merge(self, vector_results, keyword_results, top_k):
        """Merge vector and keyword results using Reciprocal Rank Fusion."""
        scores = {}  # chunk_id → combined score
        result_map = {}

        # Vector results
        for rank, r in enumerate(vector_results):
            cid = r["chunk_id"]
            result_map[cid] = r
            vec_score = 1.0 / (rank + 1)
            scores[cid] = scores.get(cid, 0) + vec_score * (1 - self.keyword_weight)

        # Keyword results
        for rank, r in enumerate(keyword_results):
            cid = r["chunk_id"]
            if cid not in result_map:
                result_map[cid] = r
            kw_score = 1.0 / (rank + 1)
            scores[cid] = scores.get(cid, 0) + kw_score * self.keyword_weight

        # Sort by combined score
        ranked_ids = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

        results = []
        for cid in ranked_ids[:top_k]:
            r = result_map[cid]
            r["score"] = scores[cid]
            r["source_type"] = "hybrid"
            results.append(r)

        return results

    def close(self):
        """Close database connection."""
        if self._conn:
            self._conn.close()
            self._conn = None
        self.embedder.close()
