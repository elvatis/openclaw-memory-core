# @elvatis_com/openclaw-memory-core

Core utilities for building OpenClaw memory plugins.

## What’s inside

- **Redaction**: conservative secret/token stripping before storage
- **Embeddings**: a deterministic local embedder (`HashEmbedder`) for offline semantic-ish search
- **Store**: JSONL-backed memory store with vector search (`JsonlMemoryStore`)
- **TTL/Expiry**: optional per-item expiration via `expiresAt` field

### TTL / Expiry

Set `expiresAt` (ISO 8601 string) on any `MemoryItem` to make it auto-expire:

```ts
import { ttlMs } from "@elvatis_com/openclaw-memory-core";

await store.add({
  id: "temp-1",
  kind: "note",
  text: "Remember this for 1 hour",
  createdAt: new Date().toISOString(),
  expiresAt: ttlMs(60 * 60 * 1000), // 1 hour from now
});
```

Expired items are automatically filtered from `get()`, `list()`, and `search()`. Pass `{ includeExpired: true }` to include them. Call `store.purgeExpired()` to physically remove expired items from storage.

## Why JSONL + Hash embeddings?

This MVP is designed to be:
- stable (no external services)
- safe (no hidden exfil)
- portable (single file storage)

You can swap the embedder later (OpenAI/Gemini/local model) without changing store API.

## License

MIT
