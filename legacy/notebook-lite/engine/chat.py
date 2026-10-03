"""
engine.chat — Chat engine for question answering.

Takes a question + retrieved chunks, constructs a prompt,
calls the LLM, and formats the response with citations.
"""

from pathlib import Path
from datetime import datetime

from .llm import LLMClient
from .documents import DocumentStore


SYSTEM_PROMPT = """You are notebook-lite, a precise research assistant.
You answer questions based ONLY on the provided context from the user's documents.
If the context doesn't contain enough information to answer, say so honestly.
Always cite your sources using [Source: filename] format.
Be concise but thorough. Use bullet points for lists.
Never make up information not found in the context."""


class ChatEngine:
    """Orchestrates question → context → LLM → cited answer."""

    def __init__(self, data_dir, config=None):
        self.data_dir = Path(data_dir)
        self.config = config or {}
        self.llm = LLMClient(self.config)
        self.store = DocumentStore(str(self.data_dir))
        self.history = []

    def answer(self, question, search_results, stream=False):
        """Generate an answer from search results.

        Args:
            question: User's question
            search_results: List of dicts from SearchEngine.search()
            stream: Whether to stream the response

        Returns:
            Dict with 'answer', 'sources', 'confidence'
        """
        if not search_results:
            return {
                "answer": "I don't have enough context in your documents to answer that question. Try adding more relevant documents or rephrasing.",
                "sources": [],
                "confidence": "none",
            }

        # Build context from search results
        context_parts = []
        sources = []
        seen_sources = set()

        for i, result in enumerate(search_results):
            title = result.get("title", "Unknown")
            content = result.get("content", "")
            score = result.get("score", 0)

            context_parts.append(
                f"[Document {i+1}: {title} (relevance: {score:.0%})]\n{content}"
            )

            source_key = f"{title}"
            if source_key not in seen_sources:
                seen_sources.add(source_key)
                sources.append({
                    "title": title,
                    "path": result.get("path", ""),
                    "chunk_index": result.get("chunk_index", 0),
                    "score": score,
                    "file_type": result.get("file_type", ""),
                })

        context = "\n\n---\n\n".join(context_parts)

        # Build prompt
        prompt = self._build_prompt(question, context)

        # Call LLM
        if stream:
            answer_text = self.llm.generate_stream(prompt)
        else:
            answer_text = self.llm.generate(prompt)

        # Determine confidence from average score
        avg_score = sum(r.get("score", 0) for r in search_results) / len(search_results)
        if avg_score > 0.8:
            confidence = "high"
        elif avg_score > 0.5:
            confidence = "medium"
        else:
            confidence = "low"

        response = {
            "answer": answer_text,
            "sources": sources,
            "confidence": confidence,
        }

        # Save to history
        self.history.append({
            "question": question,
            "answer": answer_text,
            "sources": [s["title"] for s in sources],
            "timestamp": datetime.now().isoformat(),
        })

        # Persist conversation
        try:
            self.store.save_conversation(question, answer_text, sources)
        except Exception:
            pass  # Non-critical

        return response

    def _build_prompt(self, question, context):
        """Construct the full prompt with context and question."""
        # Include recent history for conversational context
        history_text = ""
        if self.history:
            recent = self.history[-3:]  # Last 3 exchanges
            parts = []
            for h in recent[:-1]:  # Exclude current
                parts.append(f"Q: {h['question']}\nA: {h['answer']}")
            if parts:
                history_text = "\n\nPrevious conversation:\n" + "\n\n".join(parts)

        return f"""{SYSTEM_PROMPT}
{history_text}

---
CONTEXT FROM DOCUMENTS:
{context}
---

QUESTION: {question}

Provide a clear, accurate answer based on the context above. Cite sources as [Source: filename]."""

    def clear_history(self):
        """Clear conversation history."""
        self.history = []

    def close(self):
        """Clean up resources."""
        self.llm.close()
        self.store.close()
