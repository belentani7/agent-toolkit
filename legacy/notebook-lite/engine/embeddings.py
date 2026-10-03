"""
engine.embeddings — Embedding generation and management.

Uses sentence-transformers with all-MiniLM-L6-v2 (384-dim, 80MB).
Normalizes vectors for cosine similarity. Caches for efficiency.
"""

import numpy as np
from pathlib import Path


class EmbeddingEngine:
    """Generates and manages document embeddings."""

    def __init__(self, config=None):
        self.config = config or {}
        self.model_name = self.config.get("embedding_model", "all-MiniLM-L6-v2")
        self._model = None

    @property
    def model(self):
        """Lazy-load the model on first use."""
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(self.model_name)
            except ImportError:
                raise ImportError(
                    "sentence-transformers not installed. "
                    "Run: pip install sentence-transformers"
                )
        return self._model

    @property
    def dimensions(self):
        """Embedding dimensions (384 for MiniLM-L6-v2)."""
        return 384

    def encode(self, text):
        """Encode a single text to embedding vector."""
        embedding = self.model.encode(text, normalize_embeddings=True)
        return embedding.tolist()

    def encode_batch(self, texts, batch_size=64):
        """Encode a batch of texts to embedding vectors.

        Args:
            texts: List of text strings
            batch_size: Number of texts per batch

        Returns:
            List of embedding vectors (as lists of floats)
        """
        if not texts:
            return []

        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            normalize_embeddings=True,
            show_progress_bar=False,
        )

        return [emb.tolist() for emb in embeddings]

    def similarity(self, vec_a, vec_b):
        """Compute cosine similarity between two normalized vectors."""
        a = np.array(vec_a)
        b = np.array(vec_b)
        return float(np.dot(a, b))

    def close(self):
        """Release model resources."""
        self._model = None
