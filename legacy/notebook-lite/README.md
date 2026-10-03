<p align="center">
<pre>
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   ███╗   ██╗ ██████╗ ████████╗██████╗  ██████╗   ║
║   ████╗  ██║██╔═══██╗╚══██╔══╝██╔══██╗██╔═══██╗  ║
║   ██╔██╗ ██║██║   ██║   ██║   ██████╔╝██║   ██║  ║
║   ██║╚██╗██║██║   ██║   ██║   ██╔══██╗██║   ██║  ║
║   ██║ ╚████║╚██████╔╝   ██║   ██████╔╝╚██████╔╝  ║
║   ╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═════╝  ╚═════╝   ║
║              Your docs. Your questions.            ║
║           No cloud. No tracking. No limits.        ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
</pre>
</p>

<p align="center">
  <b>notebook-lite</b> — A personal research assistant that lives in your terminal.<br>
  Upload your documents. Ask questions. Get answers with source citations.<br>
  <i>Like NotebookLM, but lightweight, private, and offline-first.</i>
</p>

---

## ✨ Why notebook-lite?

> *"A memory palace that grows with you."*

You have textbooks, research papers, codebases, notes. Hundreds of pages of knowledge — scattered, unsearchable, forgotten.

**notebook-lite** turns all of it into a living conversation:

- 🔒 **Privacy-first** — everything stays on your machine. No data leaves your terminal.
- 🌐 **Offline-ready** — with Ollama, ask questions without internet. Freedom from surveillance.
- ⚡ **Fast** — 1000 pages indexed in under 2 minutes. Sub-second semantic search.
- 🧠 **Smart** — neural embeddings find connections you'd never search for by keyword. Hidden links emerge between documents.
- 📚 **Any format** — PDFs, Markdown, code (Python/JS/Java/C++), TXT, CSV, JSON, YAML.
- 🎯 **Cited answers** — every response points to the exact source. Page numbers, filenames, line context.

---

## 🚀 Quick Start

```bash
# Install
pip install notebook-lite

# Add documents to your notebook
notebook-lite add textbook.pdf
notebook-lite add research-papers/
notebook-lite add src/

# Ask a question
notebook-lite ask "What is the main theorem in chapter 3?"

# Start interactive chat
notebook-lite chat

# Search for a keyword
notebook-lite search "transformer architecture"
```

---

## 📦 Installation

```bash
# From PyPI
pip install notebook-lite

# From source
git clone https://github.com/belentani7/notebook-lite.git
cd notebook-lite
chmod +x install.sh
./install.sh
```

### Dependencies

- Python 3.7+
- sentence-transformers (embeddings, ~80MB model downloaded on first use)
- sqlite-vec (vector storage)
- PyPDF2 (PDF extraction)
- requests (LLM API calls)

### Optional

- [Ollama](https://ollama.ai) — local LLM for fully offline Q&A
- pytesseract — OCR for scanned PDFs

---

## 📖 Usage

### Adding Documents

```bash
# Single file
notebook-lite add document.pdf

# Entire directory (recursive)
notebook-lite add ./research-papers/

# Specific formats
notebook-lite add ./codebase/ --ext .py,.js,.ts
```

Supported formats: `.pdf`, `.md`, `.txt`, `.csv`, `.json`, `.yaml`, `.py`, `.js`, `.ts`, `.java`, `.cpp`, `.c`, `.go`, `.rs`, `.rb`

### Asking Questions

```bash
# One-off question
notebook-lite ask "How does attention work in transformers?"

# Chat mode — multi-turn conversation
notebook-lite chat

# Search by keyword
notebook-lite search "gradient descent"
```

### Managing Your Notebook

```bash
notebook-lite list        # See all indexed documents
notebook-lite stats       # Notebook statistics
notebook-lite remove doc  # Remove a document
notebook-lite export      # Export conversation history
```

---

## 🤖 LLM Backends

notebook-lite works with any LLM backend. Configure in `~/.notebook-lite/config.yaml`:

### Ollama (recommended, offline)

```yaml
llm:
  provider: ollama
  model: llama3.2
  url: http://localhost:11434
```

### OpenAI API

```yaml
llm:
  provider: openai
  model: gpt-4o-mini
  api_key: sk-...
```

### Qwen / DashScope

```yaml
llm:
  provider: qwen
  model: qwen-turbo
  api_key: sk-...
```

### No LLM? No problem.

Even without an LLM, notebook-lite gives you semantic search with source citations. It just won't synthesize an answer — but it'll point you to exactly where the answer lives.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLI (notebook-lite)               │
├────────────┬────────────┬────────────┬──────────────┤
│  extractors│   engine   │  display   │   database   │
│            │            │            │              │
│  pdf.py    │  indexer   │  response  │  SQLite +    │
│  markdown  │  embeddings│  chat UI   │  sqlite-vec  │
│  code.py   │  search.py │  progress  │              │
│  text.py   │  chat.py   │            │              │
│            │  llm.py    │            │              │
└────────────┴────────────┴────────────┴──────────────┘
```

---

## 🔧 Configuration

Config lives at `~/.notebook-lite/config.yaml`:

```yaml
embedding_model: all-MiniLM-L6-v2   # 80MB, fast, 384 dims
chunk_size: 512                       # tokens per chunk
chunk_overlap: 50                     # overlap for context continuity
top_k: 5                              # chunks to retrieve
llm:
  provider: ollama
  model: llama3.2
  url: http://localhost:11434
search:
  hybrid: true                        # combine vector + keyword
  keyword_weight: 0.3
```

---

## 🧪 Example Session

```
$ notebook-lite add papers/attention-is-all-you-need.pdf
✓ Indexed: attention-is-all-you-need.pdf (15 pages, 47 chunks)

$ notebook-lite ask "What problem does multi-head attention solve?"

Searching knowledge base...

┌─────────────────────────────────────────────────────┐
│ Multi-head attention allows the model to jointly     │
│ attend to information from different representation  │
│ subspaces at different positions. With a single      │
│ attention head, averaging inhibits this.             │
│                                                      │
│ It enables the model to capture different types of   │
│ relationships — syntactic and semantic — in parallel,│
│ rather than forcing one head to do all the work.     │
└─────────────────────────────────────────────────────┘

Sources:
  [1] attention-is-all-you-need.pdf, page 4
  [2] attention-is-all-you-need.pdf, page 5
  [3] attention-is-all-you-need.pdf, page 9

$ notebook-lite stats
📚 Documents: 12
📄 Pages:     247
🧩 Chunks:    1,834
💾 DB size:   24.3 MB
```

---

## 📜 License

MIT — Use it, fork it, build on it. Your knowledge, your rules.

---

<p align="center">
  <i>"Every document you add is a neural fingerprint woven into your memory palace.<br>
  Hidden patterns emerge. Connections reveal themselves.<br>
  The notebook remembers what you forgot you read."</i>
</p>
