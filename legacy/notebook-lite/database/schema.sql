-- ═══════════════════════════════════════════════════════════════
--  notebook-lite database schema
--  SQLite + sqlite-vec for vector storage
-- ═══════════════════════════════════════════════════════════════

-- Documents: metadata about each indexed file
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,          -- Absolute file path
    title TEXT NOT NULL,                -- Display name (usually filename)
    file_type TEXT,                     -- Extension (.pdf, .md, .py, etc.)
    size INTEGER DEFAULT 0,            -- File size in bytes
    chunks_count INTEGER DEFAULT 0,    -- Number of text chunks
    pages INTEGER DEFAULT 0,           -- Page count (for PDFs)
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chunks: text segments extracted from documents
CREATE TABLE IF NOT EXISTS chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INTEGER NOT NULL,       -- Parent document
    content TEXT NOT NULL,              -- Chunk text content
    chunk_index INTEGER NOT NULL,       -- Position within document (0-based)
    token_count INTEGER DEFAULT 0,      -- Approximate token count
    embedding BLOB,                     -- Vector embedding (float32 array)
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- Vector index using sqlite-vec (requires sqlite-vec extension)
-- Creates efficient ANN search index over chunk embeddings
CREATE VIRTUAL TABLE IF NOT EXISTS embeddings USING vec0(
    chunk_id INTEGER PRIMARY KEY,
    embedding float[384]                -- 384 dimensions (all-MiniLM-L6-v2)
);

-- Conversations: history of Q&A exchanges
CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,             -- User's question
    answer TEXT NOT NULL,               -- LLM-generated answer
    sources TEXT,                       -- JSON array of source references
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_chunks_document ON chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_documents_path ON documents(path);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp DESC);
