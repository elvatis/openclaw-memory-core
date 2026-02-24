# @elvatis_com/openclaw-memory-core

Core utilities for building OpenClaw memory plugins.

## What’s inside

- **Redaction**: conservative secret/token stripping before storage
- **Embeddings**: a deterministic local embedder (`HashEmbedder`) for offline semantic-ish search
- **Store**: JSONL-backed memory store with vector search (`JsonlMemoryStore`)

## Why JSONL + Hash embeddings?

This MVP is designed to be:
- stable (no external services)
- safe (no hidden exfil)
- portable (single file storage)

You can swap the embedder later (OpenAI/Gemini/local model) without changing store API.

## License

MIT
